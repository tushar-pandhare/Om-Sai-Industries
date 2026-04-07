// components/OrderCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  Eye
} from 'lucide-react';

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusConfig = (status) => {
    const configs = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
      confirmed: { icon: CheckCircle, color: 'bg-indigo-100 text-indigo-700', label: 'Confirmed' },
      processing: { icon: Package, color: 'bg-purple-100 text-purple-700', label: 'Processing' },
      shipped: { icon: Truck, color: 'bg-blue-100 text-blue-700', label: 'Shipped' },
      delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Delivered' },
      cancelled: { icon: Package, color: 'bg-red-100 text-red-700', label: 'Cancelled' }
    };
    return configs[status] || configs.pending;
  };
  
  const StatusIcon = getStatusConfig(order.status).icon;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Order Header */}
      <div className="p-5 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 font-medium">ORDER ID</p>
              <p className="text-sm font-semibold text-gray-800 font-mono">#{order._id?.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">PLACED ON</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">TOTAL AMOUNT</p>
              <p className="text-lg font-bold text-indigo-600">₹{order.totalAmount?.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusConfig(order.status).color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{getStatusConfig(order.status).label}</span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Order Items Preview */}
      <div className="p-5">
        <div className="flex flex-wrap gap-4">
          {order.products?.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <img
                src={item.image || '/api/placeholder/50/50'}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg bg-gray-100"
              />
              <div>
                <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          {order.products?.length > 3 && (
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
              <span className="text-xs font-semibold text-gray-600">+{order.products.length - 3}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-5 animate-slideDown">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Shipping Address
              </h4>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-700">{order.shippingAddress?.street}</p>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>
                <p className="text-sm text-gray-700">{order.shippingAddress?.country}</p>
              </div>
            </div>
            
            {/* Order Timeline */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Order Timeline
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Order Placed</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {order.status !== 'pending' && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Order Confirmed</p>
                      <p className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {order.status === 'delivered' && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Delivered</p>
                      <p className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Items List */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.products?.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || '/api/placeholder/50/50'}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex gap-3 justify-end">
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <button className="px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors">
                Cancel Order
              </button>
            )}
            {order.status === 'delivered' && (
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Eye className="w-3 h-3" />
                Write a Review
              </button>
            )}
            <Link 
              to={`/orders/${order._id}`}
              className="px-4 py-2 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default OrderCard;