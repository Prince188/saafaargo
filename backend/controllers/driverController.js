const User = require("../models/User");
const Ride = require("../models/Ride");

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/rides/driver/submit-documents
// User uploads DL + RC for the first time (or after rejection)
// ─────────────────────────────────────────────────────────────────────────────
exports.submitDocuments = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Already fully verified — nothing to do
        if (user.driverVerified) {
            return res.status(400).json({ message: "Driver already verified" });
        }

        const dlImage = req.files?.dlImage?.[0]?.path || "";
        const rcImage = req.files?.rcImage?.[0]?.path || "";

        if (!dlImage || !rcImage) {
            return res.status(400).json({ message: "Both DL and RC images are required" });
        }

        user.driverDocuments = { dlImage, rcImage, submittedAt: new Date() };
        user.driverVerificationStatus = "pending";
        await user.save();

        res.status(200).json({
            message: "Documents submitted. Awaiting admin approval.",
            driverVerificationStatus: "pending"
        });

    } catch (err) {
        console.error("submitDocuments error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/rides/driver/verification-status
// Frontend calls this before the publish button to decide what modal to show
// ─────────────────────────────────────────────────────────────────────────────
exports.getVerificationStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("driverVerified driverVerificationStatus driverDocuments");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            driverVerified: user.driverVerified,
            driverVerificationStatus: user.driverVerificationStatus,
            submittedAt: user.driverDocuments?.submittedAt || null
        });

    } catch (err) {
        console.error("getVerificationStatus error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: GET /api/admin/drivers?status=pending
// List drivers filtered by verification status (default: all who submitted docs)
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllDrivers = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status
            ? { driverVerificationStatus: status }
            : { driverVerificationStatus: { $ne: "none" } };

        const drivers = await User.find(filter).select(
            "firstName lastName email mobile driverVerified driverVerificationStatus driverDocuments createdAt"
        );

        res.status(200).json({ success: true, drivers });

    } catch (err) {
        console.error("getAllDrivers error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: PATCH /api/admin/drivers/:userId/approve
// Approve driver → mark verified → bulk-publish all their pending rides
// ─────────────────────────────────────────────────────────────────────────────
exports.approveDriver = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.driverVerified = true;
        user.driverVerificationStatus = "verified";
        await user.save();

        // Publish every ride that was held as pending for this driver
        const result = await Ride.updateMany(
            { user: req.params.userId, status: "pending" },
            { $set: { status: "published" } }
        );

        res.status(200).json({
            message: "Driver approved and rides published",
            ridesPublished: result.modifiedCount
        });

    } catch (err) {
        console.error("approveDriver error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: PATCH /api/admin/drivers/:userId/reject
// Reject driver — they can re-upload docs and try again
// ─────────────────────────────────────────────────────────────────────────────
exports.rejectDriver = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.driverVerified = false;
        user.driverVerificationStatus = "rejected";
        await user.save();

        res.status(200).json({ message: "Driver rejected" });

    } catch (err) {
        console.error("rejectDriver error:", err);
        res.status(500).json({ message: "Server error" });
    }
};