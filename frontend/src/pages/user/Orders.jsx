// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { fetchMyOrders } from '../../features/orders/orderSlice';
// import { 
//   Package, 
//   ShoppingBag, 
//   Clock, 
//   CheckCircle, 
//   Truck, 
//   TrendingUp,
//   Search,
//   ChevronRight,
//   AlertCircle,
//   Filter,
//   X,
//   RotateCcw,
//   Eye,
//   Ban,
//   MessageCircle,
//   Star
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// const Orders = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { orders, loading } = useSelector((state) => state.orders);
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [cancellingOrder, setCancellingOrder] = useState(null);
  
//   useEffect(() => {
//     dispatch(fetchMyOrders());
//   }, [dispatch]);
  
//   // Refresh orders every 30 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       dispatch(fetchMyOrders());
//     }, 30000);
//     return () => clearInterval(interval);
//   }, [dispatch]);
  
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date not available';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Date not available';
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (error) {
//       return 'Date not available';
//     }
//   };
  
//   const totalOrders = orders?.length || 0;
//   const deliveredOrders = orders?.filter(order => order?.orderStatus === 'delivered').length || 0;
//   const pendingOrders = orders?.filter(order => ['pending', 'confirmed', 'processing', 'shipped'].includes(order?.orderStatus)).length || 0;
//   const cancelledOrders = orders?.filter(order => order?.orderStatus === 'cancelled').length || 0;
  
//   const totalSpent = orders?.reduce((sum, order) => {
//     if (order?.orderStatus === 'delivered' && order?.totalAmount) {
//       return sum + order.totalAmount;
//     }
//     return sum;
//   }, 0) || 0;
  
//   const filteredOrders = orders?.filter(order => {
//     if (!order) return false;
//     const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
//     const matchesSearch = searchTerm === '' || 
//       order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.products?.some(p => p?.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
//     return matchesStatus && matchesSearch;
//   });
  
//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterStatus('all');
//     toast.success('Filters cleared');
//   };
  
//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (searchTerm) count++;
//     if (filterStatus !== 'all') count++;
//     return count;
//   };
  
//   // Check if order can be cancelled (within 48 hours and not shipped/delivered)
//   const canCancelOrder = (order) => {
//     if (!order) return false;
//     if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
//       return false;
//     }
//     const orderDate = new Date(order.orderDate || order.createdAt);
//     const currentDate = new Date();
//     const hoursDifference = (currentDate - orderDate) / (1000 * 60 * 60);
//     return hoursDifference <= 48;
//   };
  
//   const handleCancelOrder = async (order) => {
//     if (!canCancelOrder(order)) {
//       toast.error('Order cannot be cancelled at this time');
//       return;
//     }
    
//     setCancellingOrder(order._id);
    
//     // Simulate API call - Replace with actual API call
//     setTimeout(() => {
//       toast.success(`Order #${order._id.slice(-8)} has been cancelled`);
//       dispatch(fetchMyOrders()); // Refresh orders
//       setCancellingOrder(null);
//     }, 1000);
//   };
  
//   const handleReorder = (order) => {
//     // Add all items from order to cart
//     order.products?.forEach(item => {
//       const product = item.product || item;
//       // Dispatch add to cart action here
//       console.log('Reordering:', product);
//     });
//     toast.success('Items added to cart');
//     navigate('/cart');
//   };
  
//   const handleWriteReview = (order) => {
//     navigate('/feedback', { state: { orderId: order._id } });
//   };
  
//   const handleTrackOrder = (order) => {
//     navigate(`/orders/${order._id}`);
//   };
  
//   const getStatusConfig = (orderStatus) => {
//     const configs = {
//       pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending', icon: Clock, color: '#f59e0b' },
//       confirmed: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Confirmed', icon: CheckCircle, color: '#6366f1' },
//       processing: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', label: 'Processing', icon: Package, color: '#8b5cf6' },
//       shipped: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'Shipped', icon: Truck, color: '#3b82f6' },
//       delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Delivered', icon: CheckCircle, color: '#10b981' },
//       cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Cancelled', icon: AlertCircle, color: '#ef4444' }
//     };
//     return configs[orderStatus] || configs.pending;
//   };
  
//   const OrderCard = ({ order }) => {
//     const isExpanded = expandedOrder === order._id;
//     const statusConfig = getStatusConfig(order?.orderStatus);
//     const StatusIcon = statusConfig.icon;
//     const cancellable = canCancelOrder(order);
    
//     const orderTotal = order?.totalAmount || 
//       order?.products?.reduce((sum, p) => sum + ((p?.price || 0) * (p?.quantity || 0)), 0) || 0;
    
//     const getProductName = (item) => {
//       return item?.product?.name || item?.name || 'Product';
//     };
    
//     const getProductImage = (item) => {
//       return item?.product?.images?.[0] || item?.image || '/api/placeholder/50/50';
//     };
    
//     return (
//       <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
//         {/* Order Header */}
//         <div className="p-5 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-100">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <div className="flex flex-wrap items-center gap-4">
//               <div>
//                 <p className="text-xs text-slate-500 font-medium">ORDER ID</p>
//                 <p className="text-sm font-semibold text-slate-800 font-mono">
//                   #{order?._id?.slice(-8)?.toUpperCase() || 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 font-medium">PLACED ON</p>
//                 <p className="text-sm font-medium text-slate-700">
//                   {formatDate(order?.orderDate || order?.createdAt)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 font-medium">TOTAL AMOUNT</p>
//                 <p className="text-lg font-bold text-indigo-600">₹{orderTotal.toLocaleString()}</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
//                 <StatusIcon className="w-3.5 h-3.5" />
//                 <span className="text-xs font-semibold">{statusConfig.label}</span>
//               </div>
//               <button
//                 onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
//                 className="p-2 hover:bg-white rounded-lg transition-colors"
//               >
//                 {isExpanded ? '▲' : '▼'}
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Order Items Preview */}
//         <div className="p-5">
//           <div className="flex flex-wrap gap-4">
//             {order?.products?.slice(0, 3).map((item, idx) => (
//               <div key={idx} className="flex items-center gap-3">
//                 <img
//                   src={getProductImage(item)}
//                   alt={getProductName(item)}
//                   className="w-12 h-12 object-cover rounded-lg bg-slate-100"
//                   onError={(e) => { e.target.src = '/api/placeholder/50/50'; }}
//                 />
//                 <div>
//                   <p className="text-sm font-medium text-slate-800">{getProductName(item)}</p>
//                   <p className="text-xs text-slate-500">Qty: {item?.quantity || 0}</p>
//                 </div>
//               </div>
//             ))}
//             {(order?.products?.length || 0) > 3 && (
//               <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-lg">
//                 <span className="text-xs font-semibold text-slate-600">+{order.products.length - 3}</span>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Expanded Details */}
//         {isExpanded && (
//           <div className="border-t border-slate-100 bg-slate-50 p-5">
//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Shipping Address */}
//               <div>
//                 <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
//                   📍 Shipping Address
//                 </h4>
//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
//                   {order?.shippingAddress ? (
//                     <>
//                       <p className="text-sm text-slate-700">{order.shippingAddress.street || 'N/A'}</p>
//                       <p className="text-sm text-slate-700">
//                         {order.shippingAddress.city || 'N/A'}, {order.shippingAddress.state || 'N/A'} - {order.shippingAddress.pincode || 'N/A'}
//                       </p>
//                       <p className="text-sm text-slate-700">{order.shippingAddress.country || 'India'}</p>
//                     </>
//                   ) : (
//                     <p className="text-sm text-slate-500">No address available</p>
//                   )}
//                 </div>
//               </div>
              
