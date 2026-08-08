const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    profilePic: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["active", "block"],
        default: "active"
    },

    // ─── Account Verification ──────────────────────────────────────────────
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none"
    },

    // ─── Driver Verification ───────────────────────────────────────────────
    driverVerified: {
        type: Boolean,
        default: false
    },
    driverVerificationStatus: {
        type: String,
        enum: ["none", "pending", "verified", "rejected"],
        default: "none"
    },
    driverDocuments: {
        dlImage: { type: String, default: "" },
        rcImage: { type: String, default: "" },
        submittedAt: { type: Date }
    },

    // ─── Push notifications (FCM device tokens) ────────────────────────────
    deviceToken: {
        type: [String],
        default: []
    }
    // ──────────────────────────────────────────────────────────────────────
},
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);