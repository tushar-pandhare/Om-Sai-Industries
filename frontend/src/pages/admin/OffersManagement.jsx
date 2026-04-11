// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   X, Edit, Trash2, Plus, Tag, Calendar, Percent, DollarSign, 
//   Package, TrendingUp, Clock, Gift, Zap, Filter, Search,
//   CheckCircle, AlertCircle, Layers, ChevronLeft, ChevronRight
// } from 'lucide-react';
// import { fetchOffers, createOffer, updateOffer, deleteOffer } from '../../features/offers/offerSlice';
// import { fetchProducts } from '../../features/prdoducts/productSlice';
// import toast from 'react-hot-toast';

// // Stat Card Component
// const StatCard = ({ title, value, icon: Icon, color, trend }) => (
//   <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md hover:border-gray-200">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium text-gray-500 tracking-wide">{title}</p>
//         <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{value}</p>
//       </div>
//       <div className={`p-3 rounded-xl ${color.bg} ${color.text} transition-transform group-hover:scale-105`}>
//         <Icon className="h-5 w-5" />
//       </div>
//     </div>
//     {trend && (
//       <div className="flex items-center gap-1 mt-4 text-xs font-medium">
//         <TrendingUp className="h-3 w-3 text-green-500" />
//         <span className="text-green-600">+{trend}%</span>
//         <span className="text-gray-400 ml-1">vs last month</span>
//       </div>
//     )}
//   </div>
// );

// // Offer Card Component
// const OfferCard = ({ offer, onEdit, onDelete }) => {
//   const isActive = new Date(offer.endDate) > new Date();
//   const remainingDays = Math.ceil((new Date(offer.endDate) - new Date()) / (1000 * 60 * 60 * 24));
//   const progress = ((new Date() - new Date(offer.startDate)) / (new Date(offer.endDate) - new Date(offer.startDate))) * 100;
  
//   return (
//     <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//       {/* Status Bar */}
//       <div className="relative h-1 bg-gray-100">
//         <div 
//           className={`absolute top-0 left-0 h-full transition-all duration-500 ${isActive ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gray-400'}`}
//           style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
//         />
//       </div>
      
//       <div className="p-5">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 mb-2">
//               <div className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-50' : 'bg-gray-100'}`}>
//                 <Gift className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
//               </div>
//               <h3 className="font-semibold text-gray-900 text-lg break-words">{offer.title}</h3>
//             </div>
//             {offer.description && (
//               <p className="text-gray-500 text-sm line-clamp-2">{offer.description}</p>
//             )}
//           </div>
//           <div className="flex gap-1 ml-3">
//             <button
//               onClick={() => onEdit(offer)}
//               className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//               title="Edit Offer"
//             >
//               <Edit className="h-4 w-4" />
//             </button>
//             <button
//               onClick={() => onDelete(offer._id, offer.title)}
//               className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
//               title="Delete Offer"
//             >
//               <Trash2 className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
        
//         {/* Discount Badge */}
//         <div className="mb-4">
//           <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold
//             ${offer.discountType === 'percentage' 
//               ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200' 
//               : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200'
//             }
//           `}>
//             {offer.discountType === 'percentage' ? (
//               <Percent className="h-4 w-4" />
//             ) : (
//               <DollarSign className="h-4 w-4" />
//             )}
//             {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue.toLocaleString()} OFF`}
//           </div>
//         </div>
        
//         {/* Details */}
//         <div className="space-y-2 mb-4">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Calendar className="h-4 w-4 text-gray-400" />
//             <span>
//               {new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
//               {' - '}
//               {new Date(offer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//             </span>
//           </div>
          
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Package className="h-4 w-4 text-gray-400" />
//             <span>
//               {!offer.applicableProducts || offer.applicableProducts?.length === 0 
//                 ? 'Applies to all products' 
//                 : `Applied to ${offer.applicableProducts.length} product(s)`
//               }
//             </span>
//           </div>
//         </div>
        
