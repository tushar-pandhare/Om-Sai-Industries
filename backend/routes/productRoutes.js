const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST add new product
router.post("/", async (req, res) => {
  const { name, description, imageUrl } = req.body;
  const product = new Product({ name, description, imageUrl });
  await product.save();
  res.json(product);
});

module.exports = router;
