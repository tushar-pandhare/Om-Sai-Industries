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
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 sticky top-0 z-10">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Manage Users</h1>
//           <p className="text-sm sm:text-base text-slate-500 mt-1">Manage user roles and permissions</p>
//         </div>
//       </div>

//       <div className="p-4 sm:p-6 lg:p-8">
//         {/* Stats Overview */}
//         {filteredUsers?.length > 0 && (
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm text-slate-500">Total Users</p>
//                   <p className="text-xl sm:text-2xl font-bold text-slate-800">{stats.total}</p>
//                 </div>
//                 <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
//                   <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm text-slate-500">Customers</p>
//                   <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.customers}</p>
//                 </div>
//                 <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
//                   <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm text-slate-500">Admins</p>
//                   <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.admins}</p>
//                 </div>
//                 <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
//                   <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Search and Filters */}
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
//           <div className="p-3 sm:p-4">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search users by name, email, or phone..."
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none"
//                 />
//               </div>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-700"
//               >
//                 <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
//                 <span className="hidden sm:inline">Filters</span>
//                 {filterRole !== "all" && (
//                   <span className="ml-1 bg-slate-800 text-white text-xs px-1.5 py-0.5 rounded-full">
//                     Active
//                   </span>
//                 )}
//               </button>
//             </div>

//             {/* Expanded Filters */}
//             {showFilters && (
//               <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   <div>
//                     <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
//                       User Role
//                     </label>
//                     <select
//                       value={filterRole}
//                       onChange={(e) => {
//                         setFilterRole(e.target.value);
//                         setCurrentPage(1);
//                       }}
//                       className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none bg-white"
//                     >
//                       <option value="all">All Users</option>
//                       <option value="user">Customers Only</option>
//                       <option value="admin">Admins Only</option>
//                     </select>
//                   </div>
//                   <div className="flex items-end">
//                     {(searchTerm || filterRole !== "all") && (
//                       <button
//                         onClick={clearFilters}
//                         className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-600 hover:text-slate-800 transition-colors"
//                       >
//                         Clear all filters
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Users Table - Desktop */}
//         <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//           {loading ? (
//             <div className="p-8 sm:p-12 text-center">
//               <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-slate-800"></div>
//               <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500">Loading users...</p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[800px]">
//                   <thead className="bg-slate-50 border-b border-slate-200">
//                     <tr>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                         User
//                       </th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                         Contact
//                       </th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                         Role
//                       </th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                         Joined
//                       </th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200">
//                     {currentUsers?.map((user) => {
//                       const regularAdminCount = users?.filter(
//                         (u) => u.role === "admin" && !u.isSuperAdmin
//                       ).length;
//                       const isLastRegularAdmin =
//                         user.role === "admin" &&
//                         !user.isSuperAdmin &&
//                         regularAdminCount === 1;

//                       return (
//                         <tr key={user._id} className="hover:bg-slate-50 transition-colors">
//                           <td className="px-4 sm:px-6 py-3 sm:py-4">
//                             <div className="flex items-center gap-2 sm:gap-3">
//                               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
//                                 {user.name?.charAt(0).toUpperCase()}
//                               </div>
//                               <div>
//                                 <div className="font-medium text-slate-800 text-sm sm:text-base">{user.name}</div>
//                                 <div className="text-xs text-slate-500">ID: {user._id?.slice(-8)}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-4 sm:px-6 py-3 sm:py-4">
//                             <div className="space-y-0.5 sm:space-y-1">
//                               <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
//                                 <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
//                                 <span className="break-all">{user.email}</span>
//                               </div>
//                               {user.phone && (
//                                 <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
//                                   <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
//                                   <span>{user.phone}</span>
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-4 sm:px-6 py-3 sm:py-4">
//                             <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
//                               <select
//                                 value={user.role}
//                                 onChange={(e) =>
//                                   handleRoleChange(
//                                     user._id,
//                                     e.target.value,
//                                     user.isSuperAdmin
//                                   )
//                                 }
//                                 disabled={user.isSuperAdmin}
//                                 className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
//                                   user.role === "admin"
//                                     ? "bg-purple-100 text-purple-800 border-purple-200"
//                                     : "bg-blue-100 text-blue-800 border-blue-200"
//                                 } ${
//                                   user.isSuperAdmin
//                                     ? "opacity-60 cursor-not-allowed"
//                                     : "cursor-pointer hover:opacity-80"
//                                 }`}
//                               >
//                                 <option value="user">Customer</option>
//                                 <option value="admin">Admin</option>
//                               </select>
//                               {user.isSuperAdmin && (
//                                 <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full font-semibold shadow-sm">
//                                   <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
//                                   Super Admin
//                                 </span>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-4 sm:px-6 py-3 sm:py-4">
//                             <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500">
//                               <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
//                               <span className="whitespace-nowrap">
//                                 {new Date(user.createdAt).toLocaleDateString("en-US", {
//                                   year: "numeric",
//                                   month: "short",
//                                   day: "numeric",
//                                 })}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-4 sm:px-6 py-3 sm:py-4">
//                             <button
//                               onClick={() =>
//                                 handleDeleteUser(
//                                   user._id,
//                                   user.name,
//                                   user.isSuperAdmin,
//                                   user.role
//                                 )
//                               }
//                               className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
//                                 isLastRegularAdmin || user.isSuperAdmin
//                                   ? "bg-slate-100 text-slate-400 cursor-not-allowed"
//                                   : "bg-red-50 text-red-600 hover:bg-red-100"
//                               }`}
//                               disabled={isLastRegularAdmin || user.isSuperAdmin}
//                               title={
//                                 user.isSuperAdmin
//                                   ? "Super Admin cannot be deleted"
//                                   : isLastRegularAdmin
//                                   ? "Cannot delete the only regular admin"
//                                   : "Delete user"
//                               }
//                             >
//                               <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {currentUsers?.length === 0 && !loading && (
//                 <div className="p-8 sm:p-12 text-center">
//                   <div className="text-slate-400 mb-3">
//                     <UsersIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
//                   </div>
//                   <p className="text-sm sm:text-base text-slate-500 font-medium">No users found</p>
//                   {(searchTerm || filterRole !== "all") && (
//                     <button
//                       onClick={clearFilters}
//                       className="mt-2 sm:mt-3 text-slate-600 hover:text-slate-700 text-xs sm:text-sm font-medium"
//                     >
//                       Clear all filters
//                     </button>
//                   )}
//                 </div>
//               )}

