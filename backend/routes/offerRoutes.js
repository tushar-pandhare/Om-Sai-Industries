const express = require("express");
const Offer = require("../models/Offer");
const router = express.Router();

// GET all offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new offer
router.post("/", async (req, res) => {
  try {
    const { title, description, type, validTill, imageUrl } = req.body;
    const offer = new Offer({ title, description, type, validTill, imageUrl });
    await offer.save();
    res.json(offer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE offer
router.delete("/:id", async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
