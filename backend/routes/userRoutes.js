const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userController");

// Get user profile
router.get("/profile", authMiddleware, getProfile);

// Update user profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;