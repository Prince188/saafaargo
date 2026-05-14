const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getProfile, updateProfile, removeProfilePic, getMe } = require("../controllers/userController");
const upload = require("../middleware/upload");

// Get user profile
router.get("/profile", authMiddleware, getProfile);

router.get("/me", authMiddleware, getMe);

// Update user profile
router.put("/profile", authMiddleware,upload.single("profilePic"), updateProfile);

router.put("/remove-profile-pic", authMiddleware, removeProfilePic);

module.exports = router; 