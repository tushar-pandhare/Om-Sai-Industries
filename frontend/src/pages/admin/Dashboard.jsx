// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import Sidebar from '../../components/Sidebar';
// import { fetchProducts } from '../../features/prdoducts/productSlice';
// import { fetchAllOrders } from '../../features/orders/orderSlice';
// import { fetchAllUsers } from '../../features/auth/authSlice';
// import { fetchAllComplaints } from '../../features/complaints/complaintSlice';
// import { 
//   TrendingUp, 
//   ShoppingBag, 
//   Package, 
//   AlertTriangle, 
//   Users, 
//   Plus, 
//   Gift, 
//   FolderTree, 
//   MessageCircle,
//   ArrowRight,
//   Clock,
//   CheckCircle,
//   Truck,
//   Eye,
//   DollarSign,
//   Percent,
//   ArrowLeft
// } from 'lucide-react';

// // Stat Card Component - Matching AddProduct style
// const StatCard = ({ title, value, icon: Icon, bgColor, subtitle = '', trend = '', trendColor = 'text-green-600' }) => (
//   <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
//     <div className="flex items-center justify-between mb-4">
//       <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105`}>
//         <Icon className="h-6 w-6 text-white" />
//       </div>
//       {trend && (
//         <div className={`flex items-center gap-1 ${trendColor} text-xs font-medium`}>
//           <TrendingUp className="h-3 w-3" />
//           <span>{trend}</span>
//         </div>
//       )}
//     </div>
//     <div>
//       <p className="text-sm font-medium text-gray-500">{title}</p>
//       <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
//       {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
//     </div>
//   </div>
// );

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const { products } = useSelector((state) => state.products);
//   const { orders } = useSelector((state) => state.orders);
//   const { users } = useSelector((state) => state.auth);
//   const { complaints } = useSelector((state) => state.complaints);
  
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     totalProducts: 0,
//     totalUsers: 0,
//     pendingComplaints: 0,
//     totalRevenue: 0,
//     pendingOrders: 0,
//     deliveredOrders: 0,
//     shippedOrders: 0,
//     confirmedOrders: 0
//   });
  
//   useEffect(() => {
//     dispatch(fetchProducts());
//     dispatch(fetchAllOrders());
//     dispatch(fetchAllUsers());
//     dispatch(fetchAllComplaints());
//   }, [dispatch]);
  
//   useEffect(() => {
//     if (orders && products && users && complaints) {
//       setStats({
//         totalOrders: orders.length,
//         totalProducts: products.length,
//         totalUsers: users.length,
//         pendingComplaints: complaints.filter(c => c.status === 'pending').length,
//         totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
//         pendingOrders: orders.filter(o => o.orderStatus === 'pending').length,
//         deliveredOrders: orders.filter(o => o.orderStatus === 'delivered').length,
//         shippedOrders: orders.filter(o => o.orderStatus === 'shipped').length,
//         confirmedOrders: orders.filter(o => o.orderStatus === 'confirmed').length
//       });
//     }
//   }, [orders, products, users, complaints]);
  
//   const recentOrders = orders?.slice(0, 5) || [];
//   const lowStockProducts = products?.filter(p => p.stock < 10 && p.stock > 0) || [];
//   const outOfStockProducts = products?.filter(p => p.stock === 0) || [];
  
//   // Calculate growth (mock data for demo)
//   const revenueGrowth = "+23.5%";
//   const orderGrowth = "+15.2%";
  
//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
//       <Sidebar />
      
//       <div className="flex-1 overflow-x-auto">
//         <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
//           {/* Header Section - Matching AddProduct style */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between flex-wrap gap-4">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//                 <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with your store today.</p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Link 
//                   to="/admin/products/add" 
//                   className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
//                 >
//                   <Plus className="h-4 w-4" />
//                   Add Product
//                 </Link>
//               </div>
//             </div>
            
//             {/* Breadcrumb - Matching AddProduct style */}
//             <div className="flex items-center gap-2 text-sm text-gray-500 mt-6">
//               <span className="text-gray-900 font-medium">Dashboard</span>
//             </div>
//           </div>
          
