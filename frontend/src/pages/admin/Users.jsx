// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Search,
//   Filter,
//   User,
//   Shield,
//   Calendar,
//   Mail,
//   Phone,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Users as UsersIcon,
//   MoreVertical,
//   Crown,
// } from "lucide-react";
// import Sidebar from "../../components/Sidebar";
// import {
//   fetchAllUsers,
//   updateUserRole,
//   deleteUser,
// } from "../../features/auth/authSlice";
// import toast from "react-hot-toast";

// const Users = () => {
//   const dispatch = useDispatch();
//   const { users, loading } = useSelector((state) => state.auth);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterRole, setFilterRole] = useState("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAllUsers());
//   }, [dispatch]);

//   const filteredUsers = users?.filter((user) => {
//     const matchesSearch =
//       user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.phone?.includes(searchTerm);
//     const matchesRole = filterRole === "all" || user.role === filterRole;
//     return matchesSearch && matchesRole;
//   });

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentUsers = filteredUsers?.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);

//   const handleRoleChange = async (userId, newRole, isSuperAdmin) => {
//     // Check if trying to modify super admin
//     if (isSuperAdmin) {
//       toast.error("Super Admin cannot be modified from the frontend");
//       return;
//     }

//     const result = await dispatch(
//       updateUserRole({ id: userId, role: newRole })
//     );
//     if (updateUserRole.fulfilled.match(result)) {
//       toast.success(`User role updated to ${newRole}`);
//     } else {
//       toast.error(result.payload || "Failed to update user role");
//     }
//     setMobileMenuOpen(null);
//   };

//   const handleDeleteUser = async (userId, userName, isSuperAdmin, userRole) => {
//     // Check if trying to delete super admin
//     if (isSuperAdmin) {
//       toast.error("Super Admin cannot be deleted from the frontend");
//       return;
//     }

//     const regularAdminCount = users?.filter(
//       (u) => u.role === "admin" && !u.isSuperAdmin
//     ).length;
//     const isLastRegularAdmin = userRole === "admin" && regularAdminCount === 1;

//     if (isLastRegularAdmin) {
//       toast.error(
//         "Cannot delete the only regular admin. Create another admin first."
//       );
//       return;
//     }

//     if (
//       window.confirm(
//         `Are you sure you want to delete "${userName}"? This action cannot be undone.`
//       )
//     ) {
//       const result = await dispatch(deleteUser(userId));
//       if (deleteUser.fulfilled.match(result)) {
//         toast.success("User deleted successfully");
//       } else {
//         toast.error(result.payload || "Failed to delete user");
//       }
//     }
//     setMobileMenuOpen(null);
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setFilterRole("all");
//     setCurrentPage(1);
//   };

//   const stats = {
//     total: filteredUsers?.length || 0,
//     customers: filteredUsers?.filter((u) => u.role === "user").length || 0,
//     admins: filteredUsers?.filter((u) => u.role === "admin").length || 0,
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />

//       <div className="flex-1 min-w-0">
//         {/* Header */}
//         <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
//               Manage Users
//             </h1>
//             <p className="text-sm sm:text-base text-slate-500 mt-1">
//               Manage user roles and permissions
//             </p>
//           </div>
//         </div>

//         <div className="p-4 sm:p-6 lg:p-8">
//           {/* Stats Overview */}
//           {filteredUsers?.length > 0 && (
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
//               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs sm:text-sm text-slate-500">
//                       Total Users
//                     </p>
//                     <p className="text-xl sm:text-2xl font-bold text-slate-800">
//                       {stats.total}
//                     </p>
//                   </div>
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs sm:text-sm text-slate-500">
//                       Customers
//                     </p>
//                     <p className="text-xl sm:text-2xl font-bold text-green-600">
//                       {stats.customers}
//                     </p>
//                   </div>
//                   <div className="p-2 bg-green-100 rounded-lg">
//                     <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs sm:text-sm text-slate-500">Admins</p>
//                     <p className="text-xl sm:text-2xl font-bold text-purple-600">
//                       {stats.admins}
//                     </p>
//                   </div>
//                   <div className="p-2 bg-purple-100 rounded-lg">
//                     <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
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
//                     placeholder="Search users by name, email, or phone..."
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                     className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
//                   />
//                 </div>
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-700"
//                 >
//                   <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
//                   <span className="hidden sm:inline">Filters</span>
//                   {filterRole !== "all" && (
//                     <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
//                       Active
//                     </span>
//                   )}
//                 </button>
//               </div>

