const express = require("express");

const router = express.Router();

const {
    bookRide,
    getMyTrips,
    cancelTrip
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");


// Book Ride
router.post("/rides/:id/book", authMiddleware, bookRide);

// My Trips
router.get("/my-trips", authMiddleware, getMyTrips);

// Cancel Trip
router.put("/cancel/:id", authMiddleware, cancelTrip);


module.exports = router;