//               {/* Pagination */}
//               {filteredUsers?.length > 0 && totalPages > 1 && (
//                 <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50">
//                   <div className="text-xs sm:text-sm text-slate-600">
//                     Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
//                   </div>
//                   <div className="flex gap-1 sm:gap-2">
//                     <button
//                       onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="p-1.5 sm:p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <ChevronLeft className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
//                     </button>
//                     <div className="flex gap-0.5 sm:gap-1">
//                       {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                         let pageNum;
//                         if (totalPages <= 5) {
//                           pageNum = i + 1;
//                         } else if (currentPage <= 3) {
//                           pageNum = i + 1;
//                         } else if (currentPage >= totalPages - 2) {
//                           pageNum = totalPages - 4 + i;
//                         } else {
//                           pageNum = currentPage - 2 + i;
//                         }
//                         return (
//                           <button
//                             key={pageNum}
//                             onClick={() => setCurrentPage(pageNum)}
//                             className={`px-2.5 sm:px-3 py-1 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
//                               currentPage === pageNum
//                                 ? "bg-slate-800 text-white"
//                                 : "hover:bg-white text-slate-600"
//                             }`}
//                           >
//                             {pageNum}
//                           </button>
//                         );
//                       })}
//                     </div>
//                     <button
//                       onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="p-1.5 sm:p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <ChevronRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Mobile Card View */}
//         <div className="lg:hidden space-y-3 sm:space-y-4">
//           {loading ? (
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
//               <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-slate-800"></div>
//               <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500">Loading users...</p>
//             </div>
//           ) : currentUsers?.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
//               <div className="text-slate-400 mb-3">
//                 <UsersIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
//               </div>
//               <p className="text-sm sm:text-base text-slate-500 font-medium">No users found</p>
//             </div>
//           ) : (
//             currentUsers?.map((user) => {
//               const regularAdminCount = users?.filter(
//                 (u) => u.role === "admin" && !u.isSuperAdmin
//               ).length;
//               const isLastRegularAdmin =
//                 user.role === "admin" &&
//                 !user.isSuperAdmin &&
//                 regularAdminCount === 1;
//               const isMenuOpen = mobileMenuOpen === user._id;

//               return (
//                 <div key={user._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg">
//                         {user.name?.charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{user.name}</h3>
//                         <p className="text-xs text-slate-500">ID: {user._id?.slice(-8)}</p>
//                       </div>
//                     </div>
//                     <div className="relative">
//                       <button
//                         onClick={() => setMobileMenuOpen(isMenuOpen ? null : user._id)}
//                         className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
//                       >
//                         <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
//                       </button>

