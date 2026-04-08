// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllOrders, updateOrderStatus } from '../../features/orders/orderSlice';
// import { 
//   Package, Clock, CheckCircle, Truck, XCircle, Eye, Filter,
//   TrendingUp, DollarSign, ShoppingBag, ChevronDown, ChevronUp,
//   Search, User, MapPin, Phone, Mail, Calendar as CalendarIcon,
//   Loader2, AlertCircle, ArrowUpDown
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// // Stat Card Component
// const StatCard = ({ title, value, icon: Icon, color, trend }) => (
//   <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md hover:border-gray-200">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium text-gray-500 tracking-wide">{title}</p>
//         <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
//       </div>
//       <div className={`p-3 rounded-xl ${color.bg} ${color.text} transition-transform group-hover:scale-105`}>
//         <Icon className="h-5 w-5" />
//       </div>
//     </div>
//     {trend && (
//       <div className="flex items-center gap-1 mt-4 text-xs font-medium">
//         <TrendingUp className="h-3 w-3 text-green-500" />
//         <span className="text-green-600">{trend}</span>
//         <span className="text-gray-400 ml-1">vs last month</span>
//       </div>
//     )}
//   </div>
// );

// // Status Badge Component
// const StatusBadge = ({ status }) => {
//   const config = {
//     pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'Pending' },
//     confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Package, label: 'Confirmed' },
//     shipped: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Truck, label: 'Shipped' },
//     delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, label: 'Delivered' },
//     cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle, label: 'Cancelled' }
//   };
//   const { bg, text, border, icon: Icon, label } = config[status] || config.pending;
  
//   return (
//     <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}>
//       <Icon className="h-3 w-3" />
//       <span>{label}</span>
//     </div>
//   );
// };

// // Order Card Component
// const OrderCard = ({ order, onStatusUpdate, expanded, onToggleExpand }) => {
//   const [updating, setUpdating] = useState(false);

