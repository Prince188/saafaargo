const Report = require("../models/Report");

exports.createReport = async (req, res) => {
    try {
        const { reportedUserId, rideId, reason, description } = req.body;

        if (!reportedUserId || !reason) {
            return res.status(400).json({ message: "Reported user and reason are required" });
        }

        if (reportedUserId === req.user.id) {
            return res.status(400).json({ message: "You cannot report yourself" });
        }

        const report = new Report({
            reportedUser: reportedUserId,
            reportedBy: req.user.id,
            ride: rideId || undefined,
            reason,
            description: description || "",
        });

        await report.save();

        res.status(201).json({ success: true, message: "Report submitted successfully" });
    } catch (err) {
        console.error("[createReport] Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};