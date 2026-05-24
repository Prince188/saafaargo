const express = require("express");
const router = express.Router();

const { register, login, sendOtp, forgotPasswordOtp, resetPassword } = require("../controllers/authController");

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