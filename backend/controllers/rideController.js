const Ride = require("../models/Ride");

const createRide = async (req, res) => {
    try {
        const {
            pickup,
            destination,
            stops,
            date,
            time,
            seats,
            selectedCar
        } = req.body;

        const ride = new Ride({
            user: req.user.id, // from authMiddleware
            pickup,
            destination,
            stops,
            date,
            time,
            seatsAvailable: seats,
            car: selectedCar
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

module.exports = { createRide };