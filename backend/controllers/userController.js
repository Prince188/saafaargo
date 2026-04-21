const User = require("../models/User");

exports.getProfile = async (req, res) => {
    try {
        console.log("USER ID:", req.user);

        const user = await User.findById(req.user.id).select("-password");

        console.log("USER FROM DB:", user);

        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, mobile, bio } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                firstName,
                lastName,
                mobile,
                bio
            },
            { new: true }
        ).select("-password");

        res.json(user);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, mobile, bio, removeProfilePic } = req.body;

        const updateData = {
            firstName,
            lastName,
            mobile,
            bio
        };

        // ✅ upload new image
        if (req.file) {
            updateData.profilePic = req.file.path;
        }

        // ✅ remove image
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

exports.removeProfilePic = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePic: "" },
            { new: true }
        );

        res.json({ message: "Profile pic removed", user });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};