//   const handleStatusChange = async (newStatus) => {
//     setUpdating(true);
//     await onStatusUpdate(order._id, newStatus);
//     setUpdating(false);
//   };

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
//       {/* Header */}
//       <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
//         <div className="flex flex-wrap justify-between items-center gap-3">
//           <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
//               <p className="font-mono text-sm font-semibold text-gray-800">#{order._id?.slice(-8)}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
//               <p className="text-sm font-medium text-gray-700">
//                 {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
//               <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
//                 <User className="h-3 w-3 text-gray-400" />
//                 {order.user?.name}
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <div className="text-right">
//               <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
//               <p className="text-lg font-bold text-gray-800">₹{order.totalAmount?.toLocaleString()}</p>
//             </div>
//             <StatusBadge status={order.orderStatus} />
//             <button
//               onClick={onToggleExpand}
//               className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               {expanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Expanded Details */}
//       {expanded && (
//         <div className="px-5 py-4 border-b border-gray-100 bg-white">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Products */}
//             <div>
//               <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm">
//                 <Package className="h-4 w-4 mr-2 text-gray-500" />
//                 Order Items
//               </h4>
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {order.products?.map((item, index) => (
//                   <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-800 text-sm break-words">{item.product?.name}</p>
//                       <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
//                     </div>
//                     <p className="font-semibold text-gray-800 text-sm ml-3">₹{item.price * item.quantity}</p>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
//                 <span className="font-semibold text-gray-800">Subtotal</span>
//                 <span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
//               </div>
//             </div>
            
//             {/* Shipping & Contact */}
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm">
//                   <Truck className="h-4 w-4 mr-2 text-gray-500" />
//                   Shipping Address
//                 </h4>
//                 <div className="bg-gray-50 rounded-xl p-3">
//                   <p className="text-sm text-gray-700 break-words">{order.shippingAddress?.street}</p>
//                   <p className="text-sm text-gray-700">
//                     {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
//                   </p>
//                   <p className="text-sm text-gray-700">{order.shippingAddress?.country}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm">
//                   <User className="h-4 w-4 mr-2 text-gray-500" />
//                   Contact Information
//                 </h4>
//                 <div className="bg-gray-50 rounded-xl p-3 space-y-1">
//                   <p className="text-sm text-gray-700 flex items-center gap-2">
//                     <Mail className="h-3.5 w-3.5 text-gray-400" />
//                     {order.user?.email}
//                   </p>
//                   <p className="text-sm text-gray-700 flex items-center gap-2">
//                     <Phone className="h-3.5 w-3.5 text-gray-400" />
//                     {order.user?.phone || 'N/A'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Actions */}
//       <div className="px-5 py-3 bg-gray-50 flex flex-wrap justify-end gap-2">
//         {order.orderStatus === 'pending' && (
//           <>
//             <button
//               onClick={() => handleStatusChange('confirmed')}
//               disabled={updating}
//               className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
//             >
//               {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Package className="h-3.5 w-3.5" />}
//               Confirm Order
//             </button>
//             <button
//               onClick={() => handleStatusChange('cancelled')}
//               disabled={updating}
//               className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
//             >
//               Cancel Order
//             </button>
//           </>
//         )}
//         {order.orderStatus === 'confirmed' && (
//           <button
//             onClick={() => handleStatusChange('shipped')}
//             disabled={updating}
//             className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
//           >
//             {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Truck className="h-3.5 w-3.5" />}
//             Mark as Shipped
//           </button>
//         )}
//         {order.orderStatus === 'shipped' && (
//           <button
//             onClick={() => handleStatusChange('delivered')}
//             disabled={updating}
//             className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
//           >
//             {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
//             Mark as Delivered
//           </button>
//         )}
//         <button className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-1.5">
//           <Eye className="h-3.5 w-3.5" />
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const AdminOrders = () => {
//   const dispatch = useDispatch();
//   const { orders, loading } = useSelector((state) => state.orders);
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedOrders, setExpandedOrders] = useState(new Set());
//   const [showFilters, setShowFilters] = useState(false);
  
//   useEffect(() => {
//     dispatch(fetchAllOrders());
//   }, [dispatch]);
  
//   const stats = {
//     total: orders?.length || 0,
//     revenue: orders?.reduce((sum, o) => sum + o.totalAmount, 0) || 0,
//     pending: orders?.filter(o => o.orderStatus === 'pending').length || 0,
//     delivered: orders?.filter(o => o.orderStatus === 'delivered').length || 0
//   };
  
//   const filteredOrders = orders?.filter(order => {
//     if (filter !== 'all' && order.orderStatus !== filter) return false;
//     if (searchTerm) {
//       const search = searchTerm.toLowerCase();
//       return order._id?.toLowerCase().includes(search) ||
//              order.user?.name?.toLowerCase().includes(search) ||
//              order.user?.email?.toLowerCase().includes(search);
//     }
//     return true;
//   });
  
//   const handleStatusUpdate = async (id, status) => {
//     const result = await dispatch(updateOrderStatus({ id, status }));
//     if (updateOrderStatus.fulfilled.match(result)) {
//       toast.success(`Order ${status} successfully`);
//     } else {
//       toast.error('Failed to update order status');
//     }
//   };
  
//   const toggleExpand = (id) => {
//     const newSet = new Set(expandedOrders);
//     if (newSet.has(id)) newSet.delete(id);
//     else newSet.add(id);
//     setExpandedOrders(newSet);
//   };
  
//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilter('all');
//   };
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
//         <div className="px-4 sm:px-6 lg:px-8 py-5">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//                 Order Management
//               </h1>
//               <p className="text-sm text-gray-500 mt-1">Track, manage, and update customer orders</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="px-4 sm:px-6 lg:px-8 py-6">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <StatCard title="Total Orders" value={stats.total} icon={ShoppingBag} color={{ bg: 'bg-gray-100', text: 'text-gray-700' }} trend="+12%" />
//           <StatCard title="Revenue" value={`₹${(stats.revenue / 1000).toFixed(0)}K`} icon={DollarSign} color={{ bg: 'bg-emerald-100', text: 'text-emerald-700' }} trend="+8%" />
//           <StatCard title="Pending" value={stats.pending} icon={Clock} color={{ bg: 'bg-amber-100', text: 'text-amber-700' }} />
//           <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} color={{ bg: 'bg-emerald-100', text: 'text-emerald-700' }} />
//         </div>
        
//         {/* Filters */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
//           <div className="p-5">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by order ID or customer..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
//                 />
//               </div>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
//               >
//                 <Filter className="h-4 w-4" />
//                 <span>Filters</span>
//                 {filter !== 'all' && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
//               </button>
//             </div>
            
//             {showFilters && (
//               <div className="mt-4 pt-4 border-t border-gray-100">
//                 <div className="flex flex-wrap gap-2">
//                   {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
//                     <button
//                       key={status}
//                       onClick={() => setFilter(status)}
//                       className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
//                         filter === status
//                           ? 'bg-gray-900 text-white'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       }`}
//                     >
//                       {status}
//                       <span className="ml-1 text-xs opacity-70">
//                         ({orders?.filter(o => o.orderStatus === status).length || 0})
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//                 {(searchTerm || filter !== 'all') && (
//                   <button onClick={clearFilters} className="mt-3 text-sm text-gray-500 hover:text-gray-700">
//                     Clear filters
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Orders List */}
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
//           </div>
//         ) : filteredOrders?.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
//             <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-800 mb-1">No orders found</h3>
//             <p className="text-gray-500">No orders match your current filters</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredOrders?.map((order) => (
//               <OrderCard
//                 key={order._id}
//                 order={order}
//                 onStatusUpdate={handleStatusUpdate}
//                 expanded={expandedOrders.has(order._id)}
//                 onToggleExpand={() => toggleExpand(order._id)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus, cancelOrder } from '../../features/orders/orderSlice';
import { 
  Package, Clock, CheckCircle, Truck, XCircle, Eye, Filter,
  TrendingUp, DollarSign, ShoppingBag, ChevronDown, ChevronUp,
  Search, User, MapPin, Phone, Mail, Calendar as CalendarIcon,
  Loader2, AlertCircle, ArrowUpDown, RefreshCw, Warehouse
} from 'lucide-react';
import toast from 'react-hot-toast';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md hover:border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color.bg} ${color.text} transition-transform group-hover:scale-105`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-1 mt-4 text-xs font-medium">
        <TrendingUp className="h-3 w-3 text-green-500" />
        <span className="text-green-600">{trend}</span>
        <span className="text-gray-400 ml-1">vs last month</span>
      </div>
    )}
  </div>
);

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
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}>
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ order, onStatusUpdate, onCancelOrder, expanded, onToggleExpand }) => {
  const [updating, setUpdating] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await onStatusUpdate(order._id, newStatus);
    setUpdating(false);
  };

  const handleCancelOrder = async () => {
    setUpdating(true);
    await onCancelOrder(order._id);
    setShowCancelConfirm(false);
    setUpdating(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
              <p className="font-mono text-sm font-semibold text-gray-800">#{order._id?.slice(-8)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <User className="h-3 w-3 text-gray-400" />
                {order.user?.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
              <p className="text-lg font-bold text-gray-800">₹{order.totalAmount?.toLocaleString()}</p>
            </div>
            <StatusBadge status={order.orderStatus} />
            <button
              onClick={onToggleExpand}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Expanded Details */}
      {expanded && (
        <div className="px-5 py-4 border-b border-gray-100 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Products */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm">
                <Package className="h-4 w-4 mr-2 text-gray-500" />
                Order Items
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {order.products?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm break-words">{item.product?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm ml-3">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                <span className="font-semibold text-gray-800">Subtotal</span>
                <span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Shipping & Contact */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm">
                  <Truck className="h-4 w-4 mr-2 text-gray-500" />
                  Shipping Address
                </h4>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm text-gray-700 break-words">{order.shippingAddress?.street}</p>
                  <p className="text-sm text-gray-700">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                  </p>
                  <p className="text-sm text-gray-700">{order.shippingAddress?.country}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  Contact Information
                </h4>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    {order.user?.email}
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {order.user?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="px-5 py-3 bg-gray-50 flex flex-wrap justify-end gap-2">
        {order.orderStatus === 'pending' && (
          <>
            <button
              onClick={() => handleStatusChange('confirmed')}
              disabled={updating}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
            >
              {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Package className="h-3.5 w-3.5" />}
              Confirm Order (Reduce Stock)
            </button>
            {showCancelConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelOrder}
                  disabled={updating}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Confirm Cancel
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-white"
                >
                  Back
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={updating}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
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
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
            >
              {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Truck className="h-3.5 w-3.5" />}
              Mark as Shipped
            </button>
            {showCancelConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelOrder}
                  disabled={updating}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Confirm Cancel (Restore Stock)
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-white"
                >
                  Back
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={updating}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Cancel Order (Restore Stock)
              </button>
            )}
          </>
        )}
        {order.orderStatus === 'shipped' && (
          <>
            <button
              onClick={() => handleStatusChange('delivered')}
              disabled={updating}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
            >
              {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
              Mark as Delivered
            </button>
            <button
              onClick={() => handleStatusChange('cancelled')}
              disabled={updating}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Cancel Order (Restore Stock)
            </button>
          </>
        )}
        <button className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          View Details
        </button>
      </div>
      
      {/* Stock Update Info */}
      {order.orderStatus === 'confirmed' && (
        <div className="px-5 py-2 bg-blue-50 border-t border-blue-100 text-xs text-blue-700 flex items-center gap-2">
          <Warehouse className="h-3 w-3" />
          Stock has been reduced for this order
        </div>
      )}
      {order.orderStatus === 'cancelled' && order.products && (
        <div className="px-5 py-2 bg-orange-50 border-t border-orange-100 text-xs text-orange-700 flex items-center gap-2">
          <RefreshCw className="h-3 w-3" />
          Stock has been restored for cancelled items
        </div>
      )}
    </div>
  );
};

// Main Component
const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, stockUpdateInProgress } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
  
  const stats = {
    total: orders?.length || 0,
    revenue: orders?.reduce((sum, o) => sum + o.totalAmount, 0) || 0,
    pending: orders?.filter(o => o.orderStatus === 'pending').length || 0,
    delivered: orders?.filter(o => o.orderStatus === 'delivered').length || 0
  };
  
  const filteredOrders = orders?.filter(order => {
    if (filter !== 'all' && order.orderStatus !== filter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return order._id?.toLowerCase().includes(search) ||
             order.user?.name?.toLowerCase().includes(search) ||
             order.user?.email?.toLowerCase().includes(search);
    }
    return true;
  });
  
  const handleStatusUpdate = async (id, status) => {
    const result = await dispatch(updateOrderStatus({ id, status }));
    if (updateOrderStatus.fulfilled.match(result)) {
      toast.success(`Order ${status} successfully! Stock has been updated.`);
      // Refresh orders to get updated stock info
      dispatch(fetchAllOrders());
    } else {
      toast.error(result.payload || 'Failed to update order status');
    }
  };
  
  const handleCancelOrder = async (id) => {
    const result = await dispatch(cancelOrder(id));
    if (cancelOrder.fulfilled.match(result)) {
      toast.success('Order cancelled successfully! Stock has been restored.');
      dispatch(fetchAllOrders());
    } else {
      toast.error(result.payload || 'Failed to cancel order');
    }
  };
  
  const toggleExpand = (id) => {
    const newSet = new Set(expandedOrders);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedOrders(newSet);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Order Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">Track, manage, and update customer orders with automatic stock management</p>
            </div>
            {stockUpdateInProgress && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating stock...
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Orders" value={stats.total} icon={ShoppingBag} color={{ bg: 'bg-gray-100', text: 'text-gray-700' }} trend="+12%" />
          <StatCard title="Revenue" value={`₹${(stats.revenue / 1000).toFixed(0)}K`} icon={DollarSign} color={{ bg: 'bg-emerald-100', text: 'text-emerald-700' }} trend="+8%" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color={{ bg: 'bg-amber-100', text: 'text-amber-700' }} />
          <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} color={{ bg: 'bg-emerald-100', text: 'text-emerald-700' }} />
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {filter !== 'all' && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                        filter === status
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                      <span className="ml-1 text-xs opacity-70">
                        ({orders?.filter(o => o.orderStatus === status).length || 0})
                      </span>
                    </button>
                  ))}
                </div>
                {(searchTerm || filter !== 'all') && (
                  <button onClick={clearFilters} className="mt-3 text-sm text-gray-500 hover:text-gray-700">
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredOrders?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No orders found</h3>
            <p className="text-gray-500">No orders match your current filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders?.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                onCancelOrder={handleCancelOrder}
                expanded={expandedOrders.has(order._id)}
                onToggleExpand={() => toggleExpand(order._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;