const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connect = require("./config/db");
const singUpRoute = require("./src/Route/user.signup. route");
const signinRoute = require("./src/Route/user.login.route");
const otpRoute = require("./src/Route/otp.login");
const fireBaseRoute=require("./src/Route/fireBaseOtp.route")
const googleRoute=require("./src/Route/GoogleauthRoutes")

const passport = require("./config/passport");
const session = require("express-session");

const authRoutes = require("./src/Route/GoogleauthRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/signup", singUpRoute);
app.use("/signin", signinRoute);
// app.use("/auth", otpRoute);
// app.use("/auth", authRoutes);
app.use("/auth", fireBaseRoute);
app.use("/auth", googleRoute)

// Google Auth

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport & Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connect();
    console.log(`server is running on ${PORT}`);
  } catch (error) {
    console.log({
      message: "error while running server ",
      error: error.message,
    });
  }
});
