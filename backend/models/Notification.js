const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["ride_modified", "ride_cancelled", "ride_completed", "ride_booked", "booking_request", "booking_confirmed", "booking_declined", "ride_departure_reminder"],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);