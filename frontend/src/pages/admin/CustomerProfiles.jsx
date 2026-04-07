// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Search, User, Mail, Phone, MapPin, Package, TrendingUp, Clock, CheckCircle, Eye, ChevronDown, ChevronUp, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
// import Sidebar from '../../components/Sidebar';
// import { fetchAllUsers } from '../../features/auth/authSlice';
// import { fetchAllOrders } from '../../features/orders/orderSlice';
// import toast from 'react-hot-toast';

// const CustomerProfiles = () => {
//   const dispatch = useDispatch();
//   const { users, loading } = useSelector((state) => state.auth);
//   const { orders } = useSelector((state) => state.orders);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [sortBy, setSortBy] = useState('name');
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllUsers());
//     dispatch(fetchAllOrders());
//   }, [dispatch]);

//   const filteredUsers = users?.filter(user => 
//     user.role === 'user' && (
//       user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.phone?.includes(searchTerm)
//     )
//   );

//   const sortedUsers = [...(filteredUsers || [])].sort((a, b) => {
//     if (sortBy === 'name') return a.name?.localeCompare(b.name);
//     if (sortBy === 'spent') return getUserTotalSpent(b._id) - getUserTotalSpent(a._id);
//     if (sortBy === 'orders') return getUserOrders(b._id).length - getUserOrders(a._id).length;
//     return 0;
//   });

//   const getUserOrders = (userId) => {
//     return orders?.filter(order => order.user?._id === userId) || [];
//   };

//   const getUserTotalSpent = (userId) => {
//     const userOrders = getUserOrders(userId);
//     return userOrders.reduce((sum, order) => sum + order.totalAmount, 0);
//   };

//   const getOrderStatusColor = (status) => {
//     const colors = {
//       delivered: 'bg-green-100 text-green-800 border-green-200',
//       processing: 'bg-blue-100 text-blue-800 border-blue-200',
//       shipped: 'bg-purple-100 text-purple-800 border-purple-200',
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       cancelled: 'bg-red-100 text-red-800 border-red-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getOrderStatusIcon = (status) => {
//     const icons = {
//       delivered: CheckCircle,
//       processing: Clock,
//       shipped: Package,
//       pending: Clock,
//       cancelled: XCircle
//     };
//     const Icon = icons[status] || Package;
//     return <Icon className="h-3 w-3" />;
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />
      
//       <div className="flex-1 min-w-0">
//         {/* Header */}
//         <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Customer Profiles</h1>
//             <p className="text-sm sm:text-base text-slate-500 mt-1">Manage and view customer information</p>
//           </div>
//         </div>

//         <div className="p-4 sm:p-6 lg:p-8">
//           {/* Stats Overview */}
//           {filteredUsers?.length > 0 && (
//             <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-[300px]">
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs sm:text-sm text-slate-500">Total Customers</p>
//                       <p className="text-xl sm:text-2xl font-bold text-slate-800">{filteredUsers?.length || 0}</p>
//                     </div>
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs sm:text-sm text-slate-500">Total Revenue</p>
//                       <p className="text-xl sm:text-2xl font-bold text-green-600">
//                         ₹{filteredUsers?.reduce((sum, user) => sum + getUserTotalSpent(user._id), 0).toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="p-2 bg-green-100 rounded-lg">
//                       <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs sm:text-sm text-slate-500">Avg Order Value</p>
//                       <p className="text-xl sm:text-2xl font-bold text-purple-600">
//                         ₹{filteredUsers?.length ? Math.round(filteredUsers.reduce((sum, user) => sum + getUserTotalSpent(user._id), 0) / filteredUsers.length).toLocaleString() : 0}
//                       </p>
//                     </div>
//                     <div className="p-2 bg-purple-100 rounded-lg">
//                       <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs sm:text-sm text-slate-500">Active Customers</p>
//                       <p className="text-xl sm:text-2xl font-bold text-orange-600">
//                         {filteredUsers?.filter(user => getUserOrders(user._id).length > 0).length || 0}
//                       </p>
//                     </div>
//                     <div className="p-2 bg-orange-100 rounded-lg">
//                       <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
        
//           {/* Search and Filters */}
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
//             <div className="p-4">
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
//                   <input
//                     type="text"
//                     placeholder="Search customers by name, email, or phone..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
//                   />
//                 </div>
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-700"
//                 >
//                   <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                   </svg>
//                   <span className="hidden sm:inline">Sort & Filter</span>
//                 </button>
//               </div>
              
