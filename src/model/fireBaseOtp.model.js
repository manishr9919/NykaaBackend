const mongoose = require("mongoose");

const fireBaseOtpSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String, unique: true },
  otp: { type: String },  // Store OTP temporarily
  otpExpires: { type: Date },  // Expiry time for OTP
  googleId: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

const User = mongoose.model("User", fireBaseOtpSchema);
module.exports = User;
