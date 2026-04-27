const Ride = require("../models/Ride");

exports.createRide = async (req, res) => {
    try {
        const {
            pickup,
            destination,
            stops,
            date,
            time,
            seatsAvailable,
            car
        } = req.body;

        const ride = new Ride({
            user: req.user.id, // if using auth

            pickup: req.body.pickup,
            destination: req.body.destination,
            stops: req.body.stops,

            date: req.body.date,
            time: req.body.time,

            seatsAvailable: req.body.seatsAvailable, // ✅ ADD THIS
            car: req.body.car                        // ✅ ADD THIS
        });

        await ride.save();

        res.status(201).json({
            success: true,
            message: "Ride created successfully",
            ride
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔥 GET ALL / SEARCH RIDES

const buildRoute = (ride) => {
    return [
        {
            name: ride.pickup.displayName?.toLowerCase().trim(),
            type: "pickup",
            price: null,
        },
        ...(ride.stops || []).map((stop) => ({
            name: stop.displayName?.toLowerCase().trim(),
            type: "stop",
            price: stop.price,
        })),
        {
            name: ride.destination.displayName?.toLowerCase().trim(),
            type: "destination",
            price: ride.pricePerSeat ?? null,
        },
    ];
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — check if user's from→to exists in ride's route in correct order
// ─────────────────────────────────────────────────────────────────────────────
const isRouteMatch = (ride, from, to) => {
    const route = buildRoute(ride);

    const fromKey = from?.toLowerCase().trim();
    const toKey = to?.toLowerCase().trim();

    const fromIdx = route.findIndex((node) =>
        node.name?.includes(fromKey)
    );

    const toIdx = route.findIndex((node) =>
        node.name?.includes(toKey)
    );

    return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — get price for user's specific segment
// The destination node's price is used (each stop carries its own price)
// ─────────────────────────────────────────────────────────────────────────────
const getSegmentPrice = (ride, to) => {
    const route = buildRoute(ride);

    const toKey = to?.toLowerCase().trim();

    const toNode = route.find((node) =>
        node.name?.includes(toKey)
    );

    return toNode?.price ?? null;
};

const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Earth radius in KM

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

    const fromKey = from.toLowerCase().trim();
    const toKey = to.toLowerCase().trim();

    const fromNode = route.find((r) =>
        r.displayName.toLowerCase().includes(fromKey)
    );

    const toNode = route.find((r) =>
        r.displayName.toLowerCase().includes(toKey)
    );

    if (!fromNode || !toNode) return 0;

    return getDistanceInKm(
        fromNode.lat,
        fromNode.lng,
        toNode.lat,
        toNode.lng
    );
};

const getDynamicPrice = (ride, from, to) => {
    const distance = getSegmentDistance(ride, from, to);

    const pricePerKm = ride.pricePerKm || 10; // default ₹10/km

    return Math.round(distance * pricePerKm);
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Search available rides
// @route   GET /api/rides?from=Bayad&to=Ahmedabad&date=2026-04-26&seats=2
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getRides = async (req, res) => {
    try {
        const { from, to, date, seats } = req.query;
        const requestedSeats = parseInt(seats) || 1;

        // ── Step 1: DB-level filter (fast — uses indexes) ─────────────────────
        // Broad match on pickup/destination/stops for from and to.
        // Route-order validation happens in JS below (can't do in Mongo query).
        let dbQuery = {};

        if (from) {
            dbQuery.$or = [
                { "pickup.displayName": { $regex: from, $options: "i" } },
                { "destination.displayName": { $regex: from, $options: "i" } },
                { "stops.displayName": { $regex: from, $options: "i" } },
            ];
        }

        if (to) {
            dbQuery.$and = [
                {
                    $or: [
                        { "pickup.displayName": { $regex: to, $options: "i" } },
                        { "destination.displayName": { $regex: to, $options: "i" } },
                        { "stops.displayName": { $regex: to, $options: "i" } },
                    ],
                },
            ];
        }

        if (date) {
            dbQuery.date = date;
        }

        // Always filter by seats at DB level
        dbQuery.seatsAvailable = { $gte: requestedSeats };

        const candidates = await Ride.find(dbQuery)
            .populate("user", "name email photo")
            .sort({ time: 1 }) // earliest departure first
            .lean();

        // ── Step 2: JS-level route-order check ───────────────────────────────
        // Removes rides where from and to exist but are in wrong direction.
        // e.g. user wants Ahmedabad→Bayad but ride goes Bayad→Ahmedabad → excluded.
        let rides = candidates;

        if (from && to) {
            rides = candidates
                .filter((ride) => isRouteMatch(ride, from, to))
                .map((ride) => ({
                    ...ride,
                    segmentPrice: getDynamicPrice(ride, from, to), // price for their segment
                }));
        }

        res.json({
            success: true,
            count: rides.length,
            rides,
        });

    } catch (err) {
        console.error("[getRides] Error:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

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
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ error: "Ride not found" });
        }

        res.json(ride);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};