//               {/* Order Timeline */}
//               <div>
//                 <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
//                   📅 Order Timeline
//                 </h4>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
//                       <CheckCircle className="w-4 h-4 text-emerald-600" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-slate-800">Order Placed</p>
//                       <p className="text-xs text-slate-500">{formatDate(order?.orderDate || order?.createdAt)}</p>
//                     </div>
//                   </div>
//                   {order?.orderStatus !== 'pending' && order?.orderStatus !== 'cancelled' && (
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
//                         <Package className="w-4 h-4 text-indigo-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-800">
//                           {order?.orderStatus === 'confirmed' ? 'Confirmed' : 
//                            order?.orderStatus === 'processing' ? 'Processing' : 
//                            order?.orderStatus === 'shipped' ? 'Shipped' : 'Updated'}
//                         </p>
//                         <p className="text-xs text-slate-500">{formatDate(order?.updatedAt)}</p>
//                       </div>
//                     </div>
//                   )}
//                   {order?.orderStatus === 'delivered' && (
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
//                         <Truck className="w-4 h-4 text-emerald-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-800">Delivered</p>
//                         <p className="text-xs text-slate-500">{formatDate(order?.deliveredAt || order?.updatedAt)}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             {/* Items List */}
//             {order?.products && order.products.length > 0 && (
//               <div className="mt-6">
//                 <h4 className="text-sm font-semibold text-slate-800 mb-3">Order Items</h4>
//                 <div className="space-y-2">
//                   {order.products.map((item, idx) => (
//                     <div key={idx} className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm border border-slate-100">
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={getProductImage(item)}
//                           alt={getProductName(item)}
//                           className="w-10 h-10 object-cover rounded-lg"
//                           onError={(e) => { e.target.src = '/api/placeholder/50/50'; }}
//                         />
//                         <div>
//                           <p className="text-sm font-medium text-slate-800">{getProductName(item)}</p>
//                           <p className="text-xs text-slate-500">Quantity: {item?.quantity || 0}</p>
//                         </div>
//                       </div>
//                       <p className="text-sm font-semibold text-slate-800">
//                         ₹{((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             {/* Action Buttons - Invoice and Print removed */}
//             <div className="mt-6 flex flex-wrap gap-3 justify-end">
//               {/* Cancel Order Button */}
//               {order?.orderStatus !== 'delivered' && order?.orderStatus !== 'cancelled' && (
//                 <button
//                   onClick={() => handleCancelOrder(order)}
//                   disabled={cancellingOrder === order._id || !cancellable}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
//                     cancellable 
//                       ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm' 
//                       : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   {cancellingOrder === order._id ? (
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   ) : (
//                     <Ban className="w-4 h-4" />
//                   )}
//                   {cancellable ? 'Cancel Order' : 'Cannot Cancel'}
//                 </button>
//               )}
              
//               {/* Track Order Button */}
//               <button
//                 onClick={() => handleTrackOrder(order)}
//                 className="px-4 py-2 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
//               >
//                 <Truck className="w-4 h-4" />
//                 Track Order
//               </button>
              
//               {/* Reorder Button */}
//               {order?.orderStatus === 'delivered' && (
//                 <button
//                   onClick={() => handleReorder(order)}
//                   className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
//                 >
//                   <RotateCcw className="w-4 h-4" />
//                   Reorder
//                 </button>
//               )}
              
//               {/* Write Review Button */}
//               {order?.orderStatus === 'delivered' && (
//                 <button
//                   onClick={() => handleWriteReview(order)}
//                   className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
//                 >
//                   <Star className="w-4 h-4" />
//                   Write Review
//                 </button>
//               )}
              
//               {/* Need Help Button */}
//               <Link
//                 to="/contact"
//                 className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
//               >
//                 <MessageCircle className="w-4 h-4" />
//                 Need Help?
//               </Link>
//             </div>
            
//             {/* Cancellation Info */}
//             {cancellable && order?.orderStatus !== 'cancelled' && (
//               <div className="mt-3 p-2 bg-amber-50 rounded-lg text-center">
//                 <p className="text-xs text-amber-700">
//                   ⏰ You can cancel this order within 48 hours of placement
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };
  
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
//           <p className="mt-4 text-slate-500 font-light tracking-widest uppercase text-xs">Loading Orders</p>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">
//       {/* Hero Section */}
//       <div className="bg-slate-900 pt-20 pb-32 relative overflow-hidden">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20">
//           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[70%] bg-indigo-500 rounded-full blur-[120px]" />
//           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[70%] bg-emerald-500 rounded-full blur-[120px]" />
//         </div>
        
