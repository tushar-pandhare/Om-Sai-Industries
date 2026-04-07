const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  phone: String,
  email: String,
  address: String,
  businessHours: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  mapEmbed: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);