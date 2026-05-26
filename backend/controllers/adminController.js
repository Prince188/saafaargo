const User = require("../models/User");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const Newsletter = require("../models/Newsletter");
const Contact = require("../models/Contact");

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
            verificationStatus: "pending"
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
        const pendingUsers = await User.find({
            verificationStatus: "pending"
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
            status: "active"
        })
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [totalUsers, verifiedUsers, activeUsers, newUsersToday] = await Promise.all([
            User.countDocuments(),
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

        res.json({
            success: true,
            data: {
                pendingUsers,
                approvedUsers,
                pendingRides,
                activeRides,
                userStats: {
                    totalUsers,
                    verifiedUsers,
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
                topCities
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