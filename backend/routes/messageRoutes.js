// const express = require("express");
// const Message = require("../models/Message");
// const router = express.Router();

// // GET all messages (admin use only)
// router.get("/", async (req, res) => {
//   try {
//     const messages = await Message.find();
//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // POST create new message (user contact form)
// router.post("/", async (req, res) => {
//   try {
//     const { name, email, phone, message } = req.body;
//     const newMessage = new Message({ name, email, phone, message });
//     await newMessage.save();
//     res.json(newMessage);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;


// routes/messageRoutes.js (add these to your existing file)
const express = require("express");
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const router = express.Router();

// GET all messages (admin only)
router.get("/", protect, adminMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new message (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newMessage = new Message({ 
      name, 
      email, 
      phone, 
      message,
      isRead: false,
      createdAt: new Date()
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE message (admin only)
router.delete("/:id", protect, adminMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark message as read (admin only)
router.put("/:id/read", protect, adminMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;