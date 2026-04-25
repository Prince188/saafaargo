const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createRide, getRides, getMyRides, getRideById } = require("../controllers/rideController");

router.post("/", authMiddleware, createRide);

router.get("/", getRides );

router.get("/my-rides" , authMiddleware , getMyRides)

router.get("/:id" , getRideById)

module.exports = router;