const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary"); // ✅ import from your config file

// Multer config (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ POST add product with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price,description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // ✅ Upload to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const uploadResult = await streamUpload(req.file.buffer);

    // ✅ Save product with Cloudinary image URL
    const newProduct = new Product({
      name,
      price,
      description,
      imageUrl: uploadResult.secure_url,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (err) {
    console.error("❌ Error in /omsai/products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    console.log(products);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
