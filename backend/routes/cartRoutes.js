const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Get all cart items with product details
router.get("/", async (req, res) => {
  const cart = await Cart.find().populate("productId");
  res.json(cart);
});

// Add product to cart
router.post("/add", async (req, res) => {
  const { productId } = req.body;
  let cartItem = await Cart.findOne({ productId });

  if (cartItem) {
    cartItem.quantity += 1;
    await cartItem.save();
  } else {
    cartItem = new Cart({ productId, quantity: 1 });
    await cartItem.save();
  }

  await cartItem.populate("productId");
  res.json(cartItem);
});

// Update quantity
router.put("/:id", async (req, res) => {
  const { amount } = req.body;
  const cartItem = await Cart.findById(req.params.id);
  if (!cartItem) return res.status(404).json({ msg: "Item not found" });

  cartItem.quantity = Math.max(1, cartItem.quantity + amount);
  await cartItem.save();
  await cartItem.populate("productId");
  res.json(cartItem);
});

// Remove item
router.delete("/:id", async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ msg: "Item removed" });
});

module.exports = router;
