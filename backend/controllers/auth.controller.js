const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const otp = crypto.randomInt(100000, 999999).toString();
    const user = await User.create({
      name,
      email,
      password: hashed,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
    });
    await sendEmail(email, "Verify your SaveIt account", `Your otp is ${otp}`);
    res.status(200).json({ message: "OTP sent to email, Please verify!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.status(201).json({
    token: signToken(user._id),
    user: {
      name: user.name,
      email: user.email,
    },
    message: "Email verified successfully",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.isVerified) {
    return res
      .status(401)
      .json({ message: "Invalid credentials or unverified account" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: signToken(user._id),
    user: {
      name: user.name,
      email: user.email,
    },
    message: "Login successful",
  });
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.json({ message: "If that email exists, OTP was sent." }); // don't leak existence

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();
  await sendEmail(
    req.body.email,
    "Reset your SaveIt password",
    `Your OTP is: ${otp}`,
  );
  res.json({ message: "OTP sent." });
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res.json({ message: "Password reset. You can now log in." });
};

module.exports = {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
};
