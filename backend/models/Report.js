const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
    },
    reason: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);