import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  MapPin,
  Calendar,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  Home,
  Building2,
  Globe,
  ChevronRight,
  MessageCircle,
  FileText,
  HelpCircle,
  ThumbsUp,
  AlertTriangle,
  Ban,
  RotateCcw
} from 'lucide-react';
import { fetchMyOrders } from '../../features/orders/orderSlice';
import toast from 'react-hot-toast';

const ManageOrderUserSide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    // Fetch orders if not already loaded
    if (orders.length === 0) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, orders.length]);

  useEffect(() => {
    if (orders.length > 0 && id) {
      const foundOrder = orders.find(o => o._id === id);
      setOrder(foundOrder);
    }
  }, [orders, id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date not available';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  const getStatusConfig = (orderStatus) => {
    const configs = {
      pending: { 
        bg: 'bg-amber-100', 
        text: 'text-amber-700', 
        border: 'border-amber-200', 
        label: 'Pending', 
        icon: Clock, 
        color: '#f59e0b',
        description: 'Your order has been placed and is awaiting confirmation.'
      },
      confirmed: { 
        bg: 'bg-indigo-100', 
        text: 'text-indigo-700', 
        border: 'border-indigo-200', 
        label: 'Confirmed', 
        icon: CheckCircle, 
        color: '#6366f1',
        description: 'Your order has been confirmed and is being processed.'
      },
      processing: { 
        bg: 'bg-purple-100', 
        text: 'text-purple-700', 
        border: 'border-purple-200', 
        label: 'Processing', 
        icon: Package, 
        color: '#8b5cf6',
        description: 'Your order is being packed and prepared for shipping.'
      },
      shipped: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        border: 'border-blue-200', 
        label: 'Shipped', 
        icon: Truck, 
        color: '#3b82f6',
        description: 'Your order has been shipped and is on its way!'
      },
      delivered: { 
        bg: 'bg-emerald-100', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200', 
        label: 'Delivered', 
        icon: CheckCircle, 
        color: '#10b981',
        description: 'Your order has been delivered successfully!'
      },
      cancelled: { 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        border: 'border-red-200', 
        label: 'Cancelled', 
        icon: XCircle, 
        color: '#ef4444',
        description: 'Your order has been cancelled.'
      }
    };
    return configs[orderStatus] || configs.pending;
  };

  // Check if order can be cancelled
  const canCancelOrder = () => {
    if (!order) return false;
    
    // Cannot cancel if already delivered, shipped, or cancelled
    if (['delivered', 'shipped', 'cancelled'].includes(order.orderStatus)) {
      return false;
    }
    
    // Check if order was placed within 2 days (48 hours)
    const orderDate = new Date(order.orderDate || order.createdAt);
    const currentDate = new Date();
    const hoursDifference = (currentDate - orderDate) / (1000 * 60 * 60);
    
    return hoursDifference <= 48;
  };

  const getCancellationDeadline = () => {
    if (!order) return null;
    const orderDate = new Date(order.orderDate || order.createdAt);
    const deadline = new Date(orderDate.getTime() + (48 * 60 * 60 * 1000));
    return deadline;
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    
    if (!canCancelOrder()) {
      toast.error('Order cannot be cancelled at this time');
      return;
    }
    
    setIsCancelling(true);
    
    // Simulate API call to cancel order
    // In production, you would dispatch an action to update order status
    setTimeout(() => {
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      // Refresh orders
      dispatch(fetchMyOrders());
      setIsCancelling(false);
    }, 1500);
  };

  const getProgressSteps = () => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order?.orderStatus);
    
    return statusOrder.map((status, index) => {
      const isCompleted = index <= currentIndex;
      const isCurrent = index === currentIndex;
      const config = getStatusConfig(status);
      const Icon = config.icon;
      
      return { status, label: config.label, icon: Icon, isCompleted, isCurrent, index };
    });
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;
  const canCancel = canCancelOrder();
  const deadline = getCancellationDeadline();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-indigo-200 text-sm">Order ID</p>
                <p className="text-white font-mono text-xl font-bold">#{order._id?.slice(-12).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Placed On</p>
                <p className="text-white font-semibold">{formatDate(order.orderDate || order.createdAt)}</p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Total Amount</p>
                <p className="text-white text-2xl font-bold">₹{order.totalAmount?.toLocaleString()}</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="font-semibold">{statusConfig.label}</span>
              </div>
            </div>
          </div>
          
          {/* Status Description */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <p className="text-slate-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-500" />
              {statusConfig.description}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Progress & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Order Progress
              </h3>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                
                <div className="space-y-6 relative">
                  {getProgressSteps().map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.status} className="relative flex gap-4">
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          step.isCompleted 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          {step.isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <h4 className={`font-semibold ${step.isCompleted ? 'text-indigo-600' : 'text-slate-600'}`}>
                            {step.label}
                          </h4>
                          {step.isCurrent && (
                            <p className="text-sm text-slate-500 mt-1">
                              {step.status === 'pending' && 'Your order is being reviewed'}
                              {step.status === 'confirmed' && 'Your order has been confirmed'}
                              {step.status === 'processing' && 'We are preparing your order'}
                              {step.status === 'shipped' && 'Your order is on the way!'}
                              {step.status === 'delivered' && 'Your order has been delivered'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                Order Items
              </h3>
              <div className="space-y-3">
                {order.products?.map((item, idx) => {
                  const productName = item.product?.name || item.name || 'Product';
                  const productImage = item.product?.images?.[0] || item.image || '/api/placeholder/80/80';
                  const productPrice = item.price || item.product?.price || 0;
                  const quantity = item.quantity || 1;
                  
                  return (
                    <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl hover:shadow-md transition-all">
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => { e.target.src = '/api/placeholder/80/80'; }}
                      />
                      <div className="flex-1">
                        <Link to={`/product/${item.product?._id}`} className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors">
                          {productName}
                        </Link>
                        <p className="text-sm text-slate-500 mt-1">Quantity: {quantity}</p>
                        <p className="text-sm text-slate-500">Price: ₹{productPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">₹{(productPrice * quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax (5% GST)</span>
                    <span className="font-medium">₹{Math.round(order.totalAmount * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-800">Total</span>
                    <span className="font-bold text-indigo-600 text-lg">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Shipping Address
              </h3>
              {order.shippingAddress ? (
                <div className="space-y-2 text-slate-600">
                  <p className="flex items-start gap-2">
                    <Home className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span>{order.shippingAddress.street || 'N/A'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span>{order.shippingAddress.city || 'N/A'}, {order.shippingAddress.state || 'N/A'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span>PIN: {order.shippingAddress.pincode || 'N/A'}, {order.shippingAddress.country || 'India'}</span>
                  </p>
                </div>
              ) : (
                <p className="text-slate-500">No address available</p>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Method</span>
                  <span className="font-medium text-slate-800 capitalize">{order.paymentMethod || 'COD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className="text-emerald-600 font-medium">
                    {order.orderStatus === 'delivered' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Need Help? */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                Need Help?
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Having issues with your order? Contact our support team.
              </p>
              <div className="space-y-2">
                <Link 
                  to="/contact" 
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with Support
                </Link>
                <Link 
                  to="/complaint" 
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  <FileText className="w-4 h-4" />
                  Raise a Complaint
                </Link>
              </div>
            </div>

            {/* Cancel Order Section */}
            {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
              <div className={`rounded-2xl p-6 ${canCancel ? 'bg-amber-50 border border-amber-200' : 'bg-slate-100 border border-slate-200'}`}>
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-500" />
                  Cancel Order
                </h3>
                
                {canCancel ? (
                  <>
                    <p className="text-sm text-slate-600 mb-3">
                      You can cancel this order before it is shipped. 
                      Cancellation available until {deadline?.toLocaleString()}.
                    </p>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-amber-700 bg-amber-100 p-3 rounded-lg">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        {order.orderStatus === 'shipped' && 'Your order has already been shipped and cannot be cancelled.'}
                        {order.orderStatus === 'delivered' && 'Your order has been delivered and cannot be cancelled.'}
                        {order.orderStatus === 'cancelled' && 'This order has already been cancelled.'}
                        {!['shipped', 'delivered', 'cancelled'].includes(order.orderStatus) && 
                          'Cancellation period has expired (only available within 48 hours of order placement).'}
                      </p>
                    </div>
                    {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                      <Link 
                        to="/contact"
                        className="w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
                      >
                        Contact Support
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Write Review Button for Delivered Orders */}
            {order.orderStatus === 'delivered' && (
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-emerald-600" />
                  Love Your Purchase?
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Share your experience and help other customers make better decisions.
                </p>
                <Link
                  to="/feedback"
                  className="w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
                >
                  Write a Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Cancel Order</h3>
              <p className="text-slate-500 text-sm mt-2">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="">Select a reason</option>
                <option value="changed_mind">Changed my mind</option>
                <option value="found_better_price">Found a better price elsewhere</option>
                <option value="ordered_by_mistake">Ordered by mistake</option>
                <option value="delivery_time">Delivery time too long</option>
                <option value="payment_issue">Payment issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {cancelReason === 'other' && (
              <div className="mb-4">
                <textarea
                  placeholder="Please specify your reason..."
                  rows="3"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                />
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling || !cancelReason}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Cancel Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrderUserSide;