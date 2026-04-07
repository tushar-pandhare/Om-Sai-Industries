// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import Sidebar from '../../components/Sidebar';

// const Dashboard = () => {
//   const { orders } = useSelector((state) => state.orders);
//   const { products } = useSelector((state) => state.products);
//   const { users } = useSelector((state) => state.users);
//   const { complaints } = useSelector((state) => state.complaints);
  
//   const stats = {
//     totalOrders: orders?.length || 0,
//     totalProducts: products?.length || 0,
//     totalUsers: users?.length || 0,
//     pendingComplaints: complaints?.filter(c => c.status === 'pending').length || 0,
//     totalRevenue: orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0
//   };
  
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />
      
//       <div className="flex-1 p-8">
//         <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
//             <div className="text-gray-600">Total Orders</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-2xl font-bold text-green-600">{stats.totalProducts}</div>
//             <div className="text-gray-600">Products</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
//             <div className="text-gray-600">Users</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-2xl font-bold text-red-600">{stats.pendingComplaints}</div>
//             <div className="text-gray-600">Pending Complaints</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-2xl font-bold text-yellow-600">₹{stats.totalRevenue}</div>
//             <div className="text-gray-600">Revenue</div>
//           </div>
//         </div>
        
//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
//             <div className="space-y-3">
//               <Link to="/admin/products/add" className="block w-full bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600">
//                 Add New Product
//               </Link>
//               <Link to="/admin/offers" className="block w-full bg-green-500 text-white text-center py-2 rounded hover:bg-green-600">
//                 Create Offer
//               </Link>
//               <Link to="/admin/categories" className="block w-full bg-purple-500 text-white text-center py-2 rounded hover:bg-purple-600">
//                 Manage Categories
//               </Link>
//             </div>
//           </div>
          
//           {/* Recent Orders */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
//             <div className="space-y-3">
//               {orders?.slice(0, 5).map((order) => (
//                 <div key={order._id} className="flex justify-between items-center border-b pb-2">
//                   <div>
//                     <p className="font-semibold">Order #{order._id.slice(-6)}</p>
//                     <p className="text-sm text-gray-600">₹{order.totalAmount}</p>
//                   </div>
//                   <span className={`px-2 py-1 rounded text-sm ${
//                     order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
//                     order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-blue-100 text-blue-800'
//                   }`}>
//                     {order.orderStatus}
//                   </span>
//                 </div>
//               ))}
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
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
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
  Percent
} from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
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
  const lowStockProducts = products?.filter(p => p.stock < 10) || [];
  const outOfStockProducts = products?.filter(p => p.stock === 0) || [];
  
  // Calculate revenue growth (mock data for demo)
  const revenueGrowth = "+23.5%";
  const orderGrowth = "+15.2%";
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-x-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
              </div>
              <div className="flex space-x-3">
                <Link 
                  to="/admin/products/add" 
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-emerald-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-green-600 font-medium">{revenueGrowth}</span>
                  <span className="text-xs text-gray-400 ml-2">vs last month</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalOrders}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="inline-flex items-center text-xs text-amber-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {stats.pendingOrders} pending
                  </span>
                  <span className="text-xs text-gray-300">|</span>
                  <span className="inline-flex items-center text-xs text-emerald-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {stats.deliveredOrders} delivered
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Products</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalProducts}</p>
                {lowStockProducts.length > 0 && (
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    {lowStockProducts.length} low in stock
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-rose-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-6 w-6 text-rose-600" />
                </div>
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending Complaints</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingComplaints}</p>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Total Users: {stats.totalUsers}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Second Row Stats - Order Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-700 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-amber-800">{stats.pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-600 opacity-75" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-medium">Confirmed</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.confirmedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600 opacity-75" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm font-medium">Shipped</p>
                  <p className="text-2xl font-bold text-purple-800">{stats.shippedOrders}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-600 opacity-75" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-700 text-sm font-medium">Delivered</p>
                  <p className="text-2xl font-bold text-emerald-800">{stats.deliveredOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600 opacity-75" />
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                <Link to="/admin/orders" className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="p-6">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-mono text-xs font-semibold text-gray-800">#{order._id?.slice(-8)}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                              order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-700' :
                              order.orderStatus === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              order.orderStatus === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">₹{order.totalAmount?.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <Link 
                            to={`/admin/orders/${order._id}`}
                            className="text-xs text-orange-600 hover:text-orange-700 mt-1 inline-block"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/admin/products/add"
                    className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Plus className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-sm">Add Product</p>
                    <p className="text-xs opacity-90 mt-1">Add new product to store</p>
                  </Link>
                  
                  <Link
                    to="/admin/offers"
                    className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Gift className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-sm">Create Offer</p>
                    <p className="text-xs opacity-90 mt-1">Setup discounts & deals</p>
                  </Link>
                  
                  <Link
                    to="/admin/categories"
                    className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FolderTree className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-sm">Categories</p>
                    <p className="text-xs opacity-90 mt-1">Manage categories</p>
                  </Link>
                  
                  <Link
                    to="/admin/complaints"
                    className="group bg-gradient-to-r from-rose-500 to-rose-600 text-white p-4 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-sm">Complaints</p>
                    <p className="text-xs opacity-90 mt-1">View customer issues</p>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                    <h2 className="text-lg font-semibold text-amber-800">Low Stock Alert</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <div key={product._id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                            Stock: {product.stock}
                          </p>
                          {product.stock === 0 && (
                            <p className="text-xs text-red-600 mt-1">Out of Stock!</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {lowStockProducts.length > 5 && (
                      <Link to="/admin/products" className="text-center text-sm text-orange-600 hover:text-orange-700 block mt-3">
                        View all {lowStockProducts.length} products
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Recent Complaints */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-800">Recent Complaints</h2>
                <Link to="/admin/complaints" className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="p-6">
                {complaints?.slice(0, 5).map((complaint) => (
                  <div key={complaint._id} className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-semibold text-gray-800">{complaint.subject}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            complaint.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                            complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <Link 
                        to={`/admin/complaints/${complaint._id}`}
                        className="text-orange-600 hover:text-orange-700 ml-3"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;