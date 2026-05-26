const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    ip: String,
    visitorId: String,
    date: String,
    count: { type: Number, default: 1 },
    userId: String,
    email: String
}, { timestamps: true });

// 👇 IMPORTANT LINE
visitorSchema.index({ visitorId: 1, date: 1, email: 1 }, { unique: true });

const Visitor = mongoose.model("Visitor", visitorSchema);

// Drop the old index if it exists to avoid MongoDB key constraints on duplicate IP / empty values
Visitor.collection.dropIndex("ip_1_date_1").catch(err => {
    // Silent fail if index doesn't exist
});
Visitor.collection.dropIndex("visitorId_1_date_1").catch(err => {
    // Silent fail if index doesn't exist
});

module.exports = Visitor;