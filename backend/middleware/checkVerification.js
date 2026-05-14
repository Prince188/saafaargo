const User = require("../models/User");

const checkVerification = async (req, res, next) => {
    try {
        const userId = req.user.id; // assuming auth middleware sets req.user

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ❌ not verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Upload DL & RC and get verified before publishing ride"
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = checkVerification;