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