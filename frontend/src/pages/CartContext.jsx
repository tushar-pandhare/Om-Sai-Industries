import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/omsai/cart");
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add product to cart
  const addToCart = async (product) => {
    try {
      await axios.post("http://localhost:5000/omsai/cart/add", {
        productId: product._id,
      });
      fetchCart(); // refresh cart
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Update quantity
  const updateQuantity = async (cartId, amount) => {
    try {
      await axios.put(`http://localhost:5000/omsai/cart/${cartId}`, { amount });
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // Remove from cart
  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`http://localhost:5000/omsai/cart/${cartId}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, loading, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
