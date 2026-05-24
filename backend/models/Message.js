// models/Message.js
// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true
//   },
//   phone: {
//     type: String,
//     default: ''
//   },
//   message: {
//     type: String,
//     required: true
//   },
//   isRead: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Message', messageSchema);

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // For user-to-admin chat (logged-in users)
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // For contact form submissions (non-logged in users)
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  // For tracking conversation
  conversationId: {
    type: String,
    index: true
  },
  // For admin reply
  adminReply: {
    message: String,
    sentAt: Date,
    readByCustomer: Boolean
  }
}, {
  timestamps: true
});

// Create index for faster queries
messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ to: 1, isRead: 1 });
messageSchema.index({ from: 1, to: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);