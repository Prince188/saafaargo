const User = require("../models/User");

const submitDocuments = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const dlFile = req.files?.dl?.[0];
        const rcFile = req.files?.rc?.[0];

        if (!dlFile || !rcFile) {
            return res.status(400).json({
                message: "DL and RC are required"
            });
        }

        // ✅ Cloudinary returns "path" as secure URL
        user.documents.dl = dlFile.path;
        user.documents.rc = rcFile.path;

        user.verificationStatus = "pending";
        user.isVerified = false;

        await user.save();

        return res.status(200).json({
            message: "Documents submitted successfully",
            documents: user.documents
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { submitDocuments };