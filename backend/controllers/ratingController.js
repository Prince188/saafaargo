const Rating = require("../models/Rating");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const User = require("../models/User");

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ratings  — Submit a rating for a completed ride.
// The rater must have been a participant (driver or confirmed passenger) of
// the completed ride, cannot rate themselves, and can rate once per target.
// A written review is required for scores of 3 or below.
// ─────────────────────────────────────────────────────────────────────────────
exports.submitRating = async (req, res) => {
    try {
        const { rideId, rateeId, score, review } = req.body;
        const raterId = req.user.id;

        if (!rideId || !rateeId) {
            return res.status(400).json({ message: "rideId and rateeId are required" });
        }
        const s = Number(score);
        if (!Number.isInteger(s) || s < 1 || s > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        if (rateeId === raterId) {
            return res.status(400).json({ message: "You cannot rate yourself" });
        }
        if (s <= 3 && !(review && String(review).trim())) {
            return res.status(400).json({ message: "A written review is required for ratings below 4" });
        }

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }
        if (ride.status !== "completed") {
            return res.status(400).json({ message: "You can only rate completed rides" });
        }

        const isDriver = ride.user && ride.user.toString() === raterId;

        if (isDriver) {
            // Driver → passenger: ratee must have been a confirmed passenger.
            const passenger = ride.passengers.find(p => p.user && p.user.toString() === rateeId);
            if (!passenger) {
                return res.status(400).json({ message: "This passenger did not travel on the ride" });
            }
        } else {
            // Passenger → driver: rater must have a completed booking.
            const booking = await Booking.findOne({ ride: rideId, user: raterId, status: "completed" });
            if (!booking) {
                return res.status(400).json({ message: "You were not a passenger on this ride" });
            }
            if (!ride.user || ride.user.toString() !== rateeId) {
                return res.status(400).json({ message: "You can only rate the driver of this ride" });
            }
        }

        const existing = await Rating.findOne({ ride: rideId, rater: raterId, ratee: rateeId });
        if (existing) {
            return res.status(400).json({ message: "You have already rated this ride" });
        }

        const rating = await Rating.create({
            ride: rideId,
            rater: raterId,
            ratee: rateeId,
            score: s,
            review: review ? String(review).trim() : "",
        });

        // Roll the new score into the ratee's aggregate rating.
        const user = await User.findById(rateeId);
        if (user) {
            const count = Number(user.ratingCount) || 0;
            const avg = Number(user.ratingAvg) || 0;
            const newCount = count + 1;
            const newAvg = count === 0 ? s : (avg * count + s) / newCount;
            user.ratingCount = newCount;
            user.ratingAvg = Math.round(newAvg * 10) / 10;
            await user.save();
        }

        res.status(201).json({
            success: true,
            message: "Rating submitted",
            rating: { ride: rideId, rater: raterId, ratee: rateeId, score: s, review: rating.review }
        });
    } catch (err) {
        console.error("[submitRating] Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/ratings/mine?ride=<rideId>  — Ratings the current user already
// submitted on a ride, so the app can show "You rated X ★" instead of the
// rate prompt.
// ─────────────────────────────────────────────────────────────────────────────
exports.getMyRatings = async (req, res) => {
    try {
        const { ride } = req.query;
        if (!ride) {
            return res.status(400).json({ message: "ride is required" });
        }
        const ratings = await Rating.find({ ride, rater: req.user.id })
            .select("ratee score review")
            .lean();

        res.json({
            success: true,
            ratings: ratings.map(r => ({
                ratee: r.ratee,
                score: r.score,
                review: r.review,
            })),
        });
    } catch (err) {
        console.error("[getMyRatings] Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
