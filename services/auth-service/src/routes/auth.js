const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

router.post(
  "/register",
  [
    body("name").notEmpty().trim().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6+ characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const existing = await User.findOne({ email: req.body.email });
      if (existing)
        return res.status(409).json({ success: false, message: "Email already exists" });

      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || "customer",
      });

      const token = signToken(user);
      res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const user = await User.findOne({ email: req.body.email }).select("+password");
      if (!user || !(await user.comparePassword(req.body.password))) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const token = signToken(user);
      res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/verify", verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;