//           {/* Stats Cards - First Row */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//             <StatCard 
//               title="Total Revenue" 
//               value={`₹${stats.totalRevenue.toLocaleString()}`} 
//               icon={DollarSign} 
//               bgColor="bg-gradient-to-r from-emerald-500 to-emerald-600"
//               trend={revenueGrowth}
//               subtitle="vs last month"
//             />
//             <StatCard 
//               title="Total Orders" 
//               value={stats.totalOrders} 
//               icon={ShoppingBag} 
//               bgColor="bg-gradient-to-r from-blue-600 to-blue-700"
//               trend={orderGrowth}
//               subtitle={`${stats.pendingOrders} pending, ${stats.deliveredOrders} delivered`}
//             />
//             <StatCard 
//               title="Products" 
//               value={stats.totalProducts} 
//               icon={Package} 
//               bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
//               subtitle={lowStockProducts.length > 0 ? `${lowStockProducts.length} low in stock` : 'All stocked'}
//             />
//             <StatCard 
//               title="Pending Complaints" 
//               value={stats.pendingComplaints} 
//               icon={MessageCircle} 
//               bgColor="bg-gradient-to-r from-amber-500 to-amber-600"
//               subtitle={`Total Users: ${stats.totalUsers}`}
//             />
//           </div>
          
//           {/* Order Status Breakdown - Matching card style */}
//           <div className="mb-8">
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
//               <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
//                     <Truck className="h-5 w-5 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-semibold text-gray-900">Order Status Breakdown</h2>
//                     <p className="text-xs text-gray-500">Real-time order tracking overview</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                   <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-100">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-amber-700 text-sm font-medium">Pending</p>
//                         <p className="text-2xl font-bold text-amber-800">{stats.pendingOrders}</p>
//                       </div>
//                       <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
//                         <Clock className="h-5 w-5 text-amber-600" />
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-100">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-blue-700 text-sm font-medium">Confirmed</p>
//                         <p className="text-2xl font-bold text-blue-800">{stats.confirmedOrders}</p>
//                       </div>
//                       <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
//                         <CheckCircle className="h-5 w-5 text-blue-600" />
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-100">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-purple-700 text-sm font-medium">Shipped</p>
//                         <p className="text-2xl font-bold text-purple-800">{stats.shippedOrders}</p>
//                       </div>
//                       <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
//                         <Truck className="h-5 w-5 text-purple-600" />
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-100">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-emerald-700 text-sm font-medium">Delivered</p>
//                         <p className="text-2xl font-bold text-emerald-800">{stats.deliveredOrders}</p>
//                       </div>
//                       <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
//                         <CheckCircle className="h-5 w-5 text-emerald-600" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="grid lg:grid-cols-2 gap-6">
//             {/* Recent Orders Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
//               <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
//                       <ShoppingBag className="h-5 w-5 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
//                       <p className="text-xs text-gray-500">Latest customer purchases</p>
//                     </div>
//                   </div>
//                   <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
//                     View All
//                     <ArrowRight className="h-4 w-4" />
//                   </Link>
//                 </div>
//               </div>
              
//               <div className="p-6">
//                 {recentOrders.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <ShoppingBag className="h-10 w-10 text-gray-400" />
//                     </div>
//                     <p className="text-gray-500 font-medium">No orders yet</p>
//                     <p className="text-xs text-gray-400 mt-1">Orders will appear here once placed</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {recentOrders.map((order) => (
//                       <div key={order._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-1">
//                             <span className="font-mono text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
//                               #{order._id?.slice(-8)}
//                             </span>
//                             <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
//                               order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
//                               order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-700' :
//                               order.orderStatus === 'confirmed' ? 'bg-blue-100 text-blue-700' :
//                               order.orderStatus === 'cancelled' ? 'bg-rose-100 text-rose-700' :
//                               'bg-amber-100 text-amber-700'
//                             }`}>
//                               {order.orderStatus === 'delivered' && <CheckCircle className="h-3 w-3" />}
//                               {order.orderStatus === 'shipped' && <Truck className="h-3 w-3" />}
//                               {order.orderStatus === 'confirmed' && <CheckCircle className="h-3 w-3" />}
//                               {order.orderStatus === 'pending' && <Clock className="h-3 w-3" />}
//                               {order.orderStatus}
//                             </span>
//                           </div>
//                           <p className="text-sm font-semibold text-gray-800">₹{order.totalAmount?.toLocaleString()}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-xs text-gray-400">
//                             {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                           </p>
//                           <Link 
//                             to={`/admin/orders/${order._id}`}
//                             className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block font-medium"
//                           >
//                             View Details
//                           </Link>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Quick Actions Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
//               <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
//                     <Plus className="h-5 w-5 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
//                     <p className="text-xs text-gray-500">Common administrative tasks</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <Link
//                     to="/admin/products/add"
//                     className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
//                   >
//                     <Plus className="h-7 w-7 mb-2 group-hover:scale-110 transition-transform" />
//                     <p className="font-semibold text-sm">Add Product</p>
//                     <p className="text-xs opacity-90 mt-1">Add new product to store</p>
//                   </Link>
                  
