const express = require("express");
const Offer = require("../models/Offer");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const streamifier = require("streamifier");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Utility: convert upload_stream into a Promise
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "offers" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ GET all offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
    console.log(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST create new offer with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, type, validTill } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const offer = new Offer({
      title,
      description,
      type,
      validTill,
      imageUrl,
    });

    await offer.save();
    res.status(201).json(offer);
  } catch (error) {
    console.error("❌ Error creating offer:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ DELETE offer
router.delete("/:id", async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
