const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    pickup: Object,
    destination: Object,

    stops: [
        {
            lat: Number,
            lng: Number,
            address: String,
            city: String,
            displayName: String,
            price: Number
        }
    ],

    date: String,
    time: String,

    seatsAvailable: Number,

    car: {
        brand: String,
        model: String,
        color: String,
        numberPlate: String,
        seats: Number
    },

    perkmprice: {
        type: Number,
        required: true,
        default: 9
    },

    // ─── Ride Visibility Status (NEW) ──────────────────────────────────────
    status: {
        type: String,
        enum: ["pending", "published", "cancelled", "completed"],
        default: "pending"
        // "pending"   → driver not yet verified; ride hidden from passenger search
        // "published" → driver verified; ride visible to everyone
    },
    // ──────────────────────────────────────────────────────────────────────

    passengers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
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
            amountPaid: Number,
            seatsBooked: {
                type: Number,
                default: 1
            }
        }
    ],

}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);