const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

// GET all messages (admin use only)
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new message (user contact form)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newMessage = new Message({ name, email, phone, message });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
