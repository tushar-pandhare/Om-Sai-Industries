import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus, cancelOrder } from '../../features/orders/orderSlice';
import { 
  Package, Clock, CheckCircle, Truck, XCircle, 
  User, MapPin, Phone, Mail, Loader2, AlertCircle, 
  RefreshCw, Warehouse, ArrowLeft, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'Pending' },
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Package, label: 'Confirmed' },
    shipped: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Truck, label: 'Shipped' },
    delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, label: 'Delivered' },
    cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle, label: 'Cancelled' }
  };
  const { bg, text, border, icon: Icon, label } = config[status] || config.pending;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${bg} ${text} ${border}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

// Main OrderDetails Component
const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, stockUpdateInProgress } = useSelector((state) => state.orders);
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, orders]);

  useEffect(() => {
    if (orders && orders.length > 0 && id) {
      const foundOrder = orders.find(o => o._id === id);
      setOrder(foundOrder);
    }
  }, [orders, id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const result = await dispatch(updateOrderStatus({ id: order._id, status: newStatus }));
      if (updateOrderStatus.fulfilled.match(result)) {
        toast.success(`Order ${newStatus} successfully! Stock has been updated.`);
        await dispatch(fetchAllOrders());
      } else {
        toast.error(result.payload || 'Failed to update order status');
      }
    } catch (error) {
      toast.error('An error occurred while updating the order');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    setUpdating(true);
    try {
      const result = await dispatch(cancelOrder(order._id));
      if (cancelOrder.fulfilled.match(result)) {
        toast.success('Order cancelled successfully! Stock has been restored.');
        await dispatch(fetchAllOrders());
        setShowCancelConfirm(false);
      } else {
        toast.error(result.payload || 'Failed to cancel order');
      }
    } catch (error) {
      toast.error('An error occurred while cancelling the order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Order Not Found</h3>
            <p className="text-gray-500 text-sm mb-4">The order you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/admin/orders')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Consistent with other pages */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Link
                to="/admin/orders"
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Order #{order._id?.slice(-8)} • Placed on {new Date(order.orderDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            {stockUpdateInProgress && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-xl">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating stock...
              </div>
            )}
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 ml-12">
            <Link to="/admin" className="hover:text-gray-700 transition-colors">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/admin/orders" className="hover:text-gray-700 transition-colors">Orders</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Order #{order._id?.slice(-8)}</span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  Order Items
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {order.products?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:shadow-sm transition-all duration-200">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800">{item.product?.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                        {item.product?.sku && (
                          <p className="text-xs text-gray-400 mt-1">SKU: {item.product.sku}</p>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800 text-lg ml-3">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-700">₹{order.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span className="text-gray-800">Total</span>
                      <span className="text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  Order Timeline
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order Placed</p>
                      <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                  </div>
                  {order.orderStatus !== 'pending' && order.orderStatus !== 'cancelled' && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Order Confirmed</p>
                        <p className="text-sm text-gray-500">Stock has been reserved</p>
                      </div>
                    </div>
                  )}
                  {order.orderStatus === 'shipped' && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Truck className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Order Shipped</p>
                        <p className="text-sm text-gray-500">Order is on the way</p>
                      </div>
                    </div>
                  )}
                  {order.orderStatus === 'delivered' && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Order Delivered</p>
                        <p className="text-sm text-gray-500">Order has been delivered to customer</p>
                      </div>
                    </div>
                  )}
                  {order.orderStatus === 'cancelled' && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                          <XCircle className="h-4 w-4 text-rose-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Order Cancelled</p>
                        <p className="text-sm text-gray-500">Stock has been restored</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Info & Actions */}
          <div className="space-y-6">
            {/* Status & Actions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                  Order Status
                </h2>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-gray-500">Current Status</span>
                  <StatusBadge status={order.orderStatus} />
                </div>

                <div className="space-y-3">
                  {order.orderStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange('confirmed')}
                        disabled={updating}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                      >
                        {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
                        Confirm Order
                      </button>
                      {showCancelConfirm ? (
                        <div className="space-y-2">
                          <button
                            onClick={handleCancelOrder}
                            disabled={updating}
                            className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200"
                          >
                            Confirm Cancellation
                          </button>
                          <button
                            onClick={() => setShowCancelConfirm(false)}
                            className="w-full px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                          >
                            Back
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCancelConfirm(true)}
                          disabled={updating}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md"
                        >
                          Cancel Order
                        </button>
                      )}
                    </>
                  )}

                  {order.orderStatus === 'confirmed' && (
                    <>
                      <button
                        onClick={() => handleStatusChange('shipped')}
                        disabled={updating}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                      >
                        {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
                        Mark as Shipped
                      </button>
                      <button
                        onClick={() => handleStatusChange('cancelled')}
                        disabled={updating}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}

                  {order.orderStatus === 'shipped' && (
                    <>
                      <button
                        onClick={() => handleStatusChange('delivered')}
                        disabled={updating}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                      >
                        {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Mark as Delivered
                      </button>
                      <button
                        onClick={() => handleStatusChange('cancelled')}
                        disabled={updating}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}

                  {order.orderStatus === 'delivered' && (
                    <div className="text-center text-sm text-emerald-600 bg-emerald-50 p-3 rounded-xl">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Order completed successfully
                    </div>
                  )}

                  {order.orderStatus === 'cancelled' && (
                    <div className="text-center text-sm text-rose-600 bg-rose-50 p-3 rounded-xl">
                      <XCircle className="h-4 w-4 inline mr-1" />
                      Order has been cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  Customer Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</p>
                  <p className="text-sm font-medium text-gray-800">{order.user?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    {order.user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {order.user?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  Shipping Address
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">{order.shippingAddress?.street}</p>
                  <p className="text-sm text-gray-700">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </p>
                  <p className="text-sm text-gray-700">PIN: {order.shippingAddress?.pincode}</p>
                  <p className="text-sm text-gray-700">{order.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            {/* Stock Information */}
            {(order.orderStatus === 'confirmed' || order.orderStatus === 'shipped') && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Warehouse className="h-4 w-4" />
                  <span>Stock has been reduced for this order</span>
                </div>
              </div>
            )}
            {order.orderStatus === 'cancelled' && (
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 text-sm text-orange-700">
                  <RefreshCw className="h-4 w-4" />
                  <span>Stock has been restored for cancelled items</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;