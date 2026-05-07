const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const Otp = require("../models/Otp");
const mailSender = require("../util/mailSender");

exports.register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            mobile,
            password,
            otp
        } = req.body;

        // Check existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { mobile }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Find latest OTP
        const recentOtp = await Otp.findOne({ email })
            .sort({ createdAt: -1 });

        if (!recentOtp) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // Verify OTP
        if (recentOtp.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            mobile,
            password: hashedPassword,
            profilePic: req.file ? req.file.path : ""
        });

        // Delete used OTP
        await Otp.deleteMany({ email });

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user
        });

    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];

            return res.status(400).json({
                message: `${field} already exists`
            });
        }

        return res.status(500).json({
            message: err.message || "Server error"
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        // Save OTP
        await Otp.create({
            email,
            otp
        });

        // Send Mail
        await mailSender(
            email,
            "OTP Verification",
            `<h2>Your OTP is ${otp}</h2>`
        );

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};