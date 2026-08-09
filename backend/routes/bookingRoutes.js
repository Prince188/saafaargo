const express = require("express");

const router = express.Router();

const {
    bookRide,
    getMyTrips,
    cancelTrip,
    getDriverRequests,
    acceptBooking,
    declineBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");


// Book Ride
router.post("/rides/:id/book", authMiddleware, bookRide);

// My Trips
router.get("/my-trips", authMiddleware, getMyTrips);

// Cancel Trip
router.put("/cancel/:id", authMiddleware, cancelTrip);

// Driver: pending booking requests across all of their rides
router.get("/requests", authMiddleware, getDriverRequests);

// Driver: accept / decline a pending booking request
router.post("/:id/accept", authMiddleware, acceptBooking);
router.post("/:id/decline", authMiddleware, declineBooking);


module.exports = router;