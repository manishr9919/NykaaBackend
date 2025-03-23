const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("OtpUser", otpSchema);
