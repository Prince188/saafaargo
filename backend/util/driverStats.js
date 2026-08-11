const Ride = require("../models/Ride");

// Returns a map of userId → count of published/completed rides, for a set of
// driver ids. Used to attach `totalRides` to populated drivers in bulk.
async function getRideCountsByDriver(userIds) {
    const ids = [...new Set((userIds || []).map((id) => String(id)).filter(Boolean))];
    if (ids.length === 0) return {};

    const rows = await Ride.aggregate([
        { $match: { user: { $in: ids }, status: { $in: ["published", "completed"] } } },
        { $group: { _id: "$user", count: { $sum: 1 } } },
    ]);

    const map = {};
    for (const row of rows) map[String(row._id)] = row.count;
    return map;
}

// Quick single-driver count (used for one ride's detail).
async function getRideCountForDriver(userId) {
    if (!userId) return 0;
    try {
        return await Ride.countDocuments({
            user: userId,
            status: { $in: ["published", "completed"] },
        });
    } catch (e) {
        return 0;
    }
}

module.exports = { getRideCountsByDriver, getRideCountForDriver };
