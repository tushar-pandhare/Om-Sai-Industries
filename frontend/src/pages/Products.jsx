import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const query = useQuery();
  const scrollToId = query.get("scrollTo");
  const [highlighted, setHighlighted] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/omsai/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (scrollToId && products.length > 0) {
      const element = document.getElementById(`product-${scrollToId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlighted(scrollToId);
        setTimeout(() => setHighlighted(null), 2000);
      }
    }
  }, [scrollToId, products]);

  const isInCart = (productId) => {
    return cartItems.some((item) => item.productId._id === productId);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setHighlighted(product._id);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-light font-serif text-slate-800 sm:text-6xl tracking-wide"
          >
            Our <span className="font-medium">Collection</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-2 w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 font-light"
          >
            Curated excellence for the discerning individual
          </motion.p>
        </div>

        {loading ? (
          // Loader Animation
          <div className="flex flex-col justify-center items-center py-28">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="relative w-20 h-20"
            >
              <div className="w-full h-full border-4 border-slate-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent rounded-full border-t-amber-500"></div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="mt-8 text-lg text-slate-500 font-light tracking-wide"
            >
              Curating collection...
            </motion.p>
          </div>
        ) : (
          // Product Grid
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-12"
          >
            {products.map((p, index) => (
              <motion.div
                key={p._id}
                id={`product-${p._id}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative ${
                  highlighted === p._id ? "ring-4 ring-amber-400" : ""
                }`}
              >
                {/* Image */}
                <div className="relative h-72 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-slate-800 line-clamp-1 pr-2">
                      {p.name}
                    </h3>
                    <p className="text-lg font-semibold text-amber-600 whitespace-nowrap">
                      ₹{p.price}
                    </p>
                  </div>
                  <p className="text-slate-500 text-sm font-light mb-5 line-clamp-2">
                    {p.description}
                  </p>
                  {!isInCart(p._id) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(p)}
                      className="px-5 py-2.5 bg-slate-800 text-xs text-white tracking-widest uppercase rounded-full hover:bg-slate-900 transition-all duration-300 shadow-md flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add to Cart
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;
