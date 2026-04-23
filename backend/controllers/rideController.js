const Vehicle = require("../models/Vehicle");

exports.startRide = async (req, res) => {
    try {
        const { vehicleId } = req.body;

        // mark vehicle as in use
        await Vehicle.findByIdAndUpdate(vehicleId, {
            isInUse: true
        });

        res.json({ message: "Ride started" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.endRide = async (req, res) => {
    try {
        const { vehicleId } = req.body;

        await Vehicle.findByIdAndUpdate(vehicleId, {
            isInUse: false
        });

        res.json({ message: "Ride ended" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};