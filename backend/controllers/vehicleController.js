const Vehicle = require('../models/Vehicle');

// Create a new vehicle

exports.createVehicle = async (req, res) => {
    try {
        const { brand, model, color, numberPlate, seats } = req.body;

        const newVehicle = await Vehicle.create({
            userId: req.user.id,
            brand,
            model,
            color,
            numberPlate,
            seats
        });

        res.status(201).json(newVehicle);
    } catch (error) {
        console.log('Error creating vehicle:', error);
        res.status(500).json({ message: 'Error creating vehicle', error: error.message });
    }
}

// Get all my vehicles

exports.getMyVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ userId: req.user.id });
        res.status(200).json(vehicles);
    } catch (error) {
        console.log('Error fetching vehicles:', error);
        res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
    }
}

// Get Specific Vehicle

exports.getMyOneVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        res.json(vehicle);
    } catch (error) {
        console.log("Error : ", error);
        res.status(500).json({ message: 'Error fetching One vehicles', error: error.message });

    }
}

//Update

exports.updateVehicle = async (req, res) => {
    try {
        const updated = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updated);

    } catch (err) {
        res.status(500).json({ message: "Error updating vehicle" });
    }
};

// Delete a vehicle

exports.deleteVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const vehicle = await Vehicle.findByIdAndDelete(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.log('Error deleting vehicle:', error);
        res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
    }
}