const Booking = require("../models/Booking");
const Ride = require("../models/Ride");
const User = require("../models/User");

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/rides  — PATCHED: sets status based on driver verification
// ─────────────────────────────────────────────────────────────────────────────
exports.createRide = async (req, res) => {
    try {
        const {
            pickup,
            destination,
            stops,
            date,
            time, 
            seatsAvailable,
            car,
            perkmprice
        } = req.body;

        // ── Check if driver is already verified ───────────────────────────
        const driver = await User.findById(req.user.id).select("driverVerified");
        const rideStatus = driver?.driverVerified ? "published" : "pending";
        // ─────────────────────────────────────────────────────────────────

        const ride = new Ride({
            user: req.user.id,
            pickup: req.body.pickup,
            destination: req.body.destination,
            stops: req.body.stops,
            date: req.body.date,
            time: req.body.time,
            seatsAvailable: req.body.seatsAvailable,
            car: req.body.car,
            perkmprice,
            status: rideStatus,               // ← NEW
        });

        await ride.save();

        res.status(201).json({
            success: true,
            message: rideStatus === "published"
                ? "Ride created successfully"
                : "Ride saved. It will go live once your documents are verified.",
            ride,
            rideStatus,                               // ← NEW (frontend reads this)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

const normalize = (str) =>
    str?.toLowerCase().replace(/\s+/g, " ")
        .trim();

const isRouteMatch = (ride, from, to) => {
    const route = [
        ride.pickup.displayName,
        ...(ride.stops?.map(s => s.displayName) || []),
        ride.destination.displayName
    ].map(normalize);

    const fromKey = normalize(from);
    const toKey = normalize(to);

    const fromIdx = route.findIndex(r => r.includes(fromKey));
    const toIdx = route.findIndex(r => r.includes(toKey));

    return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
};

const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const getSegmentDistance = (ride, from, to) => {
    const route = [
        ride.pickup,
        ...(ride.stops || []),
        ride.destination,
    ];

    const fromKey = normalize(from);
    const toKey = normalize(to);

    const fromIndex = route.findIndex(r => normalize(r.displayName).includes(fromKey));
    const toIndex = route.findIndex(r => normalize(r.displayName).includes(toKey));

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return 0;

    let totalKm = 0;
    for (let i = fromIndex; i < toIndex; i++) {
        const a = route[i];
        const b = route[i + 1];
        totalKm += getDistanceInKm(a.lat, a.lng, b.lat, b.lng);
    }
    return totalKm;
};

const getDynamicPrice = (ride, from, to) => {
    const distance = getSegmentDistance(ride, from, to);
    console.log("SEGMENT DISTANCE:", distance);
    console.log("PER KM PRICE:", ride.perkmprice);
    if (!distance || !ride.perkmprice) return 0;
    const price = distance * Number(ride.perkmprice);
    console.log("FINAL PRICE:", price);
    return Math.round(price);
};

const formatTime = (minutesFromMidnight) => {
    const h = Math.floor(minutesFromMidnight / 60);
    const m = Math.floor(minutesFromMidnight % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const getSegmentTime = (ride, from, to) => {
    const route = [
        ride.pickup,
        ...(ride.stops || []),
        ride.destination,
    ];

    const fromKey = normalize(from);
    const toKey = normalize(to);

    const [h, m] = ride.time.split(":").map(Number);
    let minutes = h * 60 + m;

    let pickupTime = null;
    let dropTime = null;

    for (let i = 0; i < route.length - 1; i++) {
        const start = route[i];
        const end = route[i + 1];
        const startName = normalize(start.displayName);
        const endName = normalize(end.displayName);
        const distance = getDistanceInKm(start.lat, start.lng, end.lat, end.lng);
        const travelMinutes = distance * 2;

        if (!pickupTime && startName.includes(fromKey)) {
            pickupTime = minutes;
        }
        minutes += travelMinutes;
        if (endName.includes(toKey)) {
            dropTime = minutes;
            break;
        }
    }

    if (!pickupTime || !dropTime) return null;
    return {
        pickupTime: formatTime(pickupTime),
        dropTime: formatTime(dropTime),
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/rides  — PATCHED: only return status:"published" rides to passengers
// ─────────────────────────────────────────────────────────────────────────────
exports.getRides = async (req, res) => {
    try {
        const { from, to, date, seats } = req.query;
        const requestedSeats = parseInt(seats) || 1;

        let dbQuery = {
            status: "published",              // ← NEW: hide pending rides
            seatsAvailable: { $gte: requestedSeats }
        };

        if (date) dbQuery.date = date;

        console.log("FROM:", from);
        console.log("TO:", to);

        const candidates = await Ride.find(dbQuery)
            .populate("user", "firstName lastName email profilePic")
            .sort({ time: 1 })
            .lean();

        console.log("SAMPLE RIDE USER:", candidates[0]?.user);
        console.log("DEBUG FROM:", from);
        console.log("DEBUG TO:", to);
        console.log("CANDIDATES:", candidates.length);

        let rides = candidates;

        if (from && to) {
            rides = candidates
                .filter((ride) => {
                    try {
                        return isRouteMatch(ride, from, to);
                    } catch (e) {
                        console.log("isRouteMatch error:", e);
                        return false;
                    }
                })
                .map((ride) => {
                    let price = 0;
                    let timeData = null;
                    try {
                        price = getDynamicPrice(ride, from, to);
                        timeData = getSegmentTime(ride, from, to);
                    } catch (e) {
                        console.log("error:", e);
                        price = 0;
                    }
                    return {
                        ...ride,
                        segmentPrice: price,
                        userPickupTime: timeData?.pickupTime,
                        userDropTime: timeData?.dropTime,
                    };
                });
        }

        res.json({ success: true, count: rides.length, rides });

    } catch (err) {
        console.error("[getRides] Error:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Everything below is UNCHANGED from your original file
// ─────────────────────────────────────────────────────────────────────────────

exports.getMyRides = async (req, res) => {
    try {
        console.log("USER:", req.user);

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const rides = await Ride.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json(rides);

    } catch (err) {
        console.error("MY RIDES ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate("user", "_id firstName lastName email profilePic")
            .populate("passengers.user", "_id firstName lastName email");

        if (!ride) {
            return res.status(404).json({ error: "Ride not found" });
        }

        const isDriver = req.user?.id === ride.user?._id.toString();

        if (!isDriver) {
            ride.passengers = ride.passengers.map((passenger) => ({
                ...passenger.toObject(),
                phone: undefined,
            }));
        }

        res.json({ success: true, ride, isDriver });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.bookRide = async (req, res) => {
    try {
        const { seats, segmentPrice, from, to } = req.body;
        const rideId = req.params.id;
        const userId = req.user.id;

        const seatsCount = Number(seats);
        if (!seatsCount || seatsCount <= 0) {
            return res.status(400).json({ message: "Invalid seats count" });
        }

        const ride = await Ride.findById(rideId).populate("user");
        if (!ride) return res.status(404).json({ message: "Ride not found" });

        if (ride.user._id.toString() === userId) {
            return res.status(400).json({ message: "You cannot book your own ride" });
        }

        if (ride.seatsAvailable < seatsCount) {
            return res.status(400).json({ message: "Not enough seats available" });
        }

        const alreadyBooked = await Booking.findOne({
            ride: rideId,
            user: userId,
            status: "confirmed"
        });
        if (alreadyBooked) {
            return res.status(400).json({ message: "You already booked this ride" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const pricePerSeat = segmentPrice && Number(segmentPrice) > 0
            ? Number(segmentPrice)
            : ride.perkmprice;
        const amount = pricePerSeat * seatsCount;

        const booking = await Booking.create({
            ride: rideId,
            user: userId,
            name: user.firstName + " " + user.lastName,
            phone: user.mobile,
            email: user.email,
            seatsBooked: seatsCount,
            amountPaid: amount,
            from: from || ride.pickup,
            to: to || ride.destination
        });

        if (!ride.passengers) ride.passengers = [];

        ride.passengers.push({
            user: userId,
            name: booking.name,
            phone: booking.phone,
            email: booking.email,
            from: booking.from,
            to: booking.to,
            amountPaid: amount,
            seatsBooked: seatsCount
        });

        ride.seatsAvailable -= seatsCount;
        await ride.save();

        return res.status(201).json({ message: "Ride booked successfully", booking });

    } catch (err) {
        console.error("BOOK RIDE ERROR:", err);
        return res.status(500).json({ message: err.message || "Server error" });
    }
};

exports.deleteRide = async (req, res) => {
    try {
        const rideId = req.params.id;
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ success: false, message: "Ride not found" });
        }

        if (ride.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Ride.findByIdAndDelete(rideId);
        res.status(200).json({ success: true, message: "Ride deleted successfully" });

    } catch (error) {
        console.log("Delete ride error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find()
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, rides });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};