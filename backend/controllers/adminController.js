const User = require("../models/User");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const Newsletter = require("../models/Newsletter");
const Contact = require("../models/Contact");
const SearchLog = require("../models/SearchLog");

const extractCity = (displayName) => {
    if (!displayName) return null;
    const parts = displayName.split(",").map(s => s.trim()).filter(Boolean);
    if (parts.length >= 3) return parts[parts.length - 3];
    if (parts.length === 2) return parts[0];
    return parts[0] || null;
};

exports.getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({
            verificationStatus: "pending",
            role: { $ne: "admin" }
        });

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// APPROVE USER
exports.approveUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isVerified = true;
        user.verificationStatus = "approved";

        await user.save();

        res.json({
            success: true,
            message: "User approved successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REJECT USER
exports.rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isVerified = false;
        user.verificationStatus = "rejected";

        await user.save();

        res.json({
            success: true,
            message: "User rejected"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminDashboard = async (req, res) => {
    try {
        // Real pending drivers awaiting KYC verification
        const pendingDrivers = await User.find({
            driverVerificationStatus: "pending"
        }).select("firstName lastName email mobile driverDocuments createdAt").sort({ createdAt: -1 });

        // Real account verification pending (excluding "none")
        const pendingUsers = await User.find({
            verificationStatus: "pending",
            role: { $ne: "admin" }
        }).sort({ createdAt: -1 });

        const approvedUsers = await User.find({
            verificationStatus: "approved"
        }).sort({ createdAt: -1 });

        const pendingRides = await Ride.find({
            status: "pending"
        })
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        const activeRides = await Ride.find({
            status: "published"
        })
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [totalUsers, verifiedUsers, verifiedDriversCount, activeUsers, newUsersToday] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isVerified: true }),
            User.countDocuments({ driverVerificationStatus: "verified" }),
            User.countDocuments({ status: "active" }),
            User.countDocuments({ createdAt: { $gte: todayStart } })
        ]);

        const [totalRides, completedRides, cancelledRides, contactsCount] = await Promise.all([
            Ride.countDocuments(),
            Ride.countDocuments({ status: "completed" }),
            Ride.countDocuments({ status: "cancelled" }),
            Contact.countDocuments()
        ]);

        const seatsBookedResult = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: "$seatsBooked" } } }
        ]);
        const seatsBooked = seatsBookedResult[0]?.total || 0;

        const allRides = await Ride.find(
            { "destination.displayName": { $ne: null, $ne: "" } },
            { "destination.displayName": 1 }
        ).lean();

        const cityCount = {};
        for (const ride of allRides) {
            const city = extractCity(ride.destination.displayName);
            if (city) cityCount[city] = (cityCount[city] || 0) + 1;
        }

        const sortedCities = Object.entries(cityCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const maxCount = sortedCities.length > 0 ? sortedCities[0][1] : 1;
        const topCities = sortedCities.map(([city, count]) => ({
            city,
            rides: count,
            percentage: Math.round((count / maxCount) * 100),
        }));

        // ── Search Analytics & Route Demand ─────────────────────────
        const [totalSearches, searchesToday, zeroResultSearches] = await Promise.all([
            SearchLog.countDocuments(),
            SearchLog.countDocuments({ createdAt: { $gte: todayStart } }),
            SearchLog.countDocuments({ resultsCount: 0 })
        ]);

        const topRoutesAgg = await SearchLog.aggregate([
            {
                $group: {
                    _id: "$routeKey",
                    fromCity: { $first: "$fromCity" },
                    toCity: { $first: "$toCity" },
                    totalSearches: { $sum: 1 },
                    zeroResultsCount: {
                        $sum: { $cond: [{ $eq: ["$resultsCount", 0] }, 1, 0] }
                    },
                    lastSearched: { $max: "$createdAt" }
                }
            },
            { $sort: { totalSearches: -1 } },
            { $limit: 5 }
        ]);

        const maxSearches = topRoutesAgg.length > 0 ? topRoutesAgg[0].totalSearches : 1;
        const topSearchedRoutes = topRoutesAgg.map(r => ({
            route: r._id || `${r.fromCity} → ${r.toCity}`,
            fromCity: r.fromCity,
            toCity: r.toCity,
            searches: r.totalSearches,
            zeroResultsCount: r.zeroResultsCount,
            percentage: Math.round((r.totalSearches / maxSearches) * 100),
            unmetDemand: r.zeroResultsCount > 0 && (r.zeroResultsCount / r.totalSearches) >= 0.5,
            lastSearched: r.lastSearched
        }));

        const recentSearches = await SearchLog.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("userId", "firstName lastName email")
            .lean();

        const searchStats = {
            totalSearches,
            searchesToday,
            zeroResultSearches,
            unmetDemandRate: totalSearches > 0 ? Math.round((zeroResultSearches / totalSearches) * 100) : 0,
            topSearchedRoutes,
            recentSearches
        };

        res.json({
            success: true,
            data: {
                pendingDrivers,
                pendingUsers,
                approvedUsers,
                pendingRides,
                activeRides,
                userStats: {
                    totalUsers,
                    verifiedUsers,
                    verifiedDrivers: verifiedDriversCount,
                    activeUsers,
                    newUsersToday
                },
                rideStats: {
                    totalRides,
                    completedRides,
                    cancelledRides,
                    seatsBooked
                },
                feedback: {
                    averageRating: 0,
                    totalReviews: 0,
                    positiveReviews: 0,
                    contactsCount
                },
                topCities,
                searchStats
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getRecentActivities = async (req, res) => {
    try {

        const [recentUsers, recentRides, recentBookings, recentSubscribers, recentContacts] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(5),
            Ride.find().populate("user", "firstName lastName").sort({ createdAt: -1 }).limit(5),
            Booking.find().populate("user", "firstName lastName").sort({ createdAt: -1 }).limit(5),
            Newsletter.find({ subscribed: true }).sort({ createdAt: -1 }).limit(5),
            Contact.find().sort({ createdAt: -1 }).limit(5)
        ]);

        const activities = [
            ...recentUsers.map(user => ({
                type: "user",
                user: `${user.firstName} ${user.lastName}`,
                action: "registered on the platform",
                time: user.createdAt,
            })),
            ...recentRides.map(ride => ({
                type: "ride",
                user: ride.user ? `${ride.user.firstName} ${ride.user.lastName}` : "A driver",
                action: `published a ride from ${extractCity(ride.pickup?.displayName) || "unknown"} to ${extractCity(ride.destination?.displayName) || "unknown"}`,
                time: ride.createdAt,
            })),
            ...recentBookings.map(booking => ({
                type: "booking",
                user: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : "A passenger",
                action: `booked a ride (${booking.seatsBooked} seat${booking.seatsBooked > 1 ? "s" : ""})`,
                time: booking.createdAt,
            })),
            ...recentSubscribers.map(sub => ({
                type: "subscription",
                user: sub.email,
                action: "subscribed to newsletter",
                time: sub.createdAt,
            })),
            ...recentContacts.map(contact => ({
                type: "contact",
                user: contact.name || contact.email,
                action: `submitted a ${contact.category || "general"} inquiry`,
                time: contact.createdAt,
            }))
        ];

        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        activities.splice(10);

        res.status(200).json({
            success: true,
            activities
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getSearchAnalytics = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;
        const search = req.query.search ? req.query.search.trim() : "";
        const filter = req.query.filter || "all"; // all, zero_results, has_results

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        let query = {};
        if (search) {
            query.$or = [
                { routeKey: { $regex: search, $options: "i" } },
                { from: { $regex: search, $options: "i" } },
                { to: { $regex: search, $options: "i" } },
                { fromCity: { $regex: search, $options: "i" } },
                { toCity: { $regex: search, $options: "i" } },
            ];
        }

        if (filter === "zero_results") {
            query.resultsCount = 0;
        } else if (filter === "has_results") {
            query.resultsCount = { $gt: 0 };
        }

        const [totalSearches, searchesToday, zeroResultSearches, totalLogs, logs] = await Promise.all([
            SearchLog.countDocuments(),
            SearchLog.countDocuments({ createdAt: { $gte: todayStart } }),
            SearchLog.countDocuments({ resultsCount: 0 }),
            SearchLog.countDocuments(query),
            SearchLog.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("userId", "firstName lastName email phone")
                .lean()
        ]);

        const topRoutesAgg = await SearchLog.aggregate([
            {
                $group: {
                    _id: "$routeKey",
                    fromCity: { $first: "$fromCity" },
                    toCity: { $first: "$toCity" },
                    totalSearches: { $sum: 1 },
                    zeroResultsCount: {
                        $sum: { $cond: [{ $eq: ["$resultsCount", 0] }, 1, 0] }
                    },
                    lastSearched: { $max: "$createdAt" }
                }
            },
            { $sort: { totalSearches: -1 } },
            { $limit: 10 }
        ]);

        const maxSearches = topRoutesAgg.length > 0 ? topRoutesAgg[0].totalSearches : 1;
        const topRoutes = topRoutesAgg.map(r => ({
            route: r._id || `${r.fromCity} → ${r.toCity}`,
            fromCity: r.fromCity,
            toCity: r.toCity,
            searches: r.totalSearches,
            zeroResultsCount: r.zeroResultsCount,
            percentage: Math.round((r.totalSearches / maxSearches) * 100),
            unmetDemand: r.zeroResultsCount > 0 && (r.zeroResultsCount / r.totalSearches) >= 0.5,
            lastSearched: r.lastSearched
        }));

        res.json({
            success: true,
            data: {
                totalSearches,
                searchesToday,
                zeroResultSearches,
                unmetDemandRate: totalSearches > 0 ? Math.round((zeroResultSearches / totalSearches) * 100) : 0,
                topRoutes,
                logs,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalLogs / limit) || 1,
                    totalLogs,
                    limit
                }
            }
        });
    } catch (error) {
        console.error("getSearchAnalytics error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};