//               {/* Expanded Filters */}
//               {showFilters && (
//                 <div className="mt-4 pt-4 border-t border-slate-200">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         User Role
//                       </label>
//                       <select
//                         value={filterRole}
//                         onChange={(e) => {
//                           setFilterRole(e.target.value);
//                           setCurrentPage(1);
//                         }}
//                         className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//                       >
//                         <option value="all">All Users</option>
//                         <option value="user">Customers Only</option>
//                         <option value="admin">Admins Only</option>
//                       </select>
//                     </div>
//                     <div className="flex items-end">
//                       {(searchTerm || filterRole !== "all") && (
//                         <button
//                           onClick={clearFilters}
//                           className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
//                         >
//                           Clear all filters
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Users Table - Desktop */}
//           <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//             {loading ? (
//               <div className="p-12 text-center">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <p className="mt-3 text-slate-500">Loading users...</p>
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-slate-50 border-b border-slate-200">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                           User
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                           Contact
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                           Role
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                           Joined
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-200">
//                       {currentUsers?.map((user) => {
//                         const regularAdminCount = users?.filter(
//                           (u) => u.role === "admin" && !u.isSuperAdmin
//                         ).length;
//                         const isLastRegularAdmin =
//                           user.role === "admin" &&
//                           !user.isSuperAdmin &&
//                           regularAdminCount === 1;

