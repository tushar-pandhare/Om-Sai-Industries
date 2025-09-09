const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/loginRegister");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    let { username, mobileNumber, password } = req.body;

    username = username.toLowerCase(); // normalize

    // Check existing
    const existingUser = await User.findOne({ 
      $or: [{ username }, { mobileNumber }] 
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username or Mobile already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      username, 
      mobileNumber, 
      password: hashedPassword 
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username.toLowerCase(); // normalize

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "fallbackSecret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      username: user.username,
      role: "user", // add role if needed
      message: "Login successful"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
