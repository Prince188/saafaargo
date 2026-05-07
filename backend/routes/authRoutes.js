const express = require("express");
const router = express.Router();

const { register, login, sendOtp } = require("../controllers/authController");

const upload = require("../middleware/upload");

// Send OTP
router.post("/send-otp", sendOtp);

// Register
router.post(
    "/register",
    upload.single("profilePic"),
    register
);

// Login
router.post("/login", login);

module.exports = router;