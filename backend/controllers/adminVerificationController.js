const User = require("../models/User");

exports.getPendingVerifications = async (
    req,
    res
) => {
    try {
        const users = await User.find({
            verificationStatus: "pending",
        }).select("-password");

        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.approveVerification = async (
    req,
    res
) => {
    try {

        const user = await User.findById(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.isVerifiedDriver = true;

        user.verificationStatus = "approved";

        user.rejectionReason = "";

        await user.save();

        res.json({
            message:
                "Driver approved successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

exports.rejectVerification = async (
    req,
    res
) => {
    try {

        const { reason } = req.body;

        const user = await User.findById(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.isVerifiedDriver = false;

        user.verificationStatus = "rejected";

        user.rejectionReason = reason;

        await user.save();

        res.json({
            message:
                "Driver rejected successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

