const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signupModel = require("../model/user.signUp.model"); // Adjust the path to your schema file
const authenticate = require("../middleware/auth");
const loginRoute = express.Router();
// const CheckAssess = require("../middleware/checkAssess");

const SECRET_KEY = process.env.TOKEN_SECRET_KEY; // Replace with a secure key stored in environment variables

// Login endpoint
loginRoute.post("/login",authenticate,async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await signupModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" } // Token expiration time
    );

    // Attach user data to request
    req.user = { userId: user._id, email: user.email, role: user.role };

    // Send token and user data in the response
    res.status(200).json({
      message: "Login successful!",
      token,
      user: req.user,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = loginRoute;
