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
            location: Object,
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
    }

}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);