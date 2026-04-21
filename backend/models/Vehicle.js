const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    numberPlate: {
        type: String,
        required: true,
        unique: true
    },
    seats: {
        type: Number,
        required: true
    },
},
    { timestamps: true }
)

module.exports = mongoose.model('Vehicle', vehicleSchema);