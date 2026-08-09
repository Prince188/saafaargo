const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: String,
    phone: String,
    email: String,

    from: {
        lat: Number,
        lng: Number,
        displayName: String
    },

    to: {
        lat: Number,
        lng: Number,
        displayName: String
    },

    seatsBooked: {
        type: Number,
        default: 1
    },

    amountPaid: Number,

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "declined", "completed"],
        default: "pending"
        // "pending"   → passenger requested, waiting for driver to accept/decline (seats HELD)
        // "confirmed" → driver accepted, seats reduced from ride.seatsAvailable
        // "declined"  → driver rejected the request (seats released)
        // "cancelled" → passenger cancelled (seats released)
        // "completed" → ride completed
    },

    // True once the passenger verified the ride's pickup OTP (trip started).
    pickedUp: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);