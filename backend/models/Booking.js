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
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);