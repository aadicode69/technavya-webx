const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const generateToken = require("../config/jwt");
const sendVerificationEmail = require("../utils/email");

exports.signup = async (req, res) => {
  console.log("🔥 SignUp Triggered");
  try {
    const { employeeId, name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          message: "User already registered and verified. Please login."
        });
      }
      return res.status(400).json({
        message: "Verification email already sent. Please check your inbox."
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    await User.create({
      employeeId,
      name,
      email,
      password: hash,
      role,
      isVerified: false,
      verificationToken: token,
      verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000
    });

    await sendVerificationEmail(email, token);

    return res.status(201).json({
      message: "Signup successful. Verification email sent."
    });

  } catch (err) {
    console.error("❌ SIGNUP ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("❌ VERIFY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      role: user.role,
      name: user.name
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
