const Visitor = require("../models/Visitor");

exports.trackUniqueVisitor = async (req, res) => {
    try {
        const ip =
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress;

        const today = new Date().toISOString().slice(0, 10);

        // Check if already exists
        const existing = await Visitor.findOne({ ip, date: today });

        if (!existing) {
            await Visitor.create({ ip, date: today });
        }

        res.status(200).json({ message: "Tracked" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTodayVisitors = async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);

    const count = await Visitor.countDocuments({ date: today });

    res.json({ todayVisitors: count });
};

exports.getTotalVisitors = async (req, res) => {
    const total = await Visitor.countDocuments();

    res.json({ totalVisitors: total });
};

exports.getVisitorStats = async (req, res) => {
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
};