//                       {isMenuOpen && (
//                         <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
//                           <button
//                             onClick={() =>
//                               handleRoleChange(
//                                 user._id,
//                                 user.role === "admin" ? "user" : "admin",
//                                 user.isSuperAdmin
//                               )
//                             }
//                             disabled={user.isSuperAdmin}
//                             className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-t-lg ${
//                               user.isSuperAdmin
//                                 ? "text-slate-400 cursor-not-allowed"
//                                 : "text-slate-700 hover:bg-slate-50"
//                             }`}
//                           >
//                             Make {user.role === "admin" ? "Customer" : "Admin"}
//                           </button>
//                           <button
//                             onClick={() =>
//                               handleDeleteUser(
//                                 user._id,
//                                 user.name,
//                                 user.isSuperAdmin,
//                                 user.role
//                               )
//                             }
//                             disabled={isLastRegularAdmin || user.isSuperAdmin}
//                             className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-b-lg ${
//                               isLastRegularAdmin || user.isSuperAdmin
//                                 ? "text-slate-400 cursor-not-allowed"
//                                 : "text-red-600 hover:bg-red-50"
//                             }`}
//                           >
//                             Delete User
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="space-y-1.5 sm:space-y-2 mb-3">
//                     <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
//                       <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//                       <span className="break-all">{user.email}</span>
//                     </div>
//                     {user.phone && (
//                       <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
//                         <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//                         <span>{user.phone}</span>
//                       </div>
//                     )}
//                     <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
//                       <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//                       <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   </div>

//                   <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
//                     <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
//                       user.role === "admin"
//                         ? "bg-purple-100 text-purple-800"
//                         : "bg-blue-100 text-blue-800"
//                     }`}>
//                       {user.role === "admin" ? (
//                         <Shield className="h-3 w-3" />
//                       ) : (
//                         <User className="h-3 w-3" />
//                       )}
//                       {user.role === "admin" ? "Admin" : "Customer"}
//                     </span>
//                     {user.isSuperAdmin && (
//                       <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full font-semibold shadow-sm">
//                         <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
//                         Super Admin
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )}

//           {/* Mobile Pagination */}
//           {filteredUsers?.length > 0 && totalPages > 1 && (
//             <div className="flex justify-center gap-2 pt-4">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="p-1.5 sm:p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50"
//               >
//                 <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
//               </button>
//               <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-600">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className="p-1.5 sm:p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50"
//               >
//                 <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft,
  Edit2,
  X
} from "lucide-react";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser,
} from "../../features/auth/authSlice";
import toast from "react-hot-toast";

