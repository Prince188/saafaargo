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

    // Rapido-style pickup handshake: each *confirmed* booking gets its own
    // 4-digit code shown on the passenger's phone. At pickup the passenger
    // shows it to the driver, who enters it to mark this passenger onboard.
    pickupOtp: {
        type: String,
        select: false,
    },

    // True once the driver verified this passenger's pickup code.
    pickedUp: {
        type: Boolean,
        default: false,
    },

    pickedUpAt: Date,

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);