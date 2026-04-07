import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Truck, 
  CreditCard, 
  Shield, 
  ArrowLeft, 
  CheckCircle, 
  MapPin, 
  Package, 
  Clock,
  Wallet,
  Home,
  Building2,
  Globe,
  Smartphone,
  Lock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { createOrder } from '../../features/orders/orderSlice';
import { clearCart } from '../../features/cart/cartSlice';
import toast from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const [formData, setFormData] = useState({
    shippingAddress: userInfo?.address || {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    paymentMethod: 'COD',
    saveAddress: false
  });
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/products');
    }
  }, [cartItems, navigate]);
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      shippingAddress: {
        ...formData.shippingAddress,
        [name]: value
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { street, city, state, pincode } = formData.shippingAddress;
    if (!street || !city || !state || !pincode) {
      toast.error('Please fill in all address fields');
      return;
    }
    
    if (pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code');
      return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Placing your order...');
    
    const orderData = {
      products: cartItems.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.images?.[0]
      })),
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      totalAmount: total,
      shippingAddress: formData.shippingAddress,
      paymentMethod: 'COD'
    };
    
    try {
      await dispatch(createOrder(orderData)).unwrap();
      toast.dismiss(loadingToast);
      toast.success(
        (t) => (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Order Placed! 🎉</p>
              <p className="text-sm text-gray-600">Your order has been confirmed</p>
            </div>
          </div>
        ),
        {
          duration: 4000,
          style: {
            background: '#F0FDF4',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid #86EFAC',
          },
        }
      );
      dispatch(clearCart());
      navigate('/orders');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (cartItems.length === 0) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="bg-slate-900 pt-20 pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[70%] bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[70%] bg-emerald-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            Secure Checkout
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Purchase</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Review your order and provide shipping details
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors bg-white px-4 py-2 rounded-xl shadow-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-4 border border-slate-100">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">Cart</span>
            </div>
            <div className="w-12 h-0.5 bg-indigo-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span className="ml-2 text-sm font-medium text-indigo-600 hidden sm:inline">Checkout</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span className="ml-2 text-sm font-medium text-slate-500 hidden sm:inline">Confirmation</span>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
                <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Shipping Address</h2>
                      <p className="text-sm text-slate-500 mt-0.5">Where should we deliver your order?</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        name="street"
                        required
                        value={formData.shippingAddress.street}
                        onChange={handleAddressChange}
                        onFocus={() => setFocusedField('street')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all
                          ${focusedField === 'street' 
                            ? 'border-indigo-400 ring-4 ring-indigo-100' 
                            : 'border-slate-200 hover:border-indigo-300'
                          }
                        `}
                        placeholder="House number, street name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.shippingAddress.city}
                          onChange={handleAddressChange}
                          onFocus={() => setFocusedField('city')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all
                            ${focusedField === 'city' 
                              ? 'border-indigo-400 ring-4 ring-indigo-100' 
                              : 'border-slate-200 hover:border-indigo-300'
                            }
                          `}
                          placeholder="Enter city"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.shippingAddress.state}
                        onChange={handleAddressChange}
                        onFocus={() => setFocusedField('state')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all
                          ${focusedField === 'state' 
                            ? 'border-indigo-400 ring-4 ring-indigo-100' 
                            : 'border-slate-200 hover:border-indigo-300'
                          }
                        `}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength="6"
                        value={formData.shippingAddress.pincode}
                        onChange={handleAddressChange}
                        onFocus={() => setFocusedField('pincode')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all
                          ${focusedField === 'pincode' 
                            ? 'border-indigo-400 ring-4 ring-indigo-100' 
                            : 'border-slate-200 hover:border-indigo-300'
                          }
                        `}
                        placeholder="6-digit PIN code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="country"
                          required
                          value={formData.shippingAddress.country}
                          onChange={handleAddressChange}
                          onFocus={() => setFocusedField('country')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all
                            ${focusedField === 'country' 
                              ? 'border-indigo-400 ring-4 ring-indigo-100' 
                              : 'border-slate-200 hover:border-indigo-300'
                            }
                          `}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={formData.saveAddress}
                      onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="saveAddress" className="text-sm text-slate-700">
                      Save this address for future orders
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
                <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                      <Wallet className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Payment Method</h2>
                      <p className="text-sm text-slate-500 mt-0.5">Choose how you want to pay</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-4">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Smartphone className="w-5 h-5 text-emerald-600" />
                          <span className="font-semibold text-slate-800">Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          Pay with cash when your order is delivered. No additional charges.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700">
                          <CheckCircle className="w-3 h-3" />
                          <span>Safe & Secure</span>
                          <span className="text-slate-300">|</span>
                          <span>No extra fees</span>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="flex items-start gap-3">
                      <Lock className="w-4 h-4 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-indigo-800">Payment Information</p>
                        <p className="text-xs text-indigo-600 mt-1">
                          Cash on Delivery is available for orders up to ₹50,000. 
                          Please keep exact change ready for smooth delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order • ₹{total.toLocaleString()}
                  </>
                )}
              </button>
              
              {/* Secure Checkout Notice */}
              <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Secure Payment
                </span>
                <span>100% Safe</span>
                <span>Privacy Protected</span>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 sticky top-24">
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <Package className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Order Summary</h2>
                    <p className="text-sm text-slate-500 mt-0.5">{cartItems.length} item(s) in cart</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Items List */}
                <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-3 py-2 border-b border-slate-100 last:border-0">
                      <img
                        src={item.images?.[0] || '/api/placeholder/60/60'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium text-slate-800">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Truck className="w-3 h-3" />
                      <span>Shipping</span>
                    </div>
                    <span className="font-medium text-slate-800">
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax (5% GST)</span>
                    <span className="font-medium text-slate-800">₹{tax.toLocaleString()}</span>
                  </div>
                  
                  {shipping === 0 && subtotal > 999 && (
                    <div className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-100">
                      <p className="text-xs text-emerald-700 flex items-center justify-center gap-1">
                        <Truck className="w-3 h-3" />
                        🎉 You saved ₹50 on shipping!
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-3 border-t border-slate-200">
                    <span className="text-base font-bold text-slate-800">Total</span>
                    <span className="text-2xl font-bold text-indigo-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Delivery Info */}
                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-slate-700">Estimated Delivery</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Order within the next <span className="font-bold text-indigo-600">2 hours</span> for delivery by 
                    <span className="font-semibold"> {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                  </p>
                </div>
                
                {/* Trust Badges */}
                <div className="mt-4 flex justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    7-Day Returns
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Free Shipping*
                  </span>
                </div>
              </div>
            </div>
            
            {/* Customer Info Card */}
            {userInfo && (
              <div className="mt-6 bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{userInfo.name}</p>
                    <p className="text-xs text-slate-500">{userInfo.email}</p>
                    {userInfo.phone && <p className="text-xs text-slate-500">{userInfo.phone}</p>}
                  </div>
                </div>
                <div className="text-xs text-slate-500 text-center pt-3 border-t border-slate-100">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Order confirmation will be sent to your email
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   Truck, 
//   CreditCard, 
//   Shield, 
//   ArrowLeft, 
//   CheckCircle, 
//   MapPin, 
//   Package, 
//   Clock,
//   Wallet,
//   Home,
//   Building2,
//   Globe,
//   Smartphone,
//   Lock
// } from 'lucide-react';
// import { createOrder } from '../../features/orders/orderSlice';
// import { clearCart } from '../../features/cart/cartSlice';
// import toast from 'react-hot-toast';

// const Checkout = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { cartItems } = useSelector((state) => state.cart);
//   const { userInfo } = useSelector((state) => state.auth);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const [formData, setFormData] = useState({
//     shippingAddress: userInfo?.address || {
//       street: '',
//       city: '',
//       state: '',
//       pincode: '',
//       country: 'India'
//     },
//     paymentMethod: 'COD',
//     saveAddress: false
//   });
  
//   const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const shipping = subtotal > 999 ? 0 : 50;
//   const tax = subtotal * 0.05; // 5% GST
//   const total = subtotal + shipping + tax;
  
//   useEffect(() => {
//     if (cartItems.length === 0) {
//       toast.error('Your cart is empty');
//       navigate('/products');
//     }
//   }, [cartItems, navigate]);
  
//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       shippingAddress: {
//         ...formData.shippingAddress,
//         [name]: value
//       }
//     });
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate address
//     const { street, city, state, pincode } = formData.shippingAddress;
//     if (!street || !city || !state || !pincode) {
//       toast.error('Please fill in all address fields');
//       return;
//     }
    
//     if (pincode.length !== 6) {
//       toast.error('Please enter a valid 6-digit PIN code');
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     const orderData = {
//       products: cartItems.map(item => ({
//         product: item._id,
//         quantity: item.quantity,
//         price: item.price,
//         name: item.name,
//         image: item.images?.[0]
//       })),
//       subtotal: subtotal,
//       shipping: shipping,
//       tax: tax,
//       totalAmount: total,
//       shippingAddress: formData.shippingAddress,
//       paymentMethod: 'COD'
//     };
    
//     try {
//       const result = await dispatch(createOrder(orderData)).unwrap();
//       toast.success('Order placed successfully!');
//       dispatch(clearCart());
//       navigate('/orders');
//     } catch (error) {
//       toast.error(error.message || 'Failed to place order. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   const getInitials = (name) => {
//     return name?.charAt(0).toUpperCase() || 'U';
//   };
  
//   if (cartItems.length === 0) {
//     return null;
//   }
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <Link to="/cart" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4 transition-colors">
//             <ArrowLeft className="w-4 h-4" />
//             Back to Cart
//           </Link>
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
//               <CreditCard className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Checkout</h1>
//               <p className="text-gray-500 mt-1">Complete your purchase securely</p>
//             </div>
//           </div>
//         </div>
        
//         {/* Progress Steps */}
//         <div className="mb-8">
//           <div className="flex items-center justify-center gap-2 md:gap-4">
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
//               <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">Cart</span>
//             </div>
//             <div className="w-12 h-0.5 bg-indigo-600"></div>
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
//               <span className="ml-2 text-sm font-medium text-indigo-600 hidden sm:inline">Checkout</span>
//             </div>
//             <div className="w-12 h-0.5 bg-gray-300"></div>
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
//               <span className="ml-2 text-sm font-medium text-gray-500 hidden sm:inline">Confirmation</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Checkout Form */}
//           <div className="lg:col-span-2">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Shipping Address Section */}
//               <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//                 <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
//                   <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                     <MapPin className="w-5 h-5 text-indigo-600" />
//                     Shipping Address
//                   </h2>
//                   <p className="text-sm text-gray-500 mt-1">Where should we deliver your order?</p>
//                 </div>
                
//                 <div className="p-6 space-y-5">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Street Address <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="text"
//                         name="street"
//                         required
//                         value={formData.shippingAddress.street}
//                         onChange={handleAddressChange}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
//                         placeholder="House number, street name"
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="grid md:grid-cols-2 gap-5">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         City <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         <input
//                           type="text"
//                           name="city"
//                           required
//                           value={formData.shippingAddress.city}
//                           onChange={handleAddressChange}
//                           className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
//                           placeholder="Enter city"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         State <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="state"
//                         required
//                         value={formData.shippingAddress.state}
//                         onChange={handleAddressChange}
//                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
//                         placeholder="Enter state"
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="grid md:grid-cols-2 gap-5">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         PIN Code <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="pincode"
//                         required
//                         maxLength="6"
//                         value={formData.shippingAddress.pincode}
//                         onChange={handleAddressChange}
//                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
//                         placeholder="6-digit PIN code"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Country <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         <input
//                           type="text"
//                           name="country"
//                           required
//                           value={formData.shippingAddress.country}
//                           onChange={handleAddressChange}
//                           className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
//                           placeholder="Country"
//                         />
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3 pt-2">
//                     <input
//                       type="checkbox"
//                       id="saveAddress"
//                       checked={formData.saveAddress}
//                       onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}
//                       className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
//                     />
//                     <label htmlFor="saveAddress" className="text-sm text-gray-700">
//                       Save this address for future orders
//                     </label>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Payment Method - COD Only */}
//               <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//                 <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
//                   <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                     <Wallet className="w-5 h-5 text-indigo-600" />
//                     Payment Method
//                   </h2>
//                   <p className="text-sm text-gray-500 mt-1">Choose how you want to pay</p>
//                 </div>
                
//                 <div className="p-6">
//                   <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
//                     <label className="flex items-start gap-4 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="COD"
//                         checked={formData.paymentMethod === 'COD'}
//                         onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
//                         className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
//                       />
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <Smartphone className="w-5 h-5 text-green-600" />
//                           <span className="font-semibold text-gray-800">Cash on Delivery (COD)</span>
//                         </div>
//                         <p className="text-sm text-gray-600">
//                           Pay with cash when your order is delivered. No additional charges.
//                         </p>
//                         <div className="mt-2 flex items-center gap-2 text-xs text-green-700">
//                           <CheckCircle className="w-3 h-3" />
//                           <span>Safe & Secure</span>
//                           <span className="text-gray-300">|</span>
//                           <span>No extra fees</span>
//                         </div>
//                       </div>
//                     </label>
//                   </div>
                  
//                   <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//                     <div className="flex items-start gap-3">
//                       <Lock className="w-4 h-4 text-blue-600 mt-0.5" />
//                       <div>
//                         <p className="text-xs text-blue-800 font-medium">Payment Information</p>
//                         <p className="text-xs text-blue-600 mt-1">
//                           Cash on Delivery is available for orders up to ₹50,000. 
//                           Please keep exact change ready for smooth delivery.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Place Order Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-lg"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Processing Order...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-5 h-5" />
//                     Place Order • ₹{total.toLocaleString()}
//                   </>
//                 )}
//               </button>
              
//               {/* Secure Checkout Notice */}
//               <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-4">
//                 <span className="flex items-center gap-1">
//                   <Lock className="w-3 h-3" />
//                   Secure Payment
//                 </span>
//                 <span>100% Safe</span>
//                 <span>Privacy Protected</span>
//               </div>
//             </form>
//           </div>
          
//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
//               <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
//                 <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                   <Package className="w-5 h-5 text-indigo-600" />
//                   Order Summary
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">{cartItems.length} item(s) in cart</p>
//               </div>
              
//               <div className="p-6">
//                 {/* Items List */}
//                 <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
//                   {cartItems.map((item) => (
//                     <div key={item._id} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
//                       <img
//                         src={item.images?.[0] || '/api/placeholder/60/60'}
//                         alt={item.name}
//                         className="w-12 h-12 object-cover rounded-lg bg-gray-100"
//                       />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
//                         <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm font-semibold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 {/* Price Breakdown */}
//                 <div className="space-y-3 border-t border-gray-200 pt-4">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium text-gray-800">₹{subtotal.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <div className="flex items-center gap-1 text-gray-600">
//                       <Truck className="w-3 h-3" />
//                       <span>Shipping</span>
//                     </div>
//                     <span className="font-medium text-gray-800">
//                       {shipping === 0 ? 'FREE' : `₹${shipping}`}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Tax (5% GST)</span>
//                     <span className="font-medium text-gray-800">₹{tax.toLocaleString()}</span>
//                   </div>
                  
//                   {shipping === 0 && subtotal > 999 && (
//                     <div className="bg-green-50 rounded-lg p-2 text-center">
//                       <p className="text-xs text-green-700 flex items-center justify-center gap-1">
//                         <Truck className="w-3 h-3" />
//                         You saved ₹50 on shipping!
//                       </p>
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between pt-3 border-t border-gray-200">
//                     <span className="text-lg font-bold text-gray-800">Total</span>
//                     <span className="text-2xl font-bold text-indigo-600">₹{total.toLocaleString()}</span>
//                   </div>
//                 </div>
                
//                 {/* Delivery Info */}
//                 <div className="mt-6 p-4 bg-gray-50 rounded-xl">
//                   <div className="flex items-center gap-3 mb-3">
//                     <Clock className="w-4 h-4 text-indigo-600" />
//                     <span className="text-sm font-semibold text-gray-700">Estimated Delivery</span>
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     Order within the next <span className="font-bold text-indigo-600">2 hours</span> for delivery by 
//                     <span className="font-semibold"> {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
//                   </p>
//                 </div>
                
//                 {/* Trust Badges */}
//                 <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
//                   <span className="flex items-center gap-1">
//                     <Shield className="w-3 h-3" />
//                     Secure
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <CheckCircle className="w-3 h-3" />
//                     7-Day Returns
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Truck className="w-3 h-3" />
//                     Free Shipping*
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             {/* Customer Info Card */}
//             {userInfo && (
//               <div className="mt-6 bg-white rounded-2xl shadow-lg p-5">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
//                     {getInitials(userInfo.name)}
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-800">{userInfo.name}</p>
//                     <p className="text-xs text-gray-500">{userInfo.email}</p>
//                     {userInfo.phone && <p className="text-xs text-gray-500">{userInfo.phone}</p>}
//                   </div>
//                 </div>
//                 <div className="text-xs text-gray-500 text-center pt-3 border-t border-gray-100">
//                   Order confirmation will be sent to your email
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;