//                   <Link
//                     to="/admin/offers"
//                     className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
//                   >
//                     <Gift className="h-7 w-7 mb-2 group-hover:scale-110 transition-transform" />
//                     <p className="font-semibold text-sm">Create Offer</p>
//                     <p className="text-xs opacity-90 mt-1">Setup discounts & deals</p>
//                   </Link>
                  
//                   <Link
//                     to="/admin/categories"
//                     className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
//                   >
//                     <FolderTree className="h-7 w-7 mb-2 group-hover:scale-110 transition-transform" />
//                     <p className="font-semibold text-sm">Categories</p>
//                     <p className="text-xs opacity-90 mt-1">Manage categories</p>
//                   </Link>
                  
//                   <Link
//                     to="/admin/complaints"
//                     className="group bg-gradient-to-r from-rose-500 to-rose-600 text-white p-4 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
//                   >
//                     <MessageCircle className="h-7 w-7 mb-2 group-hover:scale-110 transition-transform" />
//                     <p className="font-semibold text-sm">Complaints</p>
//                     <p className="text-xs opacity-90 mt-1">View customer issues</p>
//                   </Link>
//                 </div>
//               </div>
//             </div>
            
//             {/* Low Stock Alert Card */}
//             {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
//               <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
//                 <div className="px-6 py-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
//                       <AlertTriangle className="h-5 w-5 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-lg font-semibold text-amber-800">Low Stock Alert</h2>
//                       <p className="text-xs text-amber-600">Products needing attention</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div className="space-y-3">
//                     {lowStockProducts.slice(0, 5).map((product) => (
//                       <div key={product._id} className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-100">
//                         <div>
//                           <p className="font-medium text-gray-800">{product.name}</p>
//                           <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku || 'N/A'}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className={`font-bold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
//                             Stock: {product.stock}
//                           </p>
//                           {product.stock === 0 && (
//                             <p className="text-xs text-red-600 mt-1 font-medium">Out of Stock!</p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                     {(lowStockProducts.length > 5 || outOfStockProducts.length > 5) && (
//                       <Link to="/admin/products/manage" className="text-center text-sm text-amber-600 hover:text-amber-700 font-medium block mt-4">
//                         View all {lowStockProducts.length + outOfStockProducts.length} products
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {/* Recent Complaints Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
//               <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
//                       <MessageCircle className="h-5 w-5 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
//                       <p className="text-xs text-gray-500">Customer issues and feedback</p>
//                     </div>
//                   </div>
//                   <Link to="/admin/complaints" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
//                     View All
//                     <ArrowRight className="h-4 w-4" />
//                   </Link>
//                 </div>
//               </div>
              
//               <div className="p-6">
//                 {complaints?.slice(0, 5).length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <MessageCircle className="h-10 w-10 text-gray-400" />
//                     </div>
//                     <p className="text-gray-500 font-medium">No complaints yet</p>
//                     <p className="text-xs text-gray-400 mt-1">Customer issues will appear here</p>
//                   </div>
//                 ) : (
//                   complaints?.slice(0, 5).map((complaint) => (
//                     <div key={complaint._id} className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-1 flex-wrap">
//                             <p className="font-semibold text-gray-800">{complaint.subject}</p>
//                             <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
//                               complaint.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
//                               complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
//                               'bg-amber-100 text-amber-700'
//                             }`}>
//                               {complaint.status === 'resolved' && <CheckCircle className="h-3 w-3" />}
//                               {complaint.status}
//                             </span>
//                           </div>
//                           <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
//                           <p className="text-xs text-gray-400 mt-2">
//                             {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                           </p>
//                         </div>
//                         <Link 
//                           to={`/admin/complaints/${complaint._id}`}
//                           className="text-gray-400 hover:text-blue-600 ml-3 transition-colors"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </Link>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Tips Card - Matching AddProduct style */}
//           <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
//                 <TrendingUp className="h-4 w-4 text-white" />
//               </div>
//               <div>
//                 <h4 className="font-semibold text-gray-900 text-sm">Admin Insights</h4>
//                 <ul className="text-xs text-gray-700 mt-2 space-y-1.5">
//                   <li className="flex items-start gap-1">
//                     <span className="text-blue-500">•</span>
//                     <span>Monitor low stock products to prevent stockouts</span>
//                   </li>
//                   <li className="flex items-start gap-1">
//                     <span className="text-blue-500">•</span>
//                     <span>Respond to customer complaints within 24 hours</span>
//                   </li>
//                   <li className="flex items-start gap-1">
//                     <span className="text-blue-500">•</span>
//                     <span>Review pending orders for timely processing</span>
//                   </li>
//                   <li className="flex items-start gap-1">
//                     <span className="text-blue-500">•</span>
//                     <span>Track revenue trends to identify growth opportunities</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../features/prdoducts/productSlice';
import { fetchAllOrders } from '../../features/orders/orderSlice';
import { fetchAllUsers } from '../../features/auth/authSlice';
import { fetchAllComplaints } from '../../features/complaints/complaintSlice';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  Users, 
  Plus, 
  Gift, 
  FolderTree, 
  MessageCircle,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  Eye,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Settings,
  HelpCircle,
  ChevronDown,
  User,
  ClipboardList,
  Star,
  Mail,
  Phone,
  Menu,
  X,
  Zap,
  Grid,
  Home,
  Tag,
  Heart,
  Shield,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  Compass,
  Layers,
  Edit,
  FileText,
  BarChart3,
  Award,
  Target,
  Sparkles,
  LifeBuoy,
  BookOpen,
  Headphones,
  FileQuestion
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, bgColor, subtitle = '', trend = '' }) => (
  <div className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </div>
  </div>
);

