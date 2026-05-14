const User = require("../models/User");

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

        res.json({
            success: true,
            data: {
                pendingUsers,
                approvedUsers,
                pendingRides,
                activeRides
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};  