//                         return (
//                           <tr
//                             key={user._id}
//                             className="hover:bg-slate-50 transition-colors"
//                           >
//                             <td className="px-6 py-4">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                                   {user.name?.charAt(0).toUpperCase()}
//                                 </div>
//                                 <div>
//                                   <div className="font-medium text-slate-800">
//                                     {user.name}
//                                   </div>
//                                   <div className="text-xs text-slate-500">
//                                     ID: {user._id?.slice(-8)}
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4">
//                               <div className="space-y-1">
//                                 <div className="flex items-center gap-1 text-sm text-slate-600">
//                                   <Mail className="h-3.5 w-3.5" />
//                                   {user.email}
//                                 </div>
//                                 {user.phone && (
//                                   <div className="flex items-center gap-1 text-sm text-slate-500">
//                                     <Phone className="h-3.5 w-3.5" />
//                                     {user.phone}
//                                   </div>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4">
//                               <div className="flex items-center gap-2">
//                                 <select
//                                   value={user.role}
//                                   onChange={(e) =>
//                                     handleRoleChange(
//                                       user._id,
//                                       e.target.value,
//                                       user.isSuperAdmin
//                                     )
//                                   }
//                                   disabled={user.isSuperAdmin}
//                                   className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
//                                     user.role === "admin"
//                                       ? "bg-purple-100 text-purple-800 border-purple-200"
//                                       : "bg-blue-100 text-blue-800 border-blue-200"
//                                   } ${
//                                     user.isSuperAdmin
//                                       ? "opacity-60 cursor-not-allowed"
//                                       : "cursor-pointer hover:opacity-80"
//                                   }`}
//                                 >
//                                   <option value="user">Customer</option>
//                                   <option value="admin">Admin</option>
//                                 </select>
//                                 {user.isSuperAdmin && (
//                                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full font-semibold shadow-sm">
//                                     <Crown className="h-3 w-3" />
//                                     Super Admin
//                                   </span>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4">
//                               <div className="flex items-center gap-1 text-sm text-slate-500">
//                                 <Calendar className="h-3.5 w-3.5" />
//                                 {new Date(user.createdAt).toLocaleDateString(
//                                   "en-US",
//                                   {
//                                     year: "numeric",
//                                     month: "short",
//                                     day: "numeric",
//                                   }
//                                 )}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4">
//                               <button
//                                 onClick={() =>
//                                   handleDeleteUser(
//                                     user._id,
//                                     user.name,
//                                     user.isSuperAdmin,
//                                     user.role
//                                   )
//                                 }
//                                 className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//                                   isLastRegularAdmin || user.isSuperAdmin
//                                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                     : "bg-red-50 text-red-600 hover:bg-red-100"
//                                 }`}
//                                 disabled={isLastRegularAdmin || user.isSuperAdmin}
//                                 title={
//                                   user.isSuperAdmin
//                                     ? "Super Admin cannot be deleted"
//                                     : isLastRegularAdmin
//                                     ? "Cannot delete the only regular admin"
//                                     : "Delete user"
//                                 }
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                                 Delete
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {currentUsers?.length === 0 && !loading && (
//                   <div className="p-12 text-center">
//                     <div className="text-slate-400 mb-3">
//                       <UsersIcon className="h-12 w-12 mx-auto" />
//                     </div>
//                     <p className="text-slate-500 font-medium">No users found</p>
//                     {(searchTerm || filterRole !== "all") && (
//                       <button
//                         onClick={clearFilters}
//                         className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
//                       >
//                         Clear all filters
//                       </button>
//                     )}
//                   </div>
//                 )}

//                 {/* Pagination */}
//                 {filteredUsers?.length > 0 && totalPages > 1 && (
//                   <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50">
//                     <div className="text-sm text-slate-600">
//                       Showing {indexOfFirstItem + 1} to{" "}
//                       {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
//                       {filteredUsers.length} users
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setCurrentPage((prev) => Math.max(prev - 1, 1))
//                         }
//                         disabled={currentPage === 1}
//                         className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                       >
//                         <ChevronLeft className="h-5 w-5" />
//                       </button>
//                       <div className="flex gap-1">
//                         {Array.from(
//                           { length: Math.min(5, totalPages) },
//                           (_, i) => {
//                             let pageNum;
//                             if (totalPages <= 5) {
//                               pageNum = i + 1;
//                             } else if (currentPage <= 3) {
//                               pageNum = i + 1;
//                             } else if (currentPage >= totalPages - 2) {
//                               pageNum = totalPages - 4 + i;
//                             } else {
//                               pageNum = currentPage - 2 + i;
//                             }
//                             return (
//                               <button
//                                 key={pageNum}
//                                 onClick={() => setCurrentPage(pageNum)}
//                                 className={`px-3 py-2 rounded-lg transition-colors ${
//                                   currentPage === pageNum
//                                     ? "bg-blue-600 text-white"
//                                     : "hover:bg-white text-slate-600"
//                                 }`}
//                               >
//                                 {pageNum}
//                               </button>
//                             );
//                           }
//                         )}
//                       </div>
//                       <button
//                         onClick={() =>
//                           setCurrentPage((prev) =>
//                             Math.min(prev + 1, totalPages)
//                           )
//                         }
//                         disabled={currentPage === totalPages}
//                         className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                       >
//                         <ChevronRight className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Mobile Card View */}
//           <div className="lg:hidden space-y-4">
//             {loading ? (
//               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <p className="mt-3 text-slate-500">Loading users...</p>
//               </div>
//             ) : currentUsers?.length === 0 ? (
//               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
//                 <div className="text-slate-400 mb-3">
//                   <UsersIcon className="h-12 w-12 mx-auto" />
//                 </div>
//                 <p className="text-slate-500 font-medium">No users found</p>
//               </div>
//             ) : (
//               currentUsers?.map((user) => {
//                 const regularAdminCount = users?.filter(
//                   (u) => u.role === "admin" && !u.isSuperAdmin
//                 ).length;
//                 const isLastRegularAdmin =
//                   user.role === "admin" &&
//                   !user.isSuperAdmin &&
//                   regularAdminCount === 1;
//                 const isMenuOpen = mobileMenuOpen === user._id;

//                 return (
//                   <div
//                     key={user._id}
//                     className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//                           {user.name?.charAt(0).toUpperCase()}
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-slate-800">
//                             {user.name}
//                           </h3>
//                           <p className="text-xs text-slate-500">
//                             ID: {user._id?.slice(-8)}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="relative">
//                         <button
//                           onClick={() =>
//                             setMobileMenuOpen(isMenuOpen ? null : user._id)
//                           }
//                           className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
//                         >
//                           <MoreVertical className="h-5 w-5 text-slate-500" />
//                         </button>

//                         {isMenuOpen && (
//                           <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
//                             <button
//                               onClick={() =>
//                                 handleRoleChange(
//                                   user._id,
//                                   user.role === "admin" ? "user" : "admin",
//                                   user.isSuperAdmin
//                                 )
//                               }
//                               disabled={user.isSuperAdmin}
//                               className={`w-full text-left px-4 py-2 text-sm rounded-t-lg ${
//                                 user.isSuperAdmin
//                                   ? "text-gray-400 cursor-not-allowed"
//                                   : "text-slate-700 hover:bg-slate-50"
//                               }`}
//                             >
//                               Make {user.role === "admin" ? "Customer" : "Admin"}
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleDeleteUser(
//                                   user._id,
//                                   user.name,
//                                   user.isSuperAdmin,
//                                   user.role
//                                 )
//                               }
//                               disabled={isLastRegularAdmin || user.isSuperAdmin}
//                               className={`w-full text-left px-4 py-2 text-sm rounded-b-lg ${
//                                 isLastRegularAdmin || user.isSuperAdmin
//                                   ? "text-gray-400 cursor-not-allowed"
//                                   : "text-red-600 hover:bg-red-50"
//                               }`}
//                             >
//                               Delete User
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="space-y-2 mb-3">
//                       <div className="flex items-center gap-2 text-sm text-slate-600">
//                         <Mail className="h-4 w-4 flex-shrink-0" />
//                         <span className="break-all">{user.email}</span>
//                       </div>
//                       {user.phone && (
//                         <div className="flex items-center gap-2 text-sm text-slate-600">
//                           <Phone className="h-4 w-4 flex-shrink-0" />
//                           <span>{user.phone}</span>
//                         </div>
//                       )}
//                       <div className="flex items-center gap-2 text-sm text-slate-500">
//                         <Calendar className="h-4 w-4 flex-shrink-0" />
//                         <span>
//                           Joined:{" "}
//                           {new Date(user.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
//                       <span
//                         className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
//                           user.role === "admin"
//                             ? "bg-purple-100 text-purple-800"
//                             : "bg-blue-100 text-blue-800"
//                         }`}
//                       >
//                         {user.role === "admin" ? (
//                           <Shield className="h-3.5 w-3.5" />
//                         ) : (
//                           <User className="h-3.5 w-3.5" />
//                         )}
//                         {user.role === "admin" ? "Admin" : "Customer"}
//                       </span>
//                       {user.isSuperAdmin && (
//                         <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full font-semibold shadow-sm">
//                           <Crown className="h-3 w-3" />
//                           Super Admin
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}

//             {/* Mobile Pagination */}
//             {filteredUsers?.length > 0 && totalPages > 1 && (
//               <div className="flex justify-center gap-2 pt-4">
//                 <button
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.max(prev - 1, 1))
//                   }
//                   disabled={currentPage === 1}
//                   className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50"
//                 >
//                   <ChevronLeft className="h-5 w-5" />
//                 </button>
//                 <span className="px-4 py-2 text-sm text-slate-600">
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                   }
//                   disabled={currentPage === totalPages}
//                   className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50"
//                 >
//                   <ChevronRight className="h-5 w-5" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  User,
  Shield,
  Calendar,
  Mail,
  Phone,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  MoreVertical,
  Crown,
} from "lucide-react";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser,
} from "../../features/auth/authSlice";
import toast from "react-hot-toast";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);

  const handleRoleChange = async (userId, newRole, isSuperAdmin) => {
    if (isSuperAdmin) {
      toast.error("Super Admin cannot be modified from the frontend");
      return;
    }

    const result = await dispatch(
      updateUserRole({ id: userId, role: newRole })
    );
    if (updateUserRole.fulfilled.match(result)) {
      toast.success(`User role updated to ${newRole}`);
    } else {
      toast.error(result.payload || "Failed to update user role");
    }
    setMobileMenuOpen(null);
  };

  const handleDeleteUser = async (userId, userName, isSuperAdmin, userRole) => {
    if (isSuperAdmin) {
      toast.error("Super Admin cannot be deleted from the frontend");
      return;
    }

    const regularAdminCount = users?.filter(
      (u) => u.role === "admin" && !u.isSuperAdmin
    ).length;
    const isLastRegularAdmin = userRole === "admin" && regularAdminCount === 1;

    if (isLastRegularAdmin) {
      toast.error(
        "Cannot delete the only regular admin. Create another admin first."
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete "${userName}"? This action cannot be undone.`
      )
    ) {
      const result = await dispatch(deleteUser(userId));
      if (deleteUser.fulfilled.match(result)) {
        toast.success("User deleted successfully");
      } else {
        toast.error(result.payload || "Failed to delete user");
      }
    }
    setMobileMenuOpen(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRole("all");
    setCurrentPage(1);
  };

  const stats = {
    total: filteredUsers?.length || 0,
    customers: filteredUsers?.filter((u) => u.role === "user").length || 0,
    admins: filteredUsers?.filter((u) => u.role === "admin").length || 0,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 sticky top-0 z-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Manage Users</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Manage user roles and permissions</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Overview */}
        {filteredUsers?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500">Total Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500">Customers</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.customers}</p>
                </div>
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500">Admins</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.admins}</p>
                </div>
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
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
                  placeholder="Search users by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-700"
              >
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Filters</span>
                {filterRole !== "all" && (
                  <span className="ml-1 bg-slate-800 text-white text-xs px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                      User Role
                    </label>
                    <select
                      value={filterRole}
                      onChange={(e) => {
                        setFilterRole(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none bg-white"
                    >
                      <option value="all">All Users</option>
                      <option value="user">Customers Only</option>
                      <option value="admin">Admins Only</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    {(searchTerm || filterRole !== "all") && (
                      <button
                        onClick={clearFilters}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-600 hover:text-slate-800 transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-slate-800"></div>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500">Loading users...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentUsers?.map((user) => {
                      const regularAdminCount = users?.filter(
                        (u) => u.role === "admin" && !u.isSuperAdmin
                      ).length;
                      const isLastRegularAdmin =
                        user.role === "admin" &&
                        !user.isSuperAdmin &&
                        regularAdminCount === 1;

                      return (
                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-slate-800 text-sm sm:text-base">{user.name}</div>
                                <div className="text-xs text-slate-500">ID: {user._id?.slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="space-y-0.5 sm:space-y-1">
                              <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
                                <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                <span className="break-all">{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
                                  <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <select
                                value={user.role}
                                onChange={(e) =>
                                  handleRoleChange(
                                    user._id,
                                    e.target.value,
                                    user.isSuperAdmin
                                  )
                                }
                                disabled={user.isSuperAdmin}
                                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-800 border-purple-200"
                                    : "bg-blue-100 text-blue-800 border-blue-200"
                                } ${
                                  user.isSuperAdmin
                                    ? "opacity-60 cursor-not-allowed"
                                    : "cursor-pointer hover:opacity-80"
                                }`}
                              >
                                <option value="user">Customer</option>
                                <option value="admin">Admin</option>
                              </select>
                              {user.isSuperAdmin && (
                                <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full font-semibold shadow-sm">
                                  <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  Super Admin
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
                              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                              <span className="whitespace-nowrap">
                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <button
                              onClick={() =>
                                handleDeleteUser(
                                  user._id,
                                  user.name,
                                  user.isSuperAdmin,
                                  user.role
                                )
                              }
                              className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                isLastRegularAdmin || user.isSuperAdmin
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : "bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                              disabled={isLastRegularAdmin || user.isSuperAdmin}
                              title={
                                user.isSuperAdmin
                                  ? "Super Admin cannot be deleted"
                                  : isLastRegularAdmin
                                  ? "Cannot delete the only regular admin"
                                  : "Delete user"
                              }
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {currentUsers?.length === 0 && !loading && (
                <div className="p-8 sm:p-12 text-center">
                  <div className="text-slate-400 mb-3">
                    <UsersIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
                  </div>
                  <p className="text-sm sm:text-base text-slate-500 font-medium">No users found</p>
                  {(searchTerm || filterRole !== "all") && (
                    <button
                      onClick={clearFilters}
                      className="mt-2 sm:mt-3 text-slate-600 hover:text-slate-700 text-xs sm:text-sm font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {filteredUsers?.length > 0 && totalPages > 1 && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50">
                  <div className="text-xs sm:text-sm text-slate-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 sm:p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                    </button>
                    <div className="flex gap-0.5 sm:gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-2.5 sm:px-3 py-1 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                              currentPage === pageNum
                                ? "bg-slate-800 text-white"
                                : "hover:bg-white text-slate-600"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 sm:p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3 sm:space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-slate-800"></div>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500">Loading users...</p>
            </div>
          ) : currentUsers?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
              <div className="text-slate-400 mb-3">
                <UsersIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
              </div>
              <p className="text-sm sm:text-base text-slate-500 font-medium">No users found</p>
            </div>
          ) : (
            currentUsers?.map((user) => {
              const regularAdminCount = users?.filter(
                (u) => u.role === "admin" && !u.isSuperAdmin
              ).length;
              const isLastRegularAdmin =
                user.role === "admin" &&
                !user.isSuperAdmin &&
                regularAdminCount === 1;
              const isMenuOpen = mobileMenuOpen === user._id;

              return (
                <div key={user._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{user.name}</h3>
                        <p className="text-xs text-slate-500">ID: {user._id?.slice(-8)}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMobileMenuOpen(isMenuOpen ? null : user._id)}
                        className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                          <button
                            onClick={() =>
                              handleRoleChange(
                                user._id,
                                user.role === "admin" ? "user" : "admin",
                                user.isSuperAdmin
                              )
                            }
                            disabled={user.isSuperAdmin}
                            className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-t-lg ${
                              user.isSuperAdmin
                                ? "text-slate-400 cursor-not-allowed"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            Make {user.role === "admin" ? "Customer" : "Admin"}
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(
                                user._id,
                                user.name,
                                user.isSuperAdmin,
                                user.role
                              )
                            }
                            disabled={isLastRegularAdmin || user.isSuperAdmin}
                            className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-b-lg ${
                              isLastRegularAdmin || user.isSuperAdmin
                                ? "text-slate-400 cursor-not-allowed"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                          >
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-all">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {user.role === "admin" ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {user.role === "admin" ? "Admin" : "Customer"}
                    </span>
                    {user.isSuperAdmin && (
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full font-semibold shadow-sm">
                        <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        Super Admin
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Mobile Pagination */}
          {filteredUsers?.length > 0 && totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;