//         <div className="relative container mx-auto px-4 text-center">
//           <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
//             Order History
//           </span>
//           <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
//             My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Orders</span>
//           </h1>
//           <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
//             Track and manage all your orders in one place
//           </p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
//         {/* Stats Cards */}
//         {totalOrders > 0 && (
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-500 text-sm font-medium">Total Orders</p>
//                   <p className="text-3xl font-bold text-slate-800 mt-1">{totalOrders}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <ShoppingBag className="w-6 h-6 text-indigo-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-500 text-sm font-medium">Delivered</p>
//                   <p className="text-3xl font-bold text-emerald-600 mt-1">{deliveredOrders}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <CheckCircle className="w-6 h-6 text-emerald-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-500 text-sm font-medium">In Progress</p>
//                   <p className="text-3xl font-bold text-amber-600 mt-1">{pendingOrders}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Clock className="w-6 h-6 text-amber-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-lg p-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-indigo-200 text-sm font-medium">Total Spent</p>
//                   <p className="text-2xl font-bold text-white mt-1">₹{totalSpent.toLocaleString()}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <TrendingUp className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Search and Filter Bar */}
//         {totalOrders > 0 && (
//           <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 p-2 md:p-3 mb-8 border border-slate-100">
//             <div className="flex flex-col lg:flex-row gap-2">
//               <div className="relative flex-grow">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by order ID or product name..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
//                 />
//               </div>

