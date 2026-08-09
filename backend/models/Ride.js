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
            price: Number,
            distanceFromPickup: Number,
        }
    ],

    date: String,
    time: String,

    seatsAvailable: Number,
    totalSeats: {
        type: Number,
        required: true,
    },

    // Seats currently HELD by pending (unconfirmed) booking requests.
    // Not subtracted from seatsAvailable until a request is accepted; used to
    // prevent over-booking and released on accept/decline/cancel.
    heldSeats: {
        type: Number,
        default: 0,
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

    preferences: {
        womenOnly: { type: Boolean, default: false },
        noPets: { type: Boolean, default: false },
        noSmoking: { type: Boolean, default: false },
        noFood: { type: Boolean, default: false },
        musicFriendly: { type: Boolean, default: false },
        talkFriendly: { type: Boolean, default: false },
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
        // Accumulated actual earnings from bookings.
        // Each time a seat is booked, the booking amount is added.
    },

    // True once the ~30-min-before-departure reminder has been pushed to the
    // driver + confirmed passengers, so it only fires once per ride.
    departureReminderSent: {
        type: Boolean,
        default: false,
    },

    // ─── Pickup OTP handshake (trip start) ──────────────────────────────────
    // Set when the driver taps "Start trip": a single 4-digit code shared with
    // every confirmed passenger of the ride to verify pickup in-app.
    // `pickupOtp` must NEVER be exposed to non-drivers in any API response.
    tripStartedAt: {
        type: Date,
    },
    pickupOtp: {
        type: String,
    },
    // ───────────────────────────────────────────────────────────────────────

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