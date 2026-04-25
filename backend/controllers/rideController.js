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
exports.getRides = async (req, res) => {
    try {
        const { from, to, date } = req.query;

        let query = {};

        // 🔍 FROM filter (pickup or stops)
        if (from) {
            query.$or = [
                { "pickup.displayName": { $regex: from, $options: "i" } },
                { "stops.displayName": { $regex: from, $options: "i" } }
            ];
        }

        // 🔍 TO filter (destination or stops)
        if (to) {
            query.$and = [
                {
                    $or: [
                        { "destination.displayName": { $regex: to, $options: "i" } },
                        { "stops.displayName": { $regex: to, $options: "i" } }
                    ]
                }
            ];
        }

        // 📅 Date filter
        if (date) {
            query.date = date;
        }

        const rides = await Ride.find(query)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(rides);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
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