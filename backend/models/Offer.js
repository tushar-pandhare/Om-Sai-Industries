const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ["current", "upcoming"], default: "current" },
  validTill: Date,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Offer", offerSchema);