//               <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
//                 <button
//                   onClick={() => setIsFilterOpen(true)}
//                   className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shrink-0"
//                 >
//                   <Filter className="h-4 w-4" />
//                   <span className="text-sm font-semibold">Filters</span>
//                   {getActiveFiltersCount() > 0 && (
//                     <span className="ml-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
//                       {getActiveFiltersCount()}
//                     </span>
//                   )}
//                 </button>

//                 <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
//                   {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
//                     <button
//                       key={status}
//                       onClick={() => setFilterStatus(status)}
//                       className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
//                         filterStatus === status 
//                           ? 'bg-white shadow-sm text-indigo-600' 
//                           : 'text-slate-600 hover:text-indigo-600'
//                       }`}
//                     >
//                       {status === 'all' ? 'All' : status}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Orders List */}
//         {!filteredOrders || filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-100">
//             <div className="max-w-md mx-auto">
//               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 {searchTerm || filterStatus !== 'all' ? (
//                   <Search className="w-10 h-10 text-slate-400" />
//                 ) : (
//                   <ShoppingBag className="w-10 h-10 text-slate-400" />
//                 )}
//               </div>
//               <h3 className="text-xl font-bold text-slate-800 mb-2">
//                 {searchTerm || filterStatus !== 'all' ? 'No matching orders' : 'No orders yet'}
//               </h3>
//               <p className="text-slate-500 mb-6 text-sm">
//                 {searchTerm || filterStatus !== 'all' 
//                   ? 'Try adjusting your search or filter criteria' 
//                   : 'Looks like you haven\'t placed any orders. Start shopping to see your orders here!'}
//               </p>
//               {(searchTerm || filterStatus !== 'all') ? (
//                 <button
//                   onClick={clearFilters}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
//                 >
//                   <RotateCcw className="w-4 h-4" />
//                   Clear Filters
//                 </button>
//               ) : (
//                 <Link 
//                   to="/products" 
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md"
//                 >
//                   <ShoppingBag className="w-4 h-4" />
//                   Start Shopping
//                 </Link>
//               )}
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="mb-4 flex justify-between items-center">
//               <p className="text-sm text-slate-500">
//                 Showing <span className="font-semibold text-slate-700">{filteredOrders.length}</span> of{' '}
//                 <span className="font-semibold text-slate-700">{orders?.length || 0}</span> orders
//               </p>
//               {(searchTerm || filterStatus !== 'all') && (
//                 <button
//                   onClick={clearFilters}
//                   className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
//                 >
//                   <RotateCcw className="w-3 h-3" />
//                   Clear Filters
//                 </button>
//               )}
//             </div>
            