//               {showFilters && (
//                 <div className="mt-4 pt-4 border-t border-slate-200">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Sort By
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {[
//                         { value: 'name', label: 'Name' },
//                         { value: 'spent', label: 'Total Spent' },
//                         { value: 'orders', label: 'Order Count' }
//                       ].map(option => (
//                         <button
//                           key={option.value}
//                           onClick={() => setSortBy(option.value)}
//                           className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                             sortBy === option.value
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
        
//           {/* Customers Grid */}
//           {loading ? (
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="mt-3 text-slate-500">Loading customers...</p>
//             </div>
//           ) : sortedUsers?.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
//               <div className="text-slate-400 mb-4">
//                 <User className="h-16 w-16 mx-auto" />
//               </div>
//               <h3 className="text-lg font-medium text-slate-800 mb-2">No customers found</h3>
//               <p className="text-slate-500">
//                 {searchTerm ? 'Try adjusting your search' : 'No customer accounts available'}
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//               {sortedUsers?.map((user) => {
//                 const userOrders = getUserOrders(user._id);
//                 const totalSpent = getUserTotalSpent(user._id);
//                 const isExpanded = selectedUser === user._id;
                
//                 return (
//                   <div key={user._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
//                     {/* Customer Header */}
//                     <div className="p-4 sm:p-6">
//                       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
//                         <div className="flex items-start gap-3">
//                           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
//                             {user.name?.charAt(0).toUpperCase()}
//                           </div>
//                           <div className="min-w-0 flex-1">
//                             <h3 className="text-base sm:text-lg font-semibold text-slate-800 truncate">{user.name}</h3>
//                             <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
//                               <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
//                                 <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
//                                 <span className="truncate">{user.email}</span>
//                               </div>
//                               {user.phone && (
//                                 <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
//                                   <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
//                                   <span>{user.phone}</span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-left sm:text-right">
//                           <div className="text-xl sm:text-2xl font-bold text-green-600">
//                             ₹{totalSpent.toLocaleString()}
//                           </div>
//                           <div className="text-xs sm:text-sm text-slate-500">Total Spent</div>
//                         </div>
//                       </div>
                      
//                       {/* Stats Row */}
//                       <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 pb-4 border-b border-slate-200">
//                         <div className="bg-slate-50 rounded-lg p-2 sm:p-3">
//                           <div className="text-lg sm:text-xl font-bold text-slate-800">{userOrders.length}</div>
//                           <div className="text-xs sm:text-sm text-slate-600">Total Orders</div>
//                         </div>
//                         <div className="bg-slate-50 rounded-lg p-2 sm:p-3">
//                           <div className="text-lg sm:text-xl font-bold text-green-600">
//                             {userOrders.filter(o => o.orderStatus === 'delivered').length}
//                           </div>
//                           <div className="text-xs sm:text-sm text-slate-600">Completed Orders</div>
//                         </div>
//                       </div>
                      
//                       {/* Address Section */}
//                       {user.address && Object.values(user.address).some(v => v) && (
//                         <div className="mb-4 p-3 bg-slate-50 rounded-lg">
//                           <div className="flex items-center gap-2 mb-2">
//                             <MapPin className="h-4 w-4 text-slate-500" />
//                             <h4 className="font-semibold text-sm text-slate-700">Shipping Address:</h4>
//                           </div>
//                           <p className="text-xs sm:text-sm text-slate-600">
//                             {user.address.street}<br/>
//                             {user.address.city}, {user.address.state} - {user.address.pincode}<br/>
//                             {user.address.country}
//                           </p>
//                         </div>
//                       )}
                      
//                       {/* Toggle Button */}
//                       <button
//                         onClick={() => setSelectedUser(isExpanded ? null : user._id)}
//                         className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
//                       >
//                         <Eye className="h-4 w-4" />
//                         {isExpanded ? 'Hide Order History' : 'View Order History'}
//                         {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//                       </button>
                      
//                       {/* Order History */}
//                       {isExpanded && (
//                         <div className="mt-4 pt-4 border-t border-slate-200">
//                           <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
//                             <Package className="h-4 w-4" />
//                             Order History
//                           </h4>
//                           <div className="space-y-2 max-h-64 overflow-y-auto">
//                             {userOrders.length === 0 ? (
//                               <div className="text-center py-6 text-slate-500 text-sm">
//                                 No orders placed yet
//                               </div>
//                             ) : (
//                               userOrders.map((order) => (
//                                 <div key={order._id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
//                                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
//                                     <div className="flex-1">
//                                       <div className="flex items-center gap-2 flex-wrap">
//                                         <p className="text-sm font-semibold text-slate-800">
//                                           Order #{order._id?.slice(-8)}
//                                         </p>
//                                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(order.orderStatus)}`}>
//                                           {getOrderStatusIcon(order.orderStatus)}
//                                           {order.orderStatus}
//                                         </span>
//                                       </div>
//                                       <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
//                                         <Calendar className="h-3 w-3" />
//                                         {formatDate(order.orderDate)}
//                                       </div>
//                                       <p className="text-xs text-slate-500 mt-1">
//                                         {order.products?.length} item(s)
//                                       </p>
//                                     </div>
//                                     <div className="text-right">
//                                       <p className="text-base font-bold text-slate-800">₹{order.totalAmount.toLocaleString()}</p>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper component for XCircle (if not imported)
// const XCircle = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//   </svg>
// );

// export default CustomerProfiles;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, User, Mail, Phone, MapPin, Package, TrendingUp, Clock, CheckCircle, Eye, ChevronDown, ChevronUp, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { fetchAllUsers } from '../../features/auth/authSlice';
import { fetchAllOrders } from '../../features/orders/orderSlice';
import toast from 'react-hot-toast';

const CustomerProfiles = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const filteredUsers = users?.filter(user => 
    user.role === 'user' && (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    )
  );

  const sortedUsers = [...(filteredUsers || [])].sort((a, b) => {
    if (sortBy === 'name') return a.name?.localeCompare(b.name);
    if (sortBy === 'spent') return getUserTotalSpent(b._id) - getUserTotalSpent(a._id);
    if (sortBy === 'orders') return getUserOrders(b._id).length - getUserOrders(a._id).length;
    return 0;
  });

  const getUserOrders = (userId) => {
    return orders?.filter(order => order.user?._id === userId) || [];
  };

  const getUserTotalSpent = (userId) => {
    const userOrders = getUserOrders(userId);
    return userOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getOrderStatusIcon = (status) => {
    const icons = {
      delivered: CheckCircle,
      processing: Clock,
      shipped: Package,
      pending: Clock,
      cancelled: XCircle
    };
    const Icon = icons[status] || Package;
    return <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate totals
  const totalCustomers = filteredUsers?.length || 0;
  const totalRevenue = filteredUsers?.reduce((sum, user) => sum + getUserTotalSpent(user._id), 0) || 0;
  const avgOrderValue = totalCustomers ? Math.round(totalRevenue / totalCustomers) : 0;
  const activeCustomers = filteredUsers?.filter(user => getUserOrders(user._id).length > 0).length || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 sticky top-0 z-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Customer Profiles</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Manage and view customer information</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Overview - Responsive Grid */}
        {totalCustomers > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500">Total Customers</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">{totalCustomers}</p>
                </div>
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500">Avg Order Value</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">
                    ₹{avgOrderValue.toLocaleString()}
                  </p>
                </div>
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500">Active Customers</p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-600">{activeCustomers}</p>
                </div>
                <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-700"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden xs:inline">Sort & Filter</span>
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                    Sort By
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {[
                      { value: 'name', label: 'Name' },
                      { value: 'spent', label: 'Total Spent' },
                      { value: 'orders', label: 'Order Count' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          sortBy === option.value
                            ? 'bg-slate-800 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      
        {/* Customers Grid */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-slate-800"></div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500">Loading customers...</p>
          </div>
        ) : sortedUsers?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
            <div className="text-slate-400 mb-3 sm:mb-4">
              <User className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-slate-800 mb-1 sm:mb-2">No customers found</h3>
            <p className="text-sm sm:text-base text-slate-500">
              {searchTerm ? 'Try adjusting your search' : 'No customer accounts available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {sortedUsers?.map((user) => {
              const userOrders = getUserOrders(user._id);
              const totalSpent = getUserTotalSpent(user._id);
              const isExpanded = selectedUser === user._id;
              
              return (
                <div key={user._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Customer Header */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-800 truncate">{user.name}</h3>
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 mt-1">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 min-w-0">
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
                                <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">
                          ₹{totalSpent.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-500">Total Spent</div>
                      </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 pb-4 border-b border-slate-200">
                      <div className="bg-slate-50 rounded-lg p-2 sm:p-3">
                        <div className="text-lg sm:text-xl font-bold text-slate-800">{userOrders.length}</div>
                        <div className="text-xs sm:text-sm text-slate-600">Total Orders</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2 sm:p-3">
                        <div className="text-lg sm:text-xl font-bold text-green-600">
                          {userOrders.filter(o => o.orderStatus === 'delivered').length}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600">Completed Orders</div>
                      </div>
                    </div>
                    
                    {/* Address Section */}
                    {user.address && Object.values(user.address).some(v => v) && (
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                          <h4 className="font-semibold text-xs sm:text-sm text-slate-700">Shipping Address:</h4>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 break-words">
                          {user.address.street}<br/>
                          {user.address.city}, {user.address.state} - {user.address.pincode}<br/>
                          {user.address.country}
                        </p>
                      </div>
                    )}
                    
                    {/* Toggle Button */}
                    <button
                      onClick={() => setSelectedUser(isExpanded ? null : user._id)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {isExpanded ? 'Hide Order History' : 'View Order History'}
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    </button>
                    
                    {/* Order History */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Order History
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {userOrders.length === 0 ? (
                            <div className="text-center py-6 text-slate-500 text-xs sm:text-sm">
                              No orders placed yet
                            </div>
                          ) : (
                            userOrders.map((order) => (
                              <div key={order._id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                                        Order #{order._id?.slice(-8)}
                                      </p>
                                      <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(order.orderStatus)}`}>
                                        {getOrderStatusIcon(order.orderStatus)}
                                        {order.orderStatus}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                      <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                      {formatDate(order.orderDate)}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                      {order.products?.length} item(s)
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm sm:text-base font-bold text-slate-800">₹{order.totalAmount.toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for XCircle
const XCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default CustomerProfiles;