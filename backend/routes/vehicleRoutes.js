const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createVehicle,
    getMyVehicles,
    deleteVehicle,
    getMyOneVehicle,
    updateVehicle
} = require("../controllers/vehicleController");

console.log("authMiddleware:", authMiddleware);
console.log("createVehicle:", createVehicle);
console.log("getMyVehicles:", getMyVehicles);
console.log("deleteVehicle:", deleteVehicle);

// Add vehicle
router.post("/", authMiddleware, createVehicle);

// Fetch All Vehicles

router.get("/", authMiddleware, getMyVehicles);

// Fetch Specific Vehicle

router.get("/:id" , authMiddleware , getMyOneVehicle)

//Update 

router.put("/:id", authMiddleware, updateVehicle);

// Delete Specific Vehicle

router.delete("/:id", authMiddleware, deleteVehicle);

module.exports = router;