const User = require("../models/User");

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

// Update profile (FIXED SINGLE VERSION)
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, mobile, bio, removeProfilePic } = req.body;

        const updateData = {
            firstName,
            lastName,
            mobile,
            bio,
        };

        // upload new image
        if (req.file) {
            updateData.profilePic = req.file.path;
        }

        // remove image
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



// ⭐ NEW: Get ALL USERS (PAGINATION)
exports.getAllUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        const users = await User.find()
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments();

        res.json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalUsers
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};