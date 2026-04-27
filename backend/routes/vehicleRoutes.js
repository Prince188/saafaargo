const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    createVehicle,
    getMyVehicles,
    deleteVehicle,
    getMyOneVehicle,
    updateVehicle,
    getAvailableVehicles
} = require("../controllers/vehicleController");

//PRE- FIX IS /api/vehicles 

// Add vehicle
router.post("/", authMiddleware, createVehicle);

// Fetch All Vehicles
router.get("/", authMiddleware, getMyVehicles);

// ✅ FIX: PUT THIS BEFORE "/:id"
router.get("/available", authMiddleware, getAvailableVehicles);

// Fetch Specific Vehicle
router.get("/:id", authMiddleware, getMyOneVehicle);

// Update
router.put("/:id", authMiddleware, updateVehicle);

// Delete
router.delete("/:id", authMiddleware, deleteVehicle);

module.exports = router;