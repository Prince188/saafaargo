const User = require("../models/User");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const Report = require("../models/Report");

// Get logged-in user
exports.getMe = async (req, res) => {
    res.json({ user: req.user });
};

// Get single profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, mobile, bio, removeProfilePic } = req.body;

        const updateData = {
            firstName,
            lastName,
            mobile,
            bio,
        };

        if (req.file) {
            updateData.profilePic = req.file.path;
        }

        if (removeProfilePic === "true") {
            updateData.profilePic = "";
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        ).select("-password");

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Remove profile pic
exports.removeProfilePic = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePic: "" },
            { new: true }
        ).select("-password");

        res.json({ message: "Profile pic removed", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        const query = {
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } },
            ],
        };

        const users = await User.find(query)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalUsers,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get user stats (bookings, rides, reports)
exports.getUserStats = async (req, res) => {
    try {
        const userId = req.params.id;

        const [
            totalBookings,
            cancelledBookings, completedBookings,
            cancelledRidesAsDriver, completedRidesAsDriver,
            totalReports
        ] = await Promise.all([
            Booking.countDocuments({ user: userId }),
            Booking.countDocuments({ user: userId, status: "cancelled" }),
            Booking.countDocuments({ user: userId, status: "completed" }),
            Ride.countDocuments({ user: userId, status: "cancelled" }),
            Ride.countDocuments({ user: userId, status: "completed" }),
            Report.countDocuments({ reportedUser: userId }),
        ]);

        res.json({
            totalBookings,
            totalCancelled: cancelledBookings + cancelledRidesAsDriver,
            totalCompleted: completedBookings + completedRidesAsDriver,
            totalReports,
        });
    } catch (err) {
        console.error("[getUserStats] Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// BLOCK / UNBLOCK USER
exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // prevent admin blocking himself
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                message: "You cannot block yourself",
            });
        }

        user.status = user.status === "active" ? "block" : "active";

        await user.save();

        res.json({
            message:
                user.status === "block"
                    ? "User blocked successfully"
                    : "User unblocked successfully",
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
        });
    }
};