const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
        required: true
    },

    // Who submitted the rating.
    rater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Who is being rated (driver or passenger).
    ratee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    score: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    // Written review (required for ratings of 3 or below).
    review: {
        type: String,
        default: ""
    },
}, { timestamps: true });

// One rating per user per target per ride.
ratingSchema.index({ ride: 1, rater: 1, ratee: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
