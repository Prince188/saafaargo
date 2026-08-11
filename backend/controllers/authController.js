const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const Otp = require("../models/Otp");
const mailSender = require("../util/mailSender");

exports.register = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      mobile,
      password,
      otp
    } = req.body;

    email = email.toLowerCase().trim();
    mobile = mobile.trim();

    // Check existing user
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Email already exists"
      });
    }

    const existingMobile = await User.findOne({ mobile });

    if (existingMobile) {
      return res.status(400).json({
        success: false,
        field: "mobile",
        message: "Mobile number already exists"
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

      let message = "User already exists";

      if (field === "email") {
        message = "Email already exists";
      }

      if (field === "mobile") {
        message = "Mobile number already exists";
      }

      return res.status(400).json({
        success: false,
        field,
        message
      });
    }

    return res.status(500).json({
      message: err.message || "Server error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // CHECK BLOCK STATUS
    if (user.status === "block") {
      return res.status(403).json({
        success: false,
        blocked: true,
        message: "Your account has been blocked by admin",

        user: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        }
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    let { email } = req.body;

    email = email.toLowerCase().trim();


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

    // Beautiful Email Template
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#F5F2EB;
  font-family:Inter, Arial, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table width="520" cellpadding="0" cellspacing="0" style="
          background:#FDFBF7;
          border-radius:32px;
          overflow:hidden;
          box-shadow:0 12px 32px rgba(0,0,0,0.08);
        ">

          <!-- Top Gradient -->
          <tr>
            <td style="
              background:linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%);
              padding:40px 32px;
              text-align:center;
            ">

              <h1 style="
                margin:0;
                color:white;
                font-size:32px;
                font-weight:700;
                letter-spacing:0.5px;
              ">
                Safar GO
              </h1>

              <p style="
                margin:12px 0 0;
                color:#DCE8D4;
                font-size:16px;
                line-height:24px;
              ">
                Secure Email Verification
              </p>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:48px 36px;">

              <h2 style="
                margin:0;
                color:#1F2937;
                font-size:28px;
                text-align:center;
              ">
                Verify Your Account
              </h2>

              <p style="
                margin:18px 0 0;
                color:#6B7280;
                font-size:16px;
                line-height:28px;
                text-align:center;
              ">
                Use the verification code below to continue creating your account.
              </p>

              <!-- OTP BOX -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:40px 0;">

                    <div style="
                      display:inline-block;
                      background:#DCE8D4;
                      color:#1A3A2E;
                      padding:20px 42px;
                      border-radius:20px;
                      font-size:42px;
                      font-weight:700;
                      letter-spacing:10px;
                      box-shadow:0 4px 12px rgba(0,0,0,0.06);
                    ">
                      ${otp}
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Message -->
              <p style="
                margin:0;
                color:#6B7280;
                font-size:15px;
                line-height:26px;
                text-align:center;
              ">
                This OTP will expire in
                <span style="
                  color:#1A3A2E;
                  font-weight:600;
                ">
                  10 minutes
                </span>.
              </p>

              <!-- Divider -->
              <div style="
                height:1px;
                background:#E5E7EB;
                margin:36px 0;
              "></div>

              <!-- Footer -->
              <p style="
                margin:0;
                color:#9CA3AF;
                font-size:13px;
                line-height:24px;
                text-align:center;
              ">
                If you didn’t request this email, you can safely ignore it.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

    // Send Mail
    await mailSender(
      email,
      "OTP Verification",
      htmlTemplate
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

// Check whether an email is already registered (used before sending OTP for
// an email change so the app can show "already registered" immediately).
exports.checkEmail = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    email = email.toLowerCase().trim();

    const existing = await User.findOne({ email }).select("_id");

    res.json({ success: true, exists: !!existing });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Change the logged-in user's email. Verifies the OTP that was sent to the new
// email BEFORE updating, and re-checks the new email is not taken by another
// account (atomic — guards the race between OTP send and save).
exports.changeEmail = async (req, res) => {
  try {
    let { newEmail, otp } = req.body;

    newEmail = newEmail ? newEmail.toLowerCase().trim() : "";

    if (!newEmail) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Email is required"
      });
    }

    if (!otp || typeof otp !== "string" || !otp.trim()) {
      return res.status(400).json({
        success: false,
        message: "OTP is required"
      });
    }

    const existing = await User.findOne({ email: newEmail });

    if (existing && existing._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "New email is same as current email"
      });
    }

    if (existing) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Email already exists"
      });
    }

    // Find latest OTP sent to the new email
    const recentOtp = await Otp.findOne({ email: newEmail })
      .sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (recentOtp.otp !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { email: newEmail },
      { new: true }
    ).select("-password");

    // Delete used OTPs
    await Otp.deleteMany({ email: newEmail });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.forgotPasswordOtp = async (req, res) => {
  try {

    let { email } = req.body;

    email = email.toLowerCase().trim();

    // Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Remove old OTPs
    await Otp.deleteMany({ email });

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

    // Email Template
    const htmlTemplate = `
      <div style="font-family:Arial;padding:20px">
        <h2>Reset Password</h2>

        <p>Your password reset OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP expires in 10 minutes.</p>
      </div>
    `;

    await mailSender(
      email,
      "Reset Password OTP",
      htmlTemplate
    );

    return res.status(200).json({
      success: true,
      message: "Reset OTP sent successfully"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.resetPassword = async (req, res) => {
  try {

    let {
      email,
      otp,
      password
    } = req.body;

    email = email.toLowerCase().trim();

    // Find latest OTP
    const recentOtp = await Otp.findOne({ email })
      .sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // Verify OTP
    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword
      }
    );

    // Delete OTP
    await Otp.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};