const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../model/OtpBasedUserModel");
const sendOtpSMS = require("../utils/Sendotp");

const router = express.Router();

// Generate a random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Step 1: Send OTP to Phone Number
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  try {
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 min

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();
    await sendOtpSMS(phone, otp);

    res.status(200).json({ message: "OTP sent to phone" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Step 2: Verify OTP and Login
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.otp = undefined; // Clear OTP after successful login
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
