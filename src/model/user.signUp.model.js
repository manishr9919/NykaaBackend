const mongoose = require("mongoose");

const signUpSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true }, // Ensure correct spelling; should it be "firstName"?
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "author"],
      default: "user",
      required: true,
    }, // Properly closed this object
  },
  { timestamps: true, versionKey: false }
);

const signupModel = mongoose.model("UserSignup", signUpSchema);

module.exports = signupModel;
