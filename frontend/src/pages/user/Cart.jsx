import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Shield, 
  RotateCcw,
  Tag,
  Gift,
  ChevronRight,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart } from '../../features/cart/cartSlice';
import { fetchProducts } from '../../features/prdoducts/productSlice';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { products, loading } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validCartItems, setValidCartItems] = useState([]);
  const [invalidItems, setInvalidItems] = useState([]);
  
  // Fetch products to validate cart items
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  // Validate cart items against existing products
  useEffect(() => {
    if (products && products.length > 0 && cartItems.length > 0) {
      const validProducts = new Set(products.map(p => p._id));
      const valid = [];
      const invalid = [];
      
      cartItems.forEach(item => {
        if (validProducts.has(item._id)) {
          // Product exists - get latest info from products array
          const latestProduct = products.find(p => p._id === item._id);
          valid.push({
            ...item,
            name: latestProduct?.name || item.name,
            price: latestProduct?.price || item.price,
            images: latestProduct?.images || item.images,
            stock: latestProduct?.stock || 0,
            isValid: true
          });
        } else {
          // Product no longer exists
          invalid.push(item);
        }
      });
      
      setValidCartItems(valid);
      setInvalidItems(invalid);
      
      // Remove invalid items from cart if any
      if (invalid.length > 0) {
        invalid.forEach(item => {
          dispatch(removeFromCart(item._id));
        });
        toast.error(`${invalid.length} product(s) removed from cart as they are no longer available`, {
          duration: 4000,
          icon: '⚠️'
        });
      }
    } else if (cartItems.length > 0 && !loading) {
      // If products are loaded but empty, all cart items are invalid
      setInvalidItems(cartItems);
      setValidCartItems([]);
      dispatch(clearCart());
      toast.error('All items in your cart are no longer available', {
        duration: 4000,
        icon: '⚠️'
      });
    } else {
      setValidCartItems(cartItems);
      setInvalidItems([]);
    }
  }, [products, cartItems, dispatch, loading]);
  
  const subtotal = validCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.05; // 5% tax
  let discount = 0;
  
  // Apply coupon discount if any
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = subtotal * (appliedCoupon.value / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }
  
  const total = subtotal + shipping + tax - discount;
  
  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    const item = validCartItems.find(i => i._id === id);
    if (item && quantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`);
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart());
      toast.success('Cart cleared');
    }
  };
  
  const handleCheckout = () => {
    if (!userInfo) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    
    // Check stock availability before checkout
    const outOfStockItems = validCartItems.filter(item => item.quantity > item.stock);
    if (outOfStockItems.length > 0) {
      toast.error(`Some items are out of stock. Please update your cart.`);
      return;
    }
    
    navigate('/checkout');
  };
  
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    setIsApplyingCoupon(true);
    
    setTimeout(() => {
      const validCoupons = {
        'SAVE10': { type: 'percentage', value: 10, label: '10% OFF' },
        'SAVE20': { type: 'percentage', value: 20, label: '20% OFF' },
        'FLAT100': { type: 'fixed', value: 100, label: '₹100 OFF' },
        'WELCOME50': { type: 'fixed', value: 50, label: '₹50 OFF' }
      };
      
      if (validCoupons[couponCode.toUpperCase()]) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          ...validCoupons[couponCode.toUpperCase()]
        });
        toast.success(`Coupon ${couponCode.toUpperCase()} applied!`);
        setCouponCode('');
      } else {
        toast.error('Invalid coupon code');
      }
      setIsApplyingCoupon(false);
    }, 500);
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }
  
  if (validCartItems.length === 0 && invalidItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Warning for removed items */}
        {invalidItems.length > 0 && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Some items were removed from your cart</p>
              <p className="text-xs text-amber-700 mt-1">
                {invalidItems.length} item(s) are no longer available and have been automatically removed.
              </p>
            </div>
            <button
              onClick={() => setInvalidItems([])}
              className="text-amber-600 hover:text-amber-700 text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
            Shopping Cart
            <span className="text-lg font-normal text-gray-500">({validCartItems.length} items)</span>
          </h1>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
                <div className="col-span-5 font-semibold text-gray-700">Product</div>
                <div className="col-span-2 font-semibold text-gray-700 text-center">Price</div>
                <div className="col-span-3 font-semibold text-gray-700 text-center">Quantity</div>
                <div className="col-span-2 font-semibold text-gray-700 text-right">Total</div>
              </div>
              
              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                {validCartItems.map((item) => {
                  const isOutOfStock = item.quantity > item.stock;
                  return (
                    <div key={item._id} className="px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Product Info */}
                        <div className="flex-1 flex items-center gap-4">
                          <img
                            src={item.images?.[0] || '/api/placeholder/80/80'}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                          />
                          <div className="flex-1">
                            <Link to={`/product/${item._id}`}>
                              <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-4 mt-1">
                              {item.stock > 0 ? (
                                <span className="text-xs text-green-600">In Stock ({item.stock} available)</span>
                              ) : (
                                <span className="text-xs text-red-600">Out of Stock</span>
                              )}
                              <button
                                onClick={() => handleRemove(item._id, item.name)}
                                className="text-red-500 text-xs hover:text-red-700 flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="md:w-32 text-center">
                          <span className="md:hidden font-semibold text-gray-600 mr-2">Price:</span>
                          <span className="font-semibold text-gray-800">₹{item.price.toLocaleString()}</span>
                        </div>
                        
                        {/* Quantity */}
                        <div className="md:w-36">
                          <div className="flex items-center justify-center gap-2">
                            <span className="md:hidden font-semibold text-gray-600 mr-2">Qty:</span>
                            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-lg hover:bg-white transition-colors flex items-center justify-center disabled:opacity-50"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="w-10 text-center font-semibold text-gray-800">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="w-8 h-8 rounded-lg hover:bg-white transition-colors flex items-center justify-center disabled:opacity-50"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                          </div>
                          {isOutOfStock && (
                            <p className="text-xs text-red-500 text-center mt-1">Only {item.stock} available</p>
                          )}
                        </div>
                        
                        {/* Total */}
                        <div className="md:w-32 text-right">
                          <span className="md:hidden font-semibold text-gray-600 mr-2">Total:</span>
                          <span className="font-bold text-indigo-600 text-lg">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={handleClearCart}
                  className="text-red-600 text-sm hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear Cart
                </button>
                <Link to="/products" className="text-indigo-600 text-sm hover:text-indigo-700 flex items-center gap-1">
                  Add More Items
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Order Summary
              </h2>
              
              {/* Coupon Section */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-700">Apply Coupon</span>
                </div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">{appliedCoupon.label}</span>
                      <span className="text-xs text-gray-500">({appliedCoupon.code})</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Cost Breakdown */}
              <div className="space-y-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    <span>Shipping</span>
                  </div>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5% GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              {/* Total */}
              <div className="flex justify-between mt-4 pt-4 text-xl font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-indigo-600 text-2xl">₹{total.toLocaleString()}</span>
              </div>
              
              {/* Savings Info */}
              {shipping === 0 && subtotal > 999 && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-700">You saved ₹50 on shipping!</p>
                </div>
              )}
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={validCartItems.some(item => item.quantity > item.stock)}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>
              
              {/* Stock Warning */}
              {validCartItems.some(item => item.quantity > item.stock) && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-700 text-center">
                    Some items have insufficient stock. Please adjust quantities.
                  </p>
                </div>
              )}
              
              {/* Note about pricing */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Prices shown are the best available after applying all applicable offers.
                    Final price will be confirmed at checkout.
                  </p>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-3">Secure Payment Methods</p>
                <div className="flex justify-center gap-3">
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">VISA</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">MasterCard</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">UPI</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">PayPal</div>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Secure
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  7-Day Returns
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Free Shipping*
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   ShoppingBag, 
//   Trash2, 
//   Plus, 
//   Minus, 
//   ArrowLeft, 
//   CreditCard, 
//   Truck, 
//   Shield, 
//   RotateCcw,
//   Tag,
//   Gift,
//   ChevronRight,
//   AlertCircle
// } from 'lucide-react';
// import { removeFromCart, updateQuantity, clearCart } from '../../features/cart/cartSlice';
// import toast from 'react-hot-toast';

// const Cart = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { cartItems } = useSelector((state) => state.cart);
//   const { userInfo } = useSelector((state) => state.auth);
//   const [couponCode, setCouponCode] = useState('');
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
  
//   const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const shipping = subtotal > 999 ? 0 : 50;
//   const tax = subtotal * 0.05; // 5% tax
//   let discount = 0;
  
//   // Apply coupon discount if any
//   if (appliedCoupon) {
//     if (appliedCoupon.type === 'percentage') {
//       discount = subtotal * (appliedCoupon.value / 100);
//     } else {
//       discount = appliedCoupon.value;
//     }
//   }
  
//   const total = subtotal + shipping + tax - discount;
  
//   const handleQuantityChange = (id, quantity) => {
//     if (quantity < 1) return;
//     dispatch(updateQuantity({ id, quantity }));
//   };
  
//   const handleRemove = (id, name) => {
//     dispatch(removeFromCart(id));
//     toast.success(`${name} removed from cart`);
//   };
  
//   const handleClearCart = () => {
//     if (window.confirm('Are you sure you want to clear your entire cart?')) {
//       dispatch(clearCart());
//       toast.success('Cart cleared');
//     }
//   };
  
//   const handleCheckout = () => {
//     if (!userInfo) {
//       toast.error('Please login to proceed to checkout');
//       navigate('/login');
//       return;
//     }
//     navigate('/checkout');
//   };
  
//   const handleApplyCoupon = () => {
//     if (!couponCode.trim()) {
//       toast.error('Please enter a coupon code');
//       return;
//     }
//     setIsApplyingCoupon(true);
    
//     // Simulate coupon validation
//     setTimeout(() => {
//       // Example coupons
//       const validCoupons = {
//         'SAVE10': { type: 'percentage', value: 10, label: '10% OFF' },
//         'SAVE20': { type: 'percentage', value: 20, label: '20% OFF' },
//         'FLAT100': { type: 'fixed', value: 100, label: '₹100 OFF' },
//         'WELCOME50': { type: 'fixed', value: 50, label: '₹50 OFF' }
//       };
      
//       if (validCoupons[couponCode.toUpperCase()]) {
//         setAppliedCoupon({
//           code: couponCode.toUpperCase(),
//           ...validCoupons[couponCode.toUpperCase()]
//         });
//         toast.success(`Coupon ${couponCode.toUpperCase()} applied!`);
//         setCouponCode('');
//       } else {
//         toast.error('Invalid coupon code');
//       }
//       setIsApplyingCoupon(false);
//     }, 500);
//   };
  
//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     toast.success('Coupon removed');
//   };
  
//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center py-20">
//         <div className="container mx-auto px-4">
//           <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-12 text-center">
//             <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <ShoppingBag className="w-12 h-12 text-indigo-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
//             <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
//             <Link
//               to="/products"
//               className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105"
//             >
//               <ShoppingBag className="w-4 h-4" />
//               Start Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <Link to="/products" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4">
//             <ArrowLeft className="w-4 h-4" />
//             Continue Shopping
//           </Link>
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
//             <ShoppingBag className="w-8 h-8 text-indigo-600" />
//             Shopping Cart
//             <span className="text-lg font-normal text-gray-500">({cartItems.length} items)</span>
//           </h1>
//         </div>
        
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//               {/* Header */}
//               <div className="hidden md:grid md:grid-cols-12 gap-4 bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
//                 <div className="col-span-5 font-semibold text-gray-700">Product</div>
//                 <div className="col-span-2 font-semibold text-gray-700 text-center">Price</div>
//                 <div className="col-span-3 font-semibold text-gray-700 text-center">Quantity</div>
//                 <div className="col-span-2 font-semibold text-gray-700 text-right">Total</div>
//               </div>
              
//               {/* Cart Items List */}
//               <div className="divide-y divide-gray-100">
//                 {cartItems.map((item) => (
//                   <div key={item._id} className="px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex flex-col md:flex-row md:items-center gap-4">
//                       {/* Product Info */}
//                       <div className="flex-1 flex items-center gap-4">
//                         <img
//                           src={item.images?.[0] || '/api/placeholder/80/80'}
//                           alt={item.name}
//                           className="w-20 h-20 object-cover rounded-xl bg-gray-100"
//                         />
//                         <div className="flex-1">
//                           <Link to={`/product/${item._id}`}>
//                             <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
//                               {item.name}
//                             </h3>
//                           </Link>
//                           <div className="flex items-center gap-4 mt-1">
//                             <span className="text-xs text-gray-500">In Stock</span>
//                             <button
//                               onClick={() => handleRemove(item._id, item.name)}
//                               className="text-red-500 text-xs hover:text-red-700 flex items-center gap-1 transition-colors"
//                             >
//                               <Trash2 className="w-3 h-3" />
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Price */}
//                       <div className="md:w-32 text-center">
//                         <span className="md:hidden font-semibold text-gray-600 mr-2">Price:</span>
//                         <span className="font-semibold text-gray-800">₹{item.price.toLocaleString()}</span>
//                       </div>
                      
//                       {/* Quantity */}
//                       <div className="md:w-36">
//                         <div className="flex items-center justify-center gap-2">
//                           <span className="md:hidden font-semibold text-gray-600 mr-2">Qty:</span>
//                           <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
//                             <button
//                               onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
//                               className="w-8 h-8 rounded-lg hover:bg-white transition-colors flex items-center justify-center"
//                             >
//                               <Minus className="w-3 h-3 text-gray-600" />
//                             </button>
//                             <span className="w-10 text-center font-semibold text-gray-800">{item.quantity}</span>
//                             <button
//                               onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
//                               className="w-8 h-8 rounded-lg hover:bg-white transition-colors flex items-center justify-center"
//                             >
//                               <Plus className="w-3 h-3 text-gray-600" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Total */}
//                       <div className="md:w-32 text-right">
//                         <span className="md:hidden font-semibold text-gray-600 mr-2">Total:</span>
//                         <span className="font-bold text-indigo-600 text-lg">₹{(item.price * item.quantity).toLocaleString()}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               {/* Footer Actions */}
//               <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
//                 <button
//                   onClick={handleClearCart}
//                   className="text-red-600 text-sm hover:text-red-700 flex items-center gap-1 transition-colors"
//                 >
//                   <Trash2 className="w-3 h-3" />
//                   Clear Cart
//                 </button>
//                 <Link to="/products" className="text-indigo-600 text-sm hover:text-indigo-700 flex items-center gap-1">
//                   Add More Items
//                   <ChevronRight className="w-3 h-3" />
//                 </Link>
//               </div>
//             </div>
//           </div>
          
//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
//               <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//                 <CreditCard className="w-5 h-5 text-indigo-600" />
//                 Order Summary
//               </h2>
              
//               {/* Coupon Section */}
//               <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Tag className="w-4 h-4 text-purple-600" />
//                   <span className="text-sm font-semibold text-gray-700">Apply Coupon</span>
//                 </div>
//                 {appliedCoupon ? (
//                   <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
//                     <div className="flex items-center gap-2">
//                       <Gift className="w-4 h-4 text-green-600" />
//                       <span className="text-sm font-medium text-green-700">{appliedCoupon.label}</span>
//                       <span className="text-xs text-gray-500">({appliedCoupon.code})</span>
//                     </div>
//                     <button
//                       onClick={handleRemoveCoupon}
//                       className="text-red-500 hover:text-red-700 text-xs"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       placeholder="Enter coupon code"
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//                     />
//                     <button
//                       onClick={handleApplyCoupon}
//                       disabled={isApplyingCoupon}
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-50"
//                     >
//                       {isApplyingCoupon ? 'Applying...' : 'Apply'}
//                     </button>
//                   </div>
//                 )}
//               </div>
              
//               {/* Cost Breakdown */}
//               <div className="space-y-3 border-b border-gray-200 pb-4">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal</span>
//                   <span>₹{subtotal.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <div className="flex items-center gap-1">
//                     <Truck className="w-4 h-4" />
//                     <span>Shipping</span>
//                   </div>
//                   <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Tax (5% GST)</span>
//                   <span>₹{tax.toLocaleString()}</span>
//                 </div>
//                 {discount > 0 && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Discount</span>
//                     <span>-₹{discount.toLocaleString()}</span>
//                   </div>
//                 )}
//               </div>
              
//               {/* Total */}
//               <div className="flex justify-between mt-4 pt-4 text-xl font-bold">
//                 <span className="text-gray-800">Total</span>
//                 <span className="text-indigo-600 text-2xl">₹{total.toLocaleString()}</span>
//               </div>
              
//               {/* Savings Info */}
//               {shipping === 0 && subtotal > 999 && (
//                 <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center gap-2">
//                   <Gift className="w-4 h-4 text-green-600" />
//                   <p className="text-xs text-green-700">You saved ₹50 on shipping!</p>
//                 </div>
//               )}
              
//               {/* Checkout Button */}
//               <button
//                 onClick={handleCheckout}
//                 className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
//               >
//                 <CreditCard className="w-5 h-5" />
//                 Proceed to Checkout
//               </button>
              
//               {/* Note about pricing */}
//               <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                 <div className="flex items-start gap-2">
//                   <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
//                   <p className="text-xs text-blue-700">
//                     Prices shown are the best available after applying all applicable offers.
//                     Final price will be confirmed at checkout.
//                   </p>
//                 </div>
//               </div>
              
//               {/* Payment Methods */}
//               <div className="mt-6 pt-4 border-t border-gray-200">
//                 <p className="text-xs text-gray-500 text-center mb-3">Secure Payment Methods</p>
//                 <div className="flex justify-center gap-3">
//                   <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">VISA</div>
//                   <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">MasterCard</div>
//                   <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">UPI</div>
//                   <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">PayPal</div>
//                 </div>
//               </div>
              
//               {/* Trust Badges */}
//               <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
//                 <span className="flex items-center gap-1">
//                   <Shield className="w-3 h-3" />
//                   Secure
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <RotateCcw className="w-3 h-3" />
//                   7-Day Returns
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Truck className="w-3 h-3" />
//                   Free Shipping*
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;