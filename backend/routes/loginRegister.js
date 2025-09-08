const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/loginRegister");

const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    const { username, mobileNumber , password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const User = new User({ username, mobileNumber , password: hashedPassword });
    await admin.save();

    res.json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
