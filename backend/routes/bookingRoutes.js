const express = require("express");
const router = express.Router();

const { bookRide } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Final endpoint
router.post("/rides/:id/book", authMiddleware, bookRide);

module.exports = router;