//             <div className="space-y-5">
//               {filteredOrders.map((order) => (
//                 <OrderCard key={order._id} order={order} />
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Filter Panel */}
//       {isFilterOpen && (
//         <div className="fixed inset-0 z-[100] flex justify-end">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsFilterOpen(false)} />
//           <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
//             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//               <h3 className="text-xl font-bold text-slate-900">Filter Orders</h3>
//               <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-all">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 space-y-8">
//               <div>
//                 <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">Order Status</label>
//                 <div className="space-y-2">
//                   {[
//                     { id: 'all', label: 'All Orders', icon: ShoppingBag },
//                     { id: 'pending', label: 'Pending', icon: Clock },
//                     { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
//                     { id: 'processing', label: 'Processing', icon: Package },
//                     { id: 'shipped', label: 'Shipped', icon: Truck },
//                     { id: 'delivered', label: 'Delivered', icon: CheckCircle },
//                     { id: 'cancelled', label: 'Cancelled', icon: AlertCircle }
//                   ].map(option => {
//                     const Icon = option.icon;
//                     return (
//                       <button
//                         key={option.id}
//                         onClick={() => {
//                           setFilterStatus(option.id);
//                           setIsFilterOpen(false);
//                         }}
//                         className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
//                           filterStatus === option.id
//                             ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
//                             : 'hover:bg-slate-50 text-slate-600'
//                         }`}
//                       >
//                         <Icon className="h-5 w-5" />
//                         <span className="font-medium">{option.label}</span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
//               <button 
//                 onClick={clearFilters}
//                 className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all rounded-xl"
//               >
//                 Clear All
//               </button>
//               <button 
//                 onClick={() => setIsFilterOpen(false)}
//                 className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .animate-slide-left {
//           animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//         }
//         @keyframes slideLeft {
//           from { transform: translateX(100%); }
//           to { transform: translateX(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Orders;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyOrders, cancelOrder } from '../../features/orders/orderSlice';
import { 
  Package, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Truck, 
  TrendingUp,
  Search,
  ChevronRight,
  AlertCircle,
  Filter,
  X,
  RotateCcw,
  Eye,
  Ban,
  MessageCircle,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, stockUpdateInProgress } = useSelector((state) => state.orders);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);
  
  // Refresh orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchMyOrders());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date not available';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  };
  
  const totalOrders = orders?.length || 0;
  const deliveredOrders = orders?.filter(order => order?.orderStatus === 'delivered').length || 0;
  const pendingOrders = orders?.filter(order => ['pending', 'confirmed', 'processing', 'shipped'].includes(order?.orderStatus)).length || 0;
  const cancelledOrders = orders?.filter(order => order?.orderStatus === 'cancelled').length || 0;
  
  const totalSpent = orders?.reduce((sum, order) => {
    if (order?.orderStatus === 'delivered' && order?.totalAmount) {
      return sum + order.totalAmount;
    }
    return sum;
  }, 0) || 0;
  
  const filteredOrders = orders?.filter(order => {
    if (!order) return false;
    const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
    const matchesSearch = searchTerm === '' || 
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products?.some(p => p?.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    toast.success('Filters cleared');
  };
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filterStatus !== 'all') count++;
    return count;
  };
  
  // User can only cancel if order is 'pending'
  const canCancelOrder = (order) => {
    if (!order) return false;
    // User can ONLY cancel if status is 'pending'
    if (order.orderStatus !== 'pending') {
      return false;
    }
    // Optional: Check 48-hour window
    const orderDate = new Date(order.orderDate || order.createdAt);
    const currentDate = new Date();
    const hoursDifference = (currentDate - orderDate) / (1000 * 60 * 60);
    return hoursDifference <= 48;
  };
  
  // Handle cancel order with actual API call
  const handleCancelOrder = async (order) => {
    // Check if order can be cancelled
    if (!canCancelOrder(order)) {
      if (order.orderStatus === 'confirmed') {
        toast.error('Order cannot be cancelled after confirmation. Please contact support.');
      } else if (order.orderStatus === 'shipped') {
        toast.error('Order has already been shipped and cannot be cancelled.');
      } else if (order.orderStatus === 'delivered') {
        toast.error('Order has already been delivered and cannot be cancelled.');
      } else if (order.orderStatus === 'cancelled') {
        toast.error('Order is already cancelled.');
      } else {
        toast.error('Order cannot be cancelled at this time.');
      }
      return;
    }
    
    // Show confirmation dialog
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel order #${order._id.slice(-8)}?\n\n` +
      `Order Amount: ₹${order.totalAmount?.toLocaleString()}\n\n` +
      `Note: Order can only be cancelled while it's pending.\n` +
      `This action cannot be undone.`
    );
    
    if (!confirmCancel) return;
    
    setCancellingOrder(order._id);
    
    try {
      // Call the actual cancelOrder API through Redux
      const result = await dispatch(cancelOrder(order._id)).unwrap();
      
      if (result) {
        toast.success(`Order #${order._id.slice(-8)} has been cancelled successfully!`);
        // Refresh orders to get updated list
        await dispatch(fetchMyOrders());
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error(error || 'Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrder(null);
    }
  };
  
  const handleReorder = (order) => {
    // Add all items from order to cart
    order.products?.forEach(item => {
      const product = item.product || item;
      // Dispatch add to cart action here
      console.log('Reordering:', product);
    });
    toast.success('Items added to cart');
    navigate('/cart');
  };
  
  const handleWriteReview = (order) => {
    navigate('/feedback', { state: { orderId: order._id } });
  };
  
  const handleTrackOrder = (order) => {
    navigate(`/orders/${order._id}`);
  };
  
  const getStatusConfig = (orderStatus) => {
    const configs = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending', icon: Clock, color: '#f59e0b' },
      confirmed: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Confirmed', icon: CheckCircle, color: '#6366f1' },
      processing: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', label: 'Processing', icon: Package, color: '#8b5cf6' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'Shipped', icon: Truck, color: '#3b82f6' },
      delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Delivered', icon: CheckCircle, color: '#10b981' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Cancelled', icon: AlertCircle, color: '#ef4444' }
    };
    return configs[orderStatus] || configs.pending;
  };
  
  const OrderCard = ({ order }) => {
    const isExpanded = expandedOrder === order._id;
    const statusConfig = getStatusConfig(order?.orderStatus);
    const StatusIcon = statusConfig.icon;
    const cancellable = canCancelOrder(order);
    
    const orderTotal = order?.totalAmount || 
      order?.products?.reduce((sum, p) => sum + ((p?.price || 0) * (p?.quantity || 0)), 0) || 0;
    
    const getProductName = (item) => {
      return item?.product?.name || item?.name || 'Product';
    };
    
    const getProductImage = (item) => {
      return item?.product?.images?.[0] || item?.image || '/api/placeholder/50/50';
    };
    
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
        {/* Order Header */}
        <div className="p-5 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">ORDER ID</p>
                <p className="text-sm font-semibold text-slate-800 font-mono">
                  #{order?._id?.slice(-8)?.toUpperCase() || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">PLACED ON</p>
                <p className="text-sm font-medium text-slate-700">
                  {formatDate(order?.orderDate || order?.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">TOTAL AMOUNT</p>
                <p className="text-lg font-bold text-indigo-600">₹{orderTotal.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{statusConfig.label}</span>
              </div>
              <button
                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                {isExpanded ? '▲' : '▼'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Items Preview */}
        <div className="p-5">
          <div className="flex flex-wrap gap-4">
            {order?.products?.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img
                  src={getProductImage(item)}
                  alt={getProductName(item)}
                  className="w-12 h-12 object-cover rounded-lg bg-slate-100"
                  onError={(e) => { e.target.src = '/api/placeholder/50/50'; }}
                />
                <div>
                  <p className="text-sm font-medium text-slate-800">{getProductName(item)}</p>
                  <p className="text-xs text-slate-500">Qty: {item?.quantity || 0}</p>
                </div>
              </div>
            ))}
            {(order?.products?.length || 0) > 3 && (
              <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-lg">
                <span className="text-xs font-semibold text-slate-600">+{order.products.length - 3}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-slate-100 bg-slate-50 p-5">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  📍 Shipping Address
                </h4>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  {order?.shippingAddress ? (
                    <>
                      <p className="text-sm text-slate-700">{order.shippingAddress.street || 'N/A'}</p>
                      <p className="text-sm text-slate-700">
                        {order.shippingAddress.city || 'N/A'}, {order.shippingAddress.state || 'N/A'} - {order.shippingAddress.pincode || 'N/A'}
                      </p>
                      <p className="text-sm text-slate-700">{order.shippingAddress.country || 'India'}</p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">No address available</p>
                  )}
                </div>
              </div>
              
              {/* Order Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  📅 Order Timeline
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Order Placed</p>
                      <p className="text-xs text-slate-500">{formatDate(order?.orderDate || order?.createdAt)}</p>
                    </div>
                  </div>
                  {order?.orderStatus !== 'pending' && order?.orderStatus !== 'cancelled' && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {order?.orderStatus === 'confirmed' ? 'Confirmed' : 
                           order?.orderStatus === 'processing' ? 'Processing' : 
                           order?.orderStatus === 'shipped' ? 'Shipped' : 'Updated'}
                        </p>
                        <p className="text-xs text-slate-500">{formatDate(order?.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  {order?.orderStatus === 'delivered' && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Truck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">Delivered</p>
                        <p className="text-xs text-slate-500">{formatDate(order?.deliveredAt || order?.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Items List */}
            {order?.products && order.products.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm border border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImage(item)}
                          alt={getProductName(item)}
                          className="w-10 h-10 object-cover rounded-lg"
                          onError={(e) => { e.target.src = '/api/placeholder/50/50'; }}
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{getProductName(item)}</p>
                          <p className="text-xs text-slate-500">Quantity: {item?.quantity || 0}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        ₹{((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              {/* Cancel Order Button - Only for pending orders */}
              {order?.orderStatus === 'pending' && (
                <button
                  onClick={() => handleCancelOrder(order)}
                  disabled={cancellingOrder === order._id || !cancellable || stockUpdateInProgress}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    cancellable && !stockUpdateInProgress
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {cancellingOrder === order._id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Ban className="w-4 h-4" />
                  )}
                  Cancel Order
                </button>
              )}
              
              {/* Show message for non-cancellable orders */}
              {order?.orderStatus !== 'pending' && order?.orderStatus !== 'delivered' && order?.orderStatus !== 'cancelled' && (
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Cannot cancel - Order already {order?.orderStatus}
                </div>
              )}
              
              {/* Track Order Button */}
              <button
                onClick={() => handleTrackOrder(order)}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Track Order
              </button>
              
              {/* Reorder Button */}
              {order?.orderStatus === 'delivered' && (
                <button
                  onClick={() => handleReorder(order)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reorder
                </button>
              )}
              
              {/* Write Review Button */}
              {order?.orderStatus === 'delivered' && (
                <button
                  onClick={() => handleWriteReview(order)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Write Review
                </button>
              )}
              
              {/* Need Help Button */}
              <Link
                to="/contact"
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Need Help?
              </Link>
            </div>
            
            {/* Cancellation Info */}
            {order?.orderStatus === 'pending' && cancellable && (
              <div className="mt-3 p-2 bg-green-50 rounded-lg text-center border border-green-200">
                <p className="text-xs text-green-700 flex items-center justify-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  ✅ You can cancel this order while it's pending (before confirmation)
                </p>
              </div>
            )}
            
            {order?.orderStatus === 'pending' && !cancellable && (
              <div className="mt-3 p-2 bg-amber-50 rounded-lg text-center border border-amber-200">
                <p className="text-xs text-amber-700 flex items-center justify-center gap-2">
                  <Clock className="w-3 h-3" />
                  ⏰ Cancellation period has expired (only available within 48 hours)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-light tracking-widest uppercase text-xs">Loading Orders</p>
        </div>
      </div>
    );
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
            Order History
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Orders</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Track and manage all your orders in one place
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
        {/* Stats Cards */}
        {totalOrders > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Delivered</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">{deliveredOrders}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{pendingOrders}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-white mt-1">₹{totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search and Filter Bar */}
        {totalOrders > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 p-2 md:p-3 mb-8 border border-slate-100">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shrink-0"
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-semibold">Filters</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>

                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
                  {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                        filterStatus === status 
                          ? 'bg-white shadow-sm text-indigo-600' 
                          : 'text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      {status === 'all' ? 'All' : status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Orders List */}
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-100">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {searchTerm || filterStatus !== 'all' ? (
                  <Search className="w-10 h-10 text-slate-400" />
                ) : (
                  <ShoppingBag className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No matching orders' : 'No orders yet'}
              </h3>
              <p className="text-slate-500 mb-6 text-sm">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Looks like you haven\'t placed any orders. Start shopping to see your orders here!'}
              </p>
              {(searchTerm || filterStatus !== 'all') ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Filters
                </button>
              ) : (
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Start Shopping
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filteredOrders.length}</span> of{' '}
                <span className="font-semibold text-slate-700">{orders?.length || 0}</span> orders
              </p>
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear Filters
                </button>
              )}
            </div>
            
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Filter Orders</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-all">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">Order Status</label>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Orders', icon: ShoppingBag },
                    { id: 'pending', label: 'Pending', icon: Clock },
                    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
                    { id: 'processing', label: 'Processing', icon: Package },
                    { id: 'shipped', label: 'Shipped', icon: Truck },
                    { id: 'delivered', label: 'Delivered', icon: CheckCircle },
                    { id: 'cancelled', label: 'Cancelled', icon: AlertCircle }
                  ].map(option => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setFilterStatus(option.id);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          filterStatus === option.id
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button 
                onClick={clearFilters}
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all rounded-xl"
              >
                Clear All
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-slide-left {
          animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Orders;