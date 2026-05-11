const Visitor = require("../models/Visitor");

// Helper: extract real client IP
const getClientIp = (req) => {
    let ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "";

    // Take first IP if multiple are present
    return ip.split(",")[0].trim();
};
 
exports.trackUniqueVisitor = async (req, res) => {
    try {
        const ip = getClientIp(req);

        const today = new Date().toISOString().slice(0, 10);

        // Check if visitor already exists for today
        const existing = await Visitor.findOne({ ip });

        if (!existing) {
            await Visitor.create({ ip });
        }

        res.status(200).json({ message: "Tracked" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTodayVisitors = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        const count = await Visitor.countDocuments({ date: today });

        res.json({ todayVisitors: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTotalVisitors = async (req, res) => {
    try {
        const total = await Visitor.countDocuments();

        res.json({ totalVisitors: total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVisitorStats = async (req, res) => {
    try {
        const stats = await Visitor.aggregate([
            {
                $group: {
                    _id: "$date",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};