// Stat Card Component - Matching AddProduct card style
const StatCard = ({ title, value, icon: Icon, bgColor }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);

  const handleRoleChange = async (userId, newRole, isSuperAdmin) => {
    if (isSuperAdmin) {
      toast.error("Super Admin cannot be modified");
      return;
    }

    const result = await dispatch(updateUserRole({ id: userId, role: newRole }));
    if (updateUserRole.fulfilled.match(result)) {
      toast.success(`User role updated to ${newRole === 'admin' ? 'Admin' : 'Customer'}`);
    } else {
      toast.error(result.payload || "Failed to update user role");
    }
    setShowRoleModal(false);
    setSelectedUser(null);
    setMobileMenuOpen(null);
  };

  const handleDeleteUser = async (userId, userName, isSuperAdmin, userRole) => {
    if (isSuperAdmin) {
      toast.error("Super Admin cannot be deleted");
      return;
    }

    const regularAdminCount = users?.filter(
      (u) => u.role === "admin" && !u.isSuperAdmin
    ).length;
    const isLastRegularAdmin = userRole === "admin" && regularAdminCount === 1;

    if (isLastRegularAdmin) {
      toast.error("Cannot delete the only regular admin. Create another admin first.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
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

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
    setMobileMenuOpen(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Matching AddProduct style */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                <p className="text-sm text-gray-500 mt-1">Manage user roles and permissions</p>
              </div>
            </div>
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">{users?.length || 0} Total Users</span>
            </div>
          </div>
          
          {/* Breadcrumb - Matching AddProduct style */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 ml-12">
            <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/admin')}>Dashboard</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Users</span>
          </div>
        </div>
        
        {/* Stats Overview - Matching card style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <StatCard title="Total Users" value={stats.total} icon={UsersIcon} bgColor="bg-gradient-to-r from-blue-600 to-blue-700" />
          <StatCard title="Customers" value={stats.customers} icon={User} bgColor="bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <StatCard title="Administrators" value={stats.admins} icon={Shield} bgColor="bg-gradient-to-r from-purple-500 to-purple-600" />
        </div>
        
        {/* Search and Filter Card - Matching AddProduct card style */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <UsersIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                <p className="text-xs text-gray-500">Search, filter and manage system users</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium ${
                  showFilters 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {filterRole !== "all" && (
                  <span className="ml-1 bg-white text-blue-600 text-xs px-1.5 py-0.5 rounded-full">1</span>
                )}
              </button>
            </div>
            
            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
                    <select
                      value={filterRole}
                      onChange={(e) => {
                        setFilterRole(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all"
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
                        className="px-4 py-2.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
        
        {/* Users Table Card - Desktop */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <UsersIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">User Directory</h2>
                <p className="text-xs text-gray-500">Complete list of registered users</p>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading users...</p>
            </div>
          ) : currentUsers?.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No users found</p>
              {(searchTerm || filterRole !== "all") && (
                <button onClick={clearFilters} className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentUsers?.map((user) => {
                      const regularAdminCount = users?.filter((u) => u.role === "admin" && !u.isSuperAdmin).length;
                      const isLastRegularAdmin = user.role === "admin" && !user.isSuperAdmin && regularAdminCount === 1;

                      return (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</div>
                                <div className="text-xs text-gray-500">ID: {user._id?.slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                <span className="break-all">{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                                user.role === "admin"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {user.role === "admin" ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                                {user.role === "admin" ? "Admin" : "Customer"}
                              </span>
                              {user.isSuperAdmin && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full font-semibold shadow-sm">
                                  <Crown className="h-3 w-3" />
                                  Super Admin
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span className="whitespace-nowrap">
                                {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openRoleModal(user)}
                                disabled={user.isSuperAdmin}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  user.isSuperAdmin
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                }`}
                                title={user.isSuperAdmin ? "Super Admin role cannot be changed" : "Change user role"}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                Change Role
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id, user.name, user.isSuperAdmin, user.role)}
                                disabled={isLastRegularAdmin || user.isSuperAdmin}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  isLastRegularAdmin || user.isSuperAdmin
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-red-50 text-red-600 hover:bg-red-100"
                                }`}
                                title={user.isSuperAdmin ? "Super Admin cannot be deleted" : isLastRegularAdmin ? "Cannot delete the only regular admin" : "Delete user"}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination - Matching AddProduct style */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex gap-1">
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
                            className={`min-w-[36px] h-9 rounded-xl transition-all duration-200 text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                                : 'hover:bg-white text-gray-600 border border-gray-300'
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
                      className="p-2 border border-gray-300 rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Card View - Matching AddProduct mobile style */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading users...</p>
            </div>
          ) : currentUsers?.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No users found</p>
            </div>
          ) : (
            currentUsers?.map((user) => {
              const regularAdminCount = users?.filter((u) => u.role === "admin" && !u.isSuperAdmin).length;
              const isLastRegularAdmin = user.role === "admin" && !user.isSuperAdmin && regularAdminCount === 1;
              const isMenuOpen = mobileMenuOpen === user._id;

              return (
                <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-md">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-xs text-gray-500">ID: {user._id?.slice(-8)}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button onClick={() => setMobileMenuOpen(isMenuOpen ? null : user._id)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>
                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden">
                          <button
                            onClick={() => openRoleModal(user)}
                            disabled={user.isSuperAdmin}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 ${
                              user.isSuperAdmin ? "text-gray-400 cursor-not-allowed bg-gray-50" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Edit2 className="h-4 w-4" />
                            Change Role
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name, user.isSuperAdmin, user.role)}
                            disabled={isLastRegularAdmin || user.isSuperAdmin}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 ${
                              isLastRegularAdmin || user.isSuperAdmin ? "text-gray-400 cursor-not-allowed bg-gray-50" : "text-red-600 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="break-all">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                      user.role === "admin" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {user.role === "admin" ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                      {user.role === "admin" ? "Admin" : "Customer"}
                    </span>
                    {user.isSuperAdmin && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full font-semibold shadow-sm">
                        <Crown className="h-3 w-3" />
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
                className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Role Change Modal - Matching AddProduct modal style */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Change User Role</h3>
                  <p className="text-xs text-gray-500">Update permissions for {selectedUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select New Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleRoleChange(selectedUser._id, "user", selectedUser.isSuperAdmin)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedUser.role === "user"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <User className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <p className="font-medium text-gray-900">Customer</p>
                    <p className="text-xs text-gray-500">Standard user access</p>
                  </button>
                  <button
                    onClick={() => handleRoleChange(selectedUser._id, "admin", selectedUser.isSuperAdmin)}
                    disabled={selectedUser.isSuperAdmin}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedUser.isSuperAdmin
                        ? "opacity-50 cursor-not-allowed border-gray-200"
                        : selectedUser.role === "admin"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <p className="font-medium text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">Full system access</p>
                  </button>
                </div>
                {selectedUser.isSuperAdmin && (
                  <p className="text-xs text-amber-600 mt-3 text-center">Super Admin role cannot be changed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Users;