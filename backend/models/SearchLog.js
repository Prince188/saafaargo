const mongoose = require("mongoose");

const searchLogSchema = new mongoose.Schema(
    {
        from: {
            type: String,
            required: true,
            trim: true,
        },
        to: {
            type: String,
            required: true,
            trim: true,
        },
        fromCity: {
            type: String,
            trim: true,
            index: true,
        },
        toCity: {
            type: String,
            trim: true,
            index: true,
        },
        routeKey: {
            type: String,
            trim: true,
            index: true,
        },
        travelDate: {
            type: String,
            trim: true,
        },
        seats: {
            type: Number,
            default: 1,
        },
        resultsCount: {
            type: Number,
            default: 0,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        ip: {
            type: String,
            default: "",
        },
        userAgent: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

searchLogSchema.index({ routeKey: 1, createdAt: -1 });
searchLogSchema.index({ createdAt: -1 });

const SearchLog = mongoose.model("SearchLog", searchLogSchema);

module.exports = SearchLog;
