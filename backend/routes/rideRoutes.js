const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createRide } = require("../controllers/rideController");

router.post("/", authMiddleware, createRide);

module.exports = router;