//         {/* Status Footer */}
//         <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//           {isActive ? (
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
//                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute" />
//               </div>
//               <span className="text-sm font-medium text-emerald-700">
//                 {remainingDays} day{remainingDays !== 1 ? 's' : ''} remaining
//               </span>
//             </div>
//           ) : (
//             <div className="flex items-center gap-2">
//               <Clock className="h-4 w-4 text-gray-400" />
//               <span className="text-sm text-gray-500">Expired</span>
//             </div>
//           )}
//           <div className="text-xs text-gray-400">
//             ID: {offer._id.slice(-6)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const OffersManagement = () => {
//   const dispatch = useDispatch();
//   const { offers, loading } = useSelector((state) => state.offers);
//   const { products } = useSelector((state) => state.products);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingOffer, setEditingOffer] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(6);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     discountType: 'percentage',
//     discountValue: '',
//     startDate: '',
//     endDate: '',
//     applicableProducts: []
//   });

//   useEffect(() => {
//     dispatch(fetchOffers());
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   // Filter offers
//   const filteredOffers = offers?.filter(offer => {
//     const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           offer.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     const isActive = new Date(offer.endDate) > new Date();
//     const matchesStatus = filterStatus === 'all' || 
//                          (filterStatus === 'active' && isActive) ||
//                          (filterStatus === 'expired' && !isActive);
//     return matchesSearch && matchesStatus;
//   });

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentOffers = filteredOffers?.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredOffers?.length / itemsPerPage);

//   // Stats
//   const stats = {
//     total: offers?.length || 0,
//     active: offers?.filter(offer => new Date(offer.endDate) > new Date()).length || 0,
//     expired: offers?.filter(offer => new Date(offer.endDate) <= new Date()).length || 0,
//     totalDiscount: offers?.reduce((sum, offer) => sum + offer.discountValue, 0) || 0
//   };

//   const handleOpenModal = (offer = null) => {
//     if (offer) {
//       setEditingOffer(offer);
//       // Get the product IDs that are already associated with this offer
//       const existingProductIds = offer.applicableProducts?.map(p => p._id || p) || [];
      
