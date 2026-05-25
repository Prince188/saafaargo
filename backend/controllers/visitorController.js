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
        let { visitorId, userId, email } = req.body;
        const today = new Date().toISOString().slice(0, 10);

        let createdNewId = false;
        if (!visitorId) {
            visitorId = require("crypto").randomUUID();
            createdNewId = true;
        }

        // Set up the upsert query and update actions
        const query = { visitorId, date: today };
        const update = {
            $inc: { count: 1 }
        };

        // If user is logged in, store/update their email and userId.
        // If guest, we do not store these fields at all (no "guest" string is stored).
        if (email && email !== "guest") {
            update.$set = { email };
            if (userId && userId !== "guest") {
                update.$set.userId = userId;
            }
        }

        const record = await Visitor.findOneAndUpdate(
            query,
            update,
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: "Tracked successfully",
            visitorId,
            createdNewId,
            record
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTodayVisitors = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        // Daily Unique Visits: count of unique visitorIds today + count of unique IPs today (where visitorId doesn't exist)
        const dailyUniqueVisitorIds = await Visitor.distinct("visitorId", { date: today, visitorId: { $ne: null } });
        const dailyUniqueIpsWithoutVisitorId = await Visitor.distinct("ip", { date: today, visitorId: { $exists: false } });
        const dailyUnique = dailyUniqueVisitorIds.length + dailyUniqueIpsWithoutVisitorId.length;

        res.json({
            todayVisitors: dailyUnique, // Keep backward compatibility
            dailyUnique: dailyUnique
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTotalVisitors = async (req, res) => {
    try {
        // Total Unique Visits: count of unique visitorIds + count of unique IPs (where visitorId doesn't exist)
        const uniqueVisitorIds = await Visitor.distinct("visitorId", { visitorId: { $ne: null } });
        const uniqueIpsWithoutVisitorId = await Visitor.distinct("ip", { visitorId: { $exists: false } });
        const totalUnique = uniqueVisitorIds.length + uniqueIpsWithoutVisitorId.length;

        // Total Visits: sum of count (defaulting to 1 for old records without count)
        const totalVisitsResult = await Visitor.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: { $ifNull: ["$count", 1] } }
                }
            }
        ]);
        const totalVisits = totalVisitsResult[0]?.total || 0;

        res.json({
            totalVisitors: totalUnique, // Keep backward compatibility
            totalUnique: totalUnique,
            totalVisits: totalVisits
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVisitorStats = async (req, res) => {
    try {
        // Group by date and count unique daily visitors (1 doc per user per day)
        const stats = await Visitor.aggregate([
            {
                $match: { date: { $ne: null } }
            },
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

exports.getRecentVisitors = async (req, res) => {
    try {
        const recent = await Visitor.find()
            .sort({ updatedAt: -1 })
            .limit(10);
        res.json(recent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};