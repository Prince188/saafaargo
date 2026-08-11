const express = require("express");
const router = express.Router();

const { register, login, sendOtp, checkEmail, changeEmail, forgotPasswordOtp, resetPassword } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

// Check if email is already registered
router.post("/check-email", checkEmail);

// Send OTP
router.post("/send-otp", sendOtp);

// Change logged-in user's email (after OTP verification)
router.post("/change-email", authMiddleware, changeEmail);

// Register
router.post(
    "/register",
    upload.single("profilePic"),
    register
);

// Login
router.post("/login", login);

// forgot password otp
router.post(
    "/forgot-password-otp",
    forgotPasswordOtp
);

// reset password
router.post(
    "/reset-password",
    resetPassword
);


module.exports = router;