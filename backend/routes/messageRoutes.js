// routes/messageRoutes.js 
const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const router = express.Router();

// GET all conversations for current user (including empty ones)
// Update the /conversations route for customer
router.get("/conversations", protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // Admin sees all customers they've chatted with
      const customers = await Message.aggregate([
        {
          $match: {
            $or: [
              { from: req.user._id },
              { to: req.user._id }
            ]
          }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ['$from', req.user._id] },
                '$to',
                '$from'
              ]
            },
            lastMessage: { $last: '$message' },
            lastMessageTime: { $last: '$createdAt' },
            unreadCount: {
              $sum: {
                $cond: [
                  { $and: [
                    { $eq: ['$to', req.user._id] },
                    { $eq: ['$isRead', false] }
                  ]},
                  1,
                  0
                ]
              }
            }
          }
        },
        { $sort: { lastMessageTime: -1 } }
      ]);
      
      const populatedConversations = await Promise.all(
        customers.map(async (conv) => {
          const user = await User.findById(conv._id).select('name email role');
          return {
            user,
            lastMessage: conv.lastMessage,
            lastMessageTime: conv.lastMessageTime,
            unreadCount: conv.unreadCount
          };
        })
      );
      
      res.json(populatedConversations);
    } else {
      // Customer - show all messages as one conversation with support
      // Get all messages from/to any admin
      const messages = await Message.find({
        $or: [
          { from: req.user._id },
          { to: req.user._id }
        ]
      })
      .sort({ createdAt: 1 })
      .populate('from', 'name email role')
      .populate('to', 'name email role');
      
      // Return as a single conversation
      res.json([{
        user: { name: 'Support Team', role: 'admin' },
        messages: messages,
        lastMessage: messages[messages.length - 1]?.message || '',
        lastMessageTime: messages[messages.length - 1]?.createdAt || null,
        unreadCount: messages.filter(m => m.to?._id === req.user._id && !m.isRead).length
      }]);
    }
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET messages between two users
router.get("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;
    
    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: userId },
        { from: userId, to: req.user._id }
      ]
    })
    .sort({ createdAt: 1 })
    .limit(parseInt(limit))
    .populate('from', 'name email role')
    .populate('to', 'name email role');
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET all users for admin chat
router.get("/users/all", protect, async (req, res) => {
  try {
    let users;
    if (req.user.role === 'admin') {
      users = await User.find({ role: 'user' }).select('name email role');
    } else {
      users = await User.find({ role: 'admin' }).select('name email role');
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET unread count
router.get("/unread/count", protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      to: req.user._id,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read
router.put("/mark-read", protect, async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    await Message.updateMany(
      { _id: { $in: messageIds }, to: req.user._id },
      { isRead: true, readAt: new Date() }
    );
    
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST contact form message (for non-logged in users)
router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Find admin users
    const admins = await User.find({ role: 'admin' });
    
    if (admins.length === 0) {
      return res.status(404).json({ error: "No admin found" });
    }
    
    // Create messages for each admin
    await Promise.all(admins.map(admin => 
      Message.create({
        name: name,
        email: email,
        phone: phone || '',
        message: message,
        to: admin._id,
        isRead: false
      })
    ));
    
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(400).json({ error: error.message });
  }
});

// GET all messages (admin only)
router.get("/", protect, adminMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE message
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
// // routes/messageRoutes.js 
// const express = require("express");
// const Message = require("../models/Message");
// const { protect } = require("../middleware/authMiddleware");
// const { adminMiddleware } = require("../middleware/adminMiddleware");
// const router = express.Router();

// // GET all messages (admin only)
// router.get("/", protect, adminMiddleware, async (req, res) => {
//   try {
//     const messages = await Message.find().sort({ createdAt: -1 });
//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // POST create new message (public)
// router.post("/", async (req, res) => {
//   try {
//     const { name, email, phone, message } = req.body;
//     const newMessage = new Message({ 
//       name, 
//       email, 
//       phone, 
//       message,
//       isRead: false,
//       createdAt: new Date()
//     });
//     await newMessage.save();
//     res.status(201).json(newMessage);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // DELETE message (admin only)
// router.delete("/:id", protect, adminMiddleware, async (req, res) => {
//   try {
//     const message = await Message.findByIdAndDelete(req.params.id);
//     if (!message) {
//       return res.status(404).json({ error: "Message not found" });
//     }
//     res.json({ message: "Message deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Mark message as read (admin only)
// router.put("/:id/read", protect, adminMiddleware, async (req, res) => {
//   try {
//     const message = await Message.findByIdAndUpdate(
//       req.params.id,
//       { isRead: true },
//       { new: true }
//     );
//     if (!message) {
//       return res.status(404).json({ error: "Message not found" });
//     }
//     res.json(message);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;