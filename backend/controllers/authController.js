const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "student",
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Generates a 6-digit OTP, hashes it, stores it on the user with a 10-min
// expiry. In production you would email this OTP instead of returning it
// in the response — for now (no email service configured) it is returned
// directly so the flow works end-to-end in dev/testing.
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!email.toLowerCase().endsWith("@sastra.ac.in")) {
      return res.status(400).json({
        message: "Only @sastra.ac.in email addresses are allowed",
      });
    }

    const user = await User.findOne({ email });

    // Don't reveal whether the email exists — respond the same way either way.
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a reset code has been generated.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOtpHash = otpHash;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    res.status(200).json({
      message:
        "If an account with that email exists, a reset code has been generated.",
      // ⚠️ DEV ONLY: returning the OTP here since no email service is wired
      // up yet. Remove `devOtp` once you connect a real email provider
      // (e.g. Nodemailer + Gmail/SendGrid) and send the OTP by email instead.
      devOtp: otp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are all required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.resetOtpHash ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    if (otpHash !== user.resetOtpHash) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtpHash = null;
    user.resetOtpExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};