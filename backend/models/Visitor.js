const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    ip: String,
    date: String
}, { timestamps: true });

// 👇 IMPORTANT LINE
visitorSchema.index({ ip: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Visitor", visitorSchema);