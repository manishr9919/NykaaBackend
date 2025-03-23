const express = require("express");
const admin = require("../utils/firebaseConfig");
const User = require("../model/fireBaseOtp.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// 🔹 Send OTP
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone)
    return res.status(400).json({ error: "Phone number is required" });

  try {
    const user = await User.findOne({ phone });

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB with expiry time (5 minutes)
    await User.updateOne(
      { phone },
      { otp, otpExpires: Date.now() + 300000 },
      { upsert: true }
    );

    // Send OTP using Firebase
    const session = await admin
      .auth()
      .createSessionCookie(phone, { expiresIn: 5 * 60 * 1000 });

    res.status(200).json({ message: "OTP sent successfully", session });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error sending OTP", message: error.message });
  }
});

// 🔹 Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp)
    return res.status(400).json({ error: "Phone and OTP are required" });

  try {
    const user = await User.findOne({ phone });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Clear OTP after successful login
    await User.updateOne({ phone }, { otp: null, otpExpires: null });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Error verifying OTP" });
  }
});

module.exports = router;
