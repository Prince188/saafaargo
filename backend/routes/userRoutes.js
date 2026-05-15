const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile,
    removeProfilePic,
    getMe,
    getAllUsers,
    toggleBlockUser,
} = require("../controllers/userController");

const upload = require("../middleware/upload");

router.get("/", authMiddleware, getAllUsers);

router.get("/profile", authMiddleware, getProfile);

router.get("/me", authMiddleware, getMe);

router.put(
    "/profile",
    authMiddleware,
    upload.single("profilePic"),
    updateProfile
);

router.put("/remove-profile-pic", authMiddleware, removeProfilePic);

// BLOCK / UNBLOCK USER
router.put("/block/:id", authMiddleware, toggleBlockUser);

module.exports = router;