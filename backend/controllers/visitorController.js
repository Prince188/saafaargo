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

        let record;

        // If user is logged in
        if (email && email !== "guest") {
            const existingEmailRecord = await Visitor.findOne({ email, date: today });

            if (existingEmailRecord) {
                // If a record with this email already exists today, update it and synchronize its visitorId
                const oldVisitorId = visitorId;
                visitorId = existingEmailRecord.visitorId || visitorId;

                record = await Visitor.findOneAndUpdate(
                    { email, date: today },
                    { $inc: { count: 1 }, $set: { userId, visitorId } },
                    { new: true }
                );

                // Clean up the temporary guest record if any
                await Visitor.deleteOne({ visitorId: oldVisitorId, date: today, email: { $exists: false } }).catch(() => {});
            } else {
                // Check if a temporary guest record exists today for this browser/visitorId
                const guestRecord = await Visitor.findOne({ visitorId, date: today, email: { $exists: false } });

                if (guestRecord) {
                    // Convert the guest record to the registered user record
                    record = await Visitor.findOneAndUpdate(
                        { visitorId, date: today, email: { $exists: false } },
                        { $inc: { count: 1 }, $set: { userId, email } },
                        { new: true }
                    );
                } else {
                    // Create new registered record
                    record = await Visitor.findOneAndUpdate(
                        { visitorId, date: today, email },
                        { $inc: { count: 1 }, $set: { userId } },
                        { upsert: true, new: true }
                    );
                }
            }
        } else {
            // Guest visitor: update/create guest record (where email does not exist)
            record = await Visitor.findOneAndUpdate(
                { visitorId, date: today, email: { $exists: false } },
                { $inc: { count: 1 } },
                { upsert: true, new: true }
            );
        }

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