// Floating Action Button Component
const FloatingActionMenu = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const menuItems = [
    { category: "🏠 Main", items: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard, color: "from-indigo-500 to-indigo-600" },
      { name: "Home", path: "/", icon: Home, color: "from-slate-500 to-slate-600" }
    ]},
    { category: "📦 Products", items: [
      { name: "Add Product", path: "/admin/products/add", icon: Plus, color: "from-blue-500 to-blue-600" },
      { name: "Manage Products", path: "/admin/products/manage", icon: Package, color: "from-blue-500 to-blue-600" },
      { name: "Categories", path: "/admin/categories", icon: Layers, color: "from-blue-500 to-blue-600" }
    ]},
    { category: "🎁 Marketing", items: [
      { name: "Offers", path: "/admin/offers", icon: Gift, color: "from-emerald-500 to-emerald-600" }
    ]},
    { category: "💰 Sales", items: [
      { name: "Orders", path: "/admin/orders", icon: ClipboardList, color: "from-purple-500 to-purple-600" }
    ]},
    { category: "💬 Customer Care", items: [
      { name: "Reviews", path: "/admin/reviews", icon: Star, color: "from-amber-500 to-amber-600" },
      { name: "Complaints", path: "/admin/complaints", icon: AlertTriangle, color: "from-rose-500 to-rose-600" },
      { name: "Messages", path: "/admin/messages", icon: MessageCircle, color: "from-indigo-500 to-indigo-600" }
    ]},
    { category: "👥 Users", items: [
      { name: "Customers", path: "/admin/customers", icon: Users, color: "from-teal-500 to-teal-600" },
      { name: "Users", path: "/admin/users", icon: User, color: "from-teal-500 to-teal-600" }
    ]},
    { category: "⚙️ Settings", items: [
      { name: "Contact Editor", path: "/admin/contact", icon: Edit, color: "from-gray-500 to-gray-600" },
      { name: "Settings", path: "/settings", icon: Settings, color: "from-gray-500 to-gray-600" }
    ]}
  ];

  const filteredMenuItems = menuItems.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Navigation Menu
        </span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div className={`
        fixed bottom-24 right-8 z-50 w-[500px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300
        ${isOpen ? 'animate-slideUp opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}>
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-50 to-slate-50 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Navigation Menu</h2>
              <p className="text-xs text-gray-500">Quick access to all admin sections</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {filteredMenuItems.map((category, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-2 px-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{category.category}</span>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {category.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIdx}
                      to={item.path}
                      onClick={() => {
                        setIsOpen(false);
                        onClose?.();
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r ${item.color} text-white hover:shadow-lg transition-all duration-200 group`}
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Ready to navigate</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Press ESC to close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.orders);
  const { users } = useSelector((state) => state.auth);
  const { complaints } = useSelector((state) => state.complaints);
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingComplaints: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    shippedOrders: 0,
    confirmedOrders: 0
  });
  
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
    dispatch(fetchAllUsers());
    dispatch(fetchAllComplaints());
  }, [dispatch]);
  
  useEffect(() => {
    if (orders && products && users && complaints) {
      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingComplaints: complaints.filter(c => c.status === 'pending').length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        pendingOrders: orders.filter(o => o.orderStatus === 'pending').length,
        deliveredOrders: orders.filter(o => o.orderStatus === 'delivered').length,
        shippedOrders: orders.filter(o => o.orderStatus === 'shipped').length,
        confirmedOrders: orders.filter(o => o.orderStatus === 'confirmed').length
      });
    }
  }, [orders, products, users, complaints]);
  
  const recentOrders = orders?.slice(0, 5) || [];
  const lowStockProducts = products?.filter(p => p.stock < 10 && p.stock > 0) || [];
  const outOfStockProducts = products?.filter(p => p.stock === 0) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Floating Action Menu - Bottom Right */}
      <FloatingActionMenu />

      {/* Main Content - Full Width, No Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600">Admin Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-2">Welcome to your admin control panel.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={DollarSign} 
            bgColor="bg-gradient-to-r from-emerald-500 to-emerald-600"
            trend="+23.5%"
            subtitle="vs last month"
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders} 
            icon={ShoppingBag} 
            bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
            trend="+15.2%"
            subtitle={`${stats.pendingOrders} pending, ${stats.deliveredOrders} delivered`}
          />
          <StatCard 
            title="Products" 
            value={stats.totalProducts} 
            icon={Package} 
            bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
            subtitle={lowStockProducts.length > 0 ? `${lowStockProducts.length} low in stock` : 'All stocked'}
          />
          <StatCard 
            title="Pending Complaints" 
            value={stats.pendingComplaints} 
            icon={MessageCircle} 
            bgColor="bg-gradient-to-r from-amber-500 to-amber-600"
            subtitle={`Total Users: ${stats.totalUsers}`}
          />
        </div>
        
        {/* Order Status Breakdown */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Order Status Breakdown</h2>
                  <p className="text-xs text-gray-500">Real-time order tracking overview</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-700 text-sm font-medium">Pending</p>
                      <p className="text-2xl font-bold text-amber-800">{stats.pendingOrders}</p>
                    </div>
                    <Clock className="h-8 w-8 text-amber-600 opacity-75" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-700 text-sm font-medium">Confirmed</p>
                      <p className="text-2xl font-bold text-blue-800">{stats.confirmedOrders}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-blue-600 opacity-75" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-700 text-sm font-medium">Shipped</p>
                      <p className="text-2xl font-bold text-purple-800">{stats.shippedOrders}</p>
                    </div>
                    <Truck className="h-8 w-8 text-purple-600 opacity-75" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-700 text-sm font-medium">Delivered</p>
                      <p className="text-2xl font-bold text-emerald-800">{stats.deliveredOrders}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-emerald-600 opacity-75" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <p className="text-xs text-gray-500">Latest customer purchases</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = '/admin/orders'}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                            #{order._id?.slice(-8)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                            order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-700' :
                            order.orderStatus === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">₹{order.totalAmount?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <button 
                          onClick={() => window.location.href = `/admin/orders/${order._id}`}
                          className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 inline-block"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Low Stock Alert */}
          {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
            <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-amber-800">Low Stock Alert</h2>
                    <p className="text-xs text-amber-600">Products needing attention</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                          Stock: {product.stock}
                        </p>
                        {product.stock === 0 && <p className="text-xs text-red-600 mt-0.5">Out of Stock!</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{stats.totalOrders ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalOrders ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <LifeBuoy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;