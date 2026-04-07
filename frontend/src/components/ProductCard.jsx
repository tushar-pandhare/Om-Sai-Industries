// frontend/src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Heart, Eye, Star, Zap } from 'lucide-react';
import { addToCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Use discounted price if available, otherwise use original price
  const displayPrice = product.discountedPrice || product.price;
  const originalPrice = product.originalPrice || product.price;
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.originalPrice;
  const discountPercent = product.discountPercent || (hasDiscount ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    setIsAddingToCart(true);
    
    // Add to cart with original price (offer will be applied at checkout)
    setTimeout(() => {
      dispatch(addToCart({
        _id: product._id,
        name: product.name,
        price: originalPrice,
        images: product.images,
        quantity: 1,
        stock: product.stock
      }));
      toast.success(`${product.name} added to cart!`);
      setIsAddingToCart(false);
    }, 300);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.floor(rating || 0)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating || 0})</span>
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 border border-slate-100 flex flex-col sm:flex-row gap-4">
        <Link to={`/product/${product._id}`} className="sm:w-32 h-32 bg-slate-100 rounded-xl overflow-hidden relative">
          <img
            src={product.images?.[0] || '/api/placeholder/300/300'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {discountPercent}% OFF
            </div>
          )}
        </Link>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <Link to={`/product/${product._id}`}>
                <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <StarRating rating={product.rating} />
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            </div>
            <div className="text-right">
              {hasDiscount ? (
                <>
                  <div className="text-2xl font-bold text-indigo-600">₹{Math.round(displayPrice).toLocaleString()}</div>
                  <div className="text-sm text-gray-400 line-through">₹{Math.round(originalPrice).toLocaleString()}</div>
                  <div className="text-xs text-green-600 mt-1">Save ₹{Math.round(originalPrice - displayPrice).toLocaleString()}</div>
                </>
              ) : (
                <div className="text-2xl font-bold text-gray-900">₹{Math.round(displayPrice).toLocaleString()}</div>
              )}
              {product.stock === 0 && <span className="text-xs text-red-500">Out of Stock</span>}
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              Add to Cart
            </button>
            <Link
              to={`/product/${product._id}`}
              className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium text-sm hover:bg-indigo-50 transition-all"
            >
              Buy Now
            </Link>
          </div>
          
          {/* Best Offer Badge */}
          {product.bestOffer && (
            <div className="mt-2 text-xs text-indigo-600 bg-indigo-50 rounded-lg p-1.5 text-center">
              Best Price: {product.bestOffer.title}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-slate-100">
        <img
          src={product.images?.[0] || '/api/placeholder/300/300'}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
            <Zap className="w-3 h-3" />
            {discountPercent}% OFF
          </div>
        )}
        
        {product.stock < 5 && product.stock > 0 && !hasDiscount && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
        
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-1">
          <StarRating rating={product.rating} />
        </div>
        
        <div className="mt-3">
          {hasDiscount ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold text-indigo-600">₹{Math.round(displayPrice).toLocaleString()}</span>
              <span className="text-sm text-gray-400 line-through">₹{Math.round(originalPrice).toLocaleString()}</span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                Save ₹{Math.round(originalPrice - displayPrice).toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-gray-900">₹{Math.round(displayPrice).toLocaleString()}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
          <Link
            to={`/product/${product._id}`}
            className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium text-sm hover:bg-indigo-50 transition-all disabled:opacity-50"
          >
            Buy Now
          </Link>
        </div>
        
        {/* Best Offer Info */}
        {product.bestOffer && (
          <div className="mt-2 text-xs text-indigo-600 bg-indigo-50 rounded-lg p-1.5 text-center">
            Best Price: {product.bestOffer.title}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;