//       setFormData({
//         title: offer.title || '',
//         description: offer.description || '',
//         discountType: offer.discountType || 'percentage',
//         discountValue: offer.discountValue || '',
//         startDate: offer.startDate ? new Date(offer.startDate).toISOString().slice(0, 16) : '',
//         endDate: offer.endDate ? new Date(offer.endDate).toISOString().slice(0, 16) : '',
//         applicableProducts: existingProductIds
//       });
//     } else {
//       setEditingOffer(null);
//       setFormData({
//         title: '',
//         description: '',
//         discountType: 'percentage',
//         discountValue: '',
//         startDate: '',
//         endDate: '',
//         applicableProducts: []
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingOffer(null);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleProductToggle = (productId) => {
//     setFormData(prev => ({
//       ...prev,
//       applicableProducts: prev.applicableProducts.includes(productId)
//         ? prev.applicableProducts.filter(id => id !== productId)
//         : [...prev.applicableProducts, productId]
//     }));
//   };

//   const handleSelectAllProducts = () => {
//     if (formData.applicableProducts.length === products?.length) {
//       setFormData(prev => ({ ...prev, applicableProducts: [] }));
//     } else {
//       setFormData(prev => ({ 
//         ...prev, 
//         applicableProducts: products?.map(p => p._id) || [] 
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.title.trim()) {
//       return toast.error('Offer title is required');
//     }
    
//     if (!formData.discountValue || formData.discountValue <= 0) {
//       return toast.error('Please enter a valid discount value');
//     }
    
//     if (!formData.startDate || !formData.endDate) {
//       return toast.error('Please select start and end dates');
//     }
    
//     if (new Date(formData.startDate) >= new Date(formData.endDate)) {
//       return toast.error('End date must be after start date');
//     }
    
//     const offerData = {
//       title: formData.title,
//       description: formData.description,
//       discountType: formData.discountType,
//       discountValue: Number(formData.discountValue),
//       startDate: new Date(formData.startDate).toISOString(),
//       endDate: new Date(formData.endDate).toISOString(),
//       applicableProducts: formData.applicableProducts
//     };
    
//     try {
//       if (editingOffer) {
//         const result = await dispatch(updateOffer({ id: editingOffer._id, offerData }));
//         if (updateOffer.fulfilled.match(result)) {
//           toast.success('Offer updated successfully');
//           handleCloseModal();
//         } else {
//           toast.error('Failed to update offer');
//         }
//       } else {
//         const result = await dispatch(createOffer(offerData));
//         if (createOffer.fulfilled.match(result)) {
//           toast.success('Offer created successfully');
//           handleCloseModal();
//         } else {
//           toast.error('Failed to create offer');
//         }
//       }
//     } catch (error) {
//       toast.error('Something went wrong');
//     }
//   };

//   const handleDelete = async (id, offerTitle) => {
//     if (window.confirm(`Are you sure you want to delete "${offerTitle}"? This action cannot be undone.`)) {
//       const result = await dispatch(deleteOffer(id));
//       if (deleteOffer.fulfilled.match(result)) {
//         toast.success('Offer deleted successfully');
//       } else {
//         toast.error('Failed to delete offer');
//       }
//     }
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterStatus('all');
//     setCurrentPage(1);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
//         <div className="px-4 sm:px-6 lg:px-8 py-5">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//                 Offers & Discounts
//               </h1>
//               <p className="text-sm text-gray-500 mt-1">Create and manage promotional offers to boost sales</p>
//             </div>
//             <button
//               onClick={() => handleOpenModal()}
//               className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gray-200 hover:shadow-xl transform hover:-translate-y-0.5"
//             >
//               <Plus className="h-4 w-4" />
//               Create New Offer
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="px-4 sm:px-6 lg:px-8 py-6">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <StatCard title="Total Offers" value={stats.total} icon={Tag} color={{ bg: 'bg-gradient-to-r from-gray-700 to-gray-900', text: 'text-white' }} trend="12" />
//           <StatCard title="Active Offers" value={stats.active} icon={Zap} color={{ bg: 'bg-gradient-to-r from-emerald-500 to-emerald-700', text: 'text-white' }} trend="8" />
//           <StatCard title="Expired Offers" value={stats.expired} icon={Clock} color={{ bg: 'bg-gradient-to-r from-gray-500 to-gray-700', text: 'text-white' }} />
//           <StatCard title="Total Discount" value={`₹${(stats.totalDiscount / 1000).toFixed(0)}K`} icon={DollarSign} color={{ bg: 'bg-gradient-to-r from-blue-500 to-blue-700', text: 'text-white' }} />
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
//           <div className="p-5">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search offers by title or description..."
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none"
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => {
//                     setFilterStatus(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none bg-white"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active Only</option>
//                   <option value="expired">Expired Only</option>
//                 </select>
//                 {(searchTerm || filterStatus !== 'all') && (
//                   <button
//                     onClick={clearFilters}
//                     className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
//                   >
//                     Clear
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Offers Grid */}
//         {loading ? (
//           <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//             <p className="mt-3 text-gray-500">Loading offers...</p>
//           </div>
//         ) : filteredOffers?.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
//             <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Gift className="h-10 w-10 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">No offers found</h3>
//             <p className="text-gray-500 text-sm">
//               {searchTerm || filterStatus !== 'all' 
//                 ? "Try adjusting your search or filters" 
//                 : "Get started by creating your first promotional offer"}
//             </p>
//             {(searchTerm || filterStatus !== 'all') ? (
//               <button
//                 onClick={clearFilters}
//                 className="mt-4 text-sm text-gray-600 hover:text-gray-900 font-medium"
//               >
//                 Clear all filters
//               </button>
//             ) : (
//               <button
//                 onClick={() => handleOpenModal()}
//                 className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
//               >
//                 <Plus className="h-4 w-4" />
//                 Create Offer
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {currentOffers?.map((offer) => (
//                 <OfferCard
//                   key={offer._id}
//                   offer={offer}
//                   onEdit={handleOpenModal}
//                   onDelete={handleDelete}
//                 />
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div className="text-sm text-gray-500 text-center sm:text-left">
//                   Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOffers.length)} of {filteredOffers.length} offers
//                 </div>
//                 <div className="flex justify-center sm:justify-end gap-1">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                   </button>
//                   <div className="flex gap-1">
//                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                       let pageNum;
//                       if (totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (currentPage >= totalPages - 2) {
//                         pageNum = totalPages - 4 + i;
//                       } else {
//                         pageNum = currentPage - 2 + i;
//                       }
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setCurrentPage(pageNum)}
//                           className={`min-w-[36px] h-9 rounded-xl transition-colors text-sm ${
//                             currentPage === pageNum
//                               ? 'bg-gray-900 text-white'
//                               : 'hover:bg-gray-50 text-gray-600'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
//                   </div>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <ChevronRight className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Create/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
//             <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">
//                   {editingOffer ? 'Edit Offer' : 'Create New Offer'}
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-0.5">
//                   {editingOffer ? 'Update your promotional offer details' : 'Create a new discount offer for your customers'}
//                 </p>
//               </div>
//               <button
//                 onClick={handleCloseModal}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="h-5 w-5 text-gray-500" />
//               </button>
//             </div>
            
//             <form onSubmit={handleSubmit} className="p-6 space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Offer Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   required
//                   value={formData.title}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none"
//                   placeholder="e.g., Summer Sale, Festival Discount, Weekend Special"
//                   autoFocus
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   rows={2}
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none resize-none"
//                   placeholder="Brief description of the offer (optional)"
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Discount Type <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="discountType"
//                     required
//                     value={formData.discountType}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none bg-white"
//                   >
//                     <option value="percentage">Percentage (%)</option>
//                     <option value="fixed">Fixed Amount (₹)</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Discount Value <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="discountValue"
//                     required
//                     min="0"
//                     step={formData.discountType === 'percentage' ? '1' : '1'}
//                     value={formData.discountValue}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none"
//                     placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
//                   />
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Start Date & Time <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="datetime-local"
//                     name="startDate"
//                     required
//                     value={formData.startDate}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     End Date & Time <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="datetime-local"
//                     name="endDate"
//                     required
//                     value={formData.endDate}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Applicable Products
//                   </label>
//                   {products?.length > 0 && (
//                     <button
//                       type="button"
//                       onClick={handleSelectAllProducts}
//                       className="text-xs text-gray-600 hover:text-gray-900 font-medium"
//                     >
//                       {formData.applicableProducts.length === products?.length ? 'Deselect All' : 'Select All'}
//                     </button>
//                   )}
//                 </div>
//                 <div className="border border-gray-200 rounded-xl p-3 max-h-52 overflow-y-auto bg-gray-50">
//                   {products?.map((product) => {
//                     const isSelected = formData.applicableProducts.includes(product._id);
//                     return (
//                       <label key={product._id} className={`flex items-center p-2 rounded-lg transition-colors cursor-pointer ${isSelected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-white'}`}>
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           onChange={() => handleProductToggle(product._id)}
//                           className="mr-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                         />
//                         <div className="flex-1 min-w-0">
//                           <span className="text-sm font-medium text-gray-700 break-words">{product.name}</span>
//                           <span className="text-xs text-gray-500 ml-2">(₹{product.price.toLocaleString()})</span>
//                         </div>
//                         {isSelected && (
//                           <CheckCircle className="h-4 w-4 text-indigo-600 ml-2" />
//                         )}
//                       </label>
//                     );
//                   })}
//                   {products?.length === 0 && (
//                     <p className="text-gray-500 text-sm text-center py-4">No products available</p>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
//                   <AlertCircle className="h-3 w-3" />
//                   {formData.applicableProducts.length === 0 
//                     ? 'Leave empty to apply this offer to all products' 
//                     : `${formData.applicableProducts.length} product(s) selected for this offer`}
//                 </p>
//               </div>
              
//               <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   className="px-5 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
//                 >
//                   {editingOffer ? 'Update Offer' : 'Create Offer'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OffersManagement;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, Edit, Trash2, Plus, Tag, Calendar, Percent, DollarSign, 
  Package, TrendingUp, Clock, Gift, Zap, Filter, Search,
  CheckCircle, AlertCircle, Layers, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchOffers, createOffer, updateOffer, deleteOffer } from '../../features/offers/offerSlice';
import { fetchProducts } from '../../features/prdoducts/productSlice';
import toast from 'react-hot-toast';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-1 mt-3 text-xs">
        <TrendingUp className="h-3 w-3 text-emerald-500" />
        <span className="font-medium text-emerald-600">+{trend}%</span>
        <span className="text-gray-400">vs last month</span>
      </div>
    )}
  </div>
);

// Offer Card Component
const OfferCard = ({ offer, onEdit, onDelete }) => {
  const isActive = new Date(offer.endDate) > new Date();
  const remainingDays = Math.ceil((new Date(offer.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, Math.max(0, ((new Date() - new Date(offer.startDate)) / (new Date(offer.endDate) - new Date(offer.startDate))) * 100));
  
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Progress Bar */}
      <div className="relative h-1 bg-gray-100">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-500 ${
            isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-50' : 'bg-gray-100'}`}>
                <Gift className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{offer.title}</h3>
            </div>
            {offer.description && (
              <p className="text-gray-500 text-sm line-clamp-2">{offer.description}</p>
            )}
          </div>
          <div className="flex gap-1 ml-3">
            <button
              onClick={() => onEdit(offer)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit Offer"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(offer._id, offer.title)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Offer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Discount Badge */}
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm
            ${offer.discountType === 'percentage' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
              : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
            }
          `}>
            {offer.discountType === 'percentage' ? (
              <Percent className="h-4 w-4" />
            ) : (
              <DollarSign className="h-4 w-4" />
            )}
            {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue.toLocaleString()} OFF`}
          </div>
        </div>
        
        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>
              {new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
              {' - '}
              {new Date(offer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4 text-gray-400" />
            <span>
              {!offer.applicableProducts || offer.applicableProducts?.length === 0 
                ? 'Applies to all products' 
                : `Applied to ${offer.applicableProducts.length} product(s)`
              }
            </span>
          </div>
        </div>
        
        {/* Status Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {isActive ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">
                {remainingDays} day{remainingDays !== 1 ? 's' : ''} remaining
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Expired</span>
            </div>
          )}
          <div className="text-xs text-gray-400">
            ID: {offer._id?.slice(-6)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const OffersManagement = () => {
  const dispatch = useDispatch();
  const { offers, loading } = useSelector((state) => state.offers);
  const { products } = useSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    applicableProducts: []
  });

  useEffect(() => {
    dispatch(fetchOffers());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter offers
  const filteredOffers = offers?.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const isActive = new Date(offer.endDate) > new Date();
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && isActive) ||
                         (filterStatus === 'expired' && !isActive);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOffers = filteredOffers?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOffers?.length / itemsPerPage);

  // Stats
  const stats = {
    total: offers?.length || 0,
    active: offers?.filter(offer => new Date(offer.endDate) > new Date()).length || 0,
    expired: offers?.filter(offer => new Date(offer.endDate) <= new Date()).length || 0,
    totalDiscount: offers?.reduce((sum, offer) => sum + offer.discountValue, 0) || 0
  };

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      const existingProductIds = offer.applicableProducts?.map(p => p._id || p) || [];
      
      setFormData({
        title: offer.title || '',
        description: offer.description || '',
        discountType: offer.discountType || 'percentage',
        discountValue: offer.discountValue || '',
        startDate: offer.startDate ? new Date(offer.startDate).toISOString().slice(0, 16) : '',
        endDate: offer.endDate ? new Date(offer.endDate).toISOString().slice(0, 16) : '',
        applicableProducts: existingProductIds
      });
    } else {
      setEditingOffer(null);
      setFormData({
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        startDate: '',
        endDate: '',
        applicableProducts: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => ({
      ...prev,
      applicableProducts: prev.applicableProducts.includes(productId)
        ? prev.applicableProducts.filter(id => id !== productId)
        : [...prev.applicableProducts, productId]
    }));
  };

  const handleSelectAllProducts = () => {
    if (formData.applicableProducts.length === products?.length) {
      setFormData(prev => ({ ...prev, applicableProducts: [] }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        applicableProducts: products?.map(p => p._id) || [] 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return toast.error('Offer title is required');
    }
    
    if (!formData.discountValue || formData.discountValue <= 0) {
      return toast.error('Please enter a valid discount value');
    }
    
    if (!formData.startDate || !formData.endDate) {
      return toast.error('Please select start and end dates');
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return toast.error('End date must be after start date');
    }
    
    const offerData = {
      title: formData.title,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      applicableProducts: formData.applicableProducts
    };
    
    try {
      if (editingOffer) {
        const result = await dispatch(updateOffer({ id: editingOffer._id, offerData }));
        if (updateOffer.fulfilled.match(result)) {
          toast.success('Offer updated successfully');
          handleCloseModal();
        } else {
          toast.error('Failed to update offer');
        }
      } else {
        const result = await dispatch(createOffer(offerData));
        if (createOffer.fulfilled.match(result)) {
          toast.success('Offer created successfully');
          handleCloseModal();
        } else {
          toast.error('Failed to create offer');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id, offerTitle) => {
    if (window.confirm(`Are you sure you want to delete "${offerTitle}"? This action cannot be undone.`)) {
      const result = await dispatch(deleteOffer(id));
      if (deleteOffer.fulfilled.match(result)) {
        toast.success('Offer deleted successfully');
      } else {
        toast.error('Failed to delete offer');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Consistent with other pages */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Offers & Discounts</h1>
                <p className="text-sm text-gray-500 mt-1">Create and manage promotional offers to boost sales</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Create New Offer
            </button>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 ml-12">
            <Link to="/admin" className="hover:text-gray-700 transition-colors">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Offers</span>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard 
            title="Total Offers" 
            value={stats.total} 
            icon={Tag} 
            color="bg-gradient-to-r from-blue-600 to-blue-700"
            trend="12" 
          />
          <StatCard 
            title="Active Offers" 
            value={stats.active} 
            icon={Zap} 
            color="bg-gradient-to-r from-emerald-500 to-emerald-600"
            trend="8" 
          />
          <StatCard 
            title="Expired Offers" 
            value={stats.expired} 
            icon={Clock} 
            color="bg-gradient-to-r from-gray-500 to-gray-600"
          />
          <StatCard 
            title="Total Discount" 
            value={`₹${(stats.totalDiscount / 1000).toFixed(0)}K`} 
            icon={DollarSign} 
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search offers by title or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="expired">Expired Only</option>
                </select>
                {(searchTerm || filterStatus !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Offers Grid */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-500">Loading offers...</p>
          </div>
        ) : filteredOffers?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No offers found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterStatus !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Get started by creating your first promotional offer"}
            </p>
            {(searchTerm || filterStatus !== 'all') ? (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                <Plus className="h-4 w-4" />
                Create Offer
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentOffers?.map((offer) => (
                <OfferCard
                  key={offer._id}
                  offer={offer}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-500 text-center sm:text-left">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOffers.length)} of {filteredOffers.length} offers
                </div>
                <div className="flex justify-center sm:justify-end gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                              : 'hover:bg-gray-50 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Create/Edit Modal - Consistent with AddProduct modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {editingOffer ? 'Update your promotional offer details' : 'Create a new discount offer for your customers'}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="e.g., Summer Sale, Festival Discount, Weekend Special"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                  placeholder="Brief description of the offer (optional)"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="discountType"
                    required
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    required
                    min="0"
                    step={formData.discountType === 'percentage' ? '1' : '1'}
                    value={formData.discountValue}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Applicable Products
                  </label>
                  {products?.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAllProducts}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      {formData.applicableProducts.length === products?.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
                <div className="border border-gray-200 rounded-xl p-3 max-h-52 overflow-y-auto bg-gray-50 custom-scroll">
                  {products?.map((product) => {
                    const isSelected = formData.applicableProducts.includes(product._id);
                    return (
                      <label key={product._id} className={`flex items-center p-2 rounded-lg transition-colors cursor-pointer mb-1 ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-white'}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleProductToggle(product._id)}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-700">{product.name}</span>
                          <span className="text-xs text-gray-500 ml-2">(₹{product.price.toLocaleString()})</span>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-blue-600 ml-2" />
                        )}
                      </label>
                    );
                  })}
                  {products?.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No products available</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formData.applicableProducts.length === 0 
                    ? 'Leave empty to apply this offer to all products' 
                    : `${formData.applicableProducts.length} product(s) selected for this offer`}
                </p>
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                >
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default OffersManagement;