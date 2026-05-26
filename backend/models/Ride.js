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
    totalSeats: {
        type: Number,
        required: true,
    },

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

    totalDistanceKm: {
        type: Number,
        default: 0,
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

    pricePerSeat: {
        type: Number,
        default: 0,
        // Per-seat price for the full pickup→destination route.
        // Calculated as: Math.round((distanceKm * perkmprice) / (seatsAvailable + 1))
        // (+1 accounts for the driver — cost split among all occupants)
        // Set on creation (RideReview sends totalPricePerSeat → map it here)
        // and recalculated on every edit.
    },

    totalEarning: {
        type: Number,
        default: 0,
        // Total driver earns if ALL seats are filled for the full route.
        // Calculated as: Math.round(distanceKm * perkmprice)
        // MyRide.jsx already reads ride.totalEarning — it will now be accurate.
    },

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