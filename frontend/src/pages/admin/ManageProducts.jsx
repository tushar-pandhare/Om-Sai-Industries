// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import Sidebar from '../../components/Sidebar';
// import { fetchProducts, deleteProduct } from '../../features/prdoducts/productSlice';
// import { fetchCategories } from '../../features/categories/categorySlice';
// import { Edit, Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
// import toast from 'react-hot-toast';

// const ManageProducts = () => {
//   const dispatch = useDispatch();
//   const { products, loading } = useSelector((state) => state.products);
//   const { categories } = useSelector((state) => state.categories);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [showFilters, setShowFilters] = useState(false);
  
//   useEffect(() => {
//     dispatch(fetchProducts());
//     dispatch(fetchCategories());
//   }, [dispatch]);
  
//   // Filter products
//   const filteredProducts = products?.filter(product => {
//     const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });
  
//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentProducts = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);
  
//   const handleDelete = async (id, productName) => {
//     if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
//       const result = await dispatch(deleteProduct(id));
//       if (deleteProduct.fulfilled.match(result)) {
//         toast.success('Product deleted successfully');
//       } else {
//         toast.error('Failed to delete product');
//       }
//     }
//   };
  
//   const getStockStatus = (stock) => {
//     if (stock > 10) return { label: 'In Stock', color: 'green', text: `${stock} units` };
//     if (stock > 0) return { label: 'Low Stock', color: 'yellow', text: `${stock} units` };
//     return { label: 'Out of Stock', color: 'red', text: 'Out of Stock' };
//   };
  
//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedCategory('');
//     setCurrentPage(1);
//   };
  
//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />
      
//       <div className="flex-1">
//         {/* Header */}
//         <div className="bg-white border-b border-slate-200 px-8 py-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-800">Manage Products</h1>
//               <p className="text-slate-500 mt-1">View, edit, and manage your product inventory</p>
//             </div>
//             <Link
//               to="/admin/products/add"
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add New Product
//             </Link>
//           </div>
//         </div>
        
//         <div className="p-8">
//           {/* Search and Filters Bar */}
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
//             <div className="p-4">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
//                   <input
//                     type="text"
//                     placeholder="Search products by name or description..."
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
//                   />
//                 </div>
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
//                 >
//                   <Filter className="h-5 w-5" />
//                   Filters
//                   {(selectedCategory || searchTerm) && (
//                     <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
//                       Active
//                     </span>
//                   )}
//                 </button>
//               </div>
              
//               {/* Expanded Filters */}
//               {showFilters && (
//                 <div className="mt-4 pt-4 border-t border-slate-200">
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Category
//                       </label>
//                       <select
//                         value={selectedCategory}
//                         onChange={(e) => {
//                           setSelectedCategory(e.target.value);
//                           setCurrentPage(1);
//                         }}
//                         className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//                       >
//                         <option value="">All Categories</option>
//                         {categories?.map((category) => (
//                           <option key={category._id} value={category._id}>
//                             {category.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="flex items-end">
//                       <button
//                         onClick={clearFilters}
//                         className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
//                       >
//                         Clear all filters
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* Products Table */}
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//             {loading ? (
//               <div className="p-12 text-center">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <p className="mt-3 text-slate-500">Loading products...</p>
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-slate-50 border-b border-slate-200">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                           Product
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                           Category
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                           Price
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                           Stock
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-200">
//                       {currentProducts?.map((product) => {
//                         const stockStatus = getStockStatus(product.stock);
//                         return (
//                           <tr key={product._id} className="hover:bg-slate-50 transition-colors">
//                             <td className="px-6 py-4">
//                               <div className="flex items-center gap-3">
//                                 <img
//                                   src={product.images?.[0] || 'https://via.placeholder.com/40?text=No+Image'}
//                                   alt={product.name}
//                                   className="w-12 h-12 object-cover rounded-lg border border-slate-200"
//                                   onError={(e) => {
//                                     e.target.src = 'https://via.placeholder.com/40?text=No+Image';
//                                   }}
//                                 />
//                                 <div>
//                                   <div className="font-medium text-slate-800">{product.name}</div>
//                                   {product.description && (
//                                     <div className="text-sm text-slate-500 mt-0.5">
//                                       {product.description.substring(0, 60)}
//                                       {product.description.length > 60 && '...'}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4">
//                               <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
//                                 {product.category?.name || 'Uncategorized'}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4">
//                               <div className="font-semibold text-slate-800">₹{product.price.toLocaleString()}</div>
//                             </td>
//                             <td className="px-6 py-4">
//                               <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
//                                 ${stockStatus.color === 'green' ? 'bg-green-100 text-green-800' : ''}
//                                 ${stockStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
//                                 ${stockStatus.color === 'red' ? 'bg-red-100 text-red-800' : ''}
//                               `}>
//                                 {stockStatus.text}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4">
//                               <div className="flex items-center gap-2">
//                                 <Link
//                                   to={`/admin/products/view/${product._id}`}
//                                   className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
//                                   title="View Details"
//                                 >
//                                   <Eye className="h-4.5 w-4.5" />
//                                 </Link>
//                                 <Link
//                                   to={`/admin/products/edit/${product._id}`}
//                                   className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
//                                   title="Edit Product"
//                                 >
//                                   <Edit className="h-4.5 w-4.5" />
//                                 </Link>
//                                 <button
//                                   onClick={() => handleDelete(product._id, product.name)}
//                                   className="p-2 text-slate-500 hover:text-red-600 transition-colors"
//                                   title="Delete Product"
//                                 >
//                                   <Trash2 className="h-4.5 w-4.5" />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
                
//                 {filteredProducts?.length === 0 && (
//                   <div className="p-12 text-center">
//                     <div className="text-slate-400 mb-3">
//                       <Package className="h-12 w-12 mx-auto" />
//                     </div>
//                     <p className="text-slate-500 font-medium">No products found</p>
//                     <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
//                     {(searchTerm || selectedCategory) && (
//                       <button
//                         onClick={clearFilters}
//                         className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
//                       >
//                         Clear all filters
//                       </button>
//                     )}
//                   </div>
//                 )}
                
//                 {/* Pagination */}
//                 {filteredProducts?.length > 0 && totalPages > 1 && (
//                   <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
//                     <div className="text-sm text-slate-600">
//                       Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                         disabled={currentPage === 1}
//                         className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                       >
//                         <ChevronLeft className="h-5 w-5" />
//                       </button>
//                       <div className="flex gap-1">
//                         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                           let pageNum;
//                           if (totalPages <= 5) {
//                             pageNum = i + 1;
//                           } else if (currentPage <= 3) {
//                             pageNum = i + 1;
//                           } else if (currentPage >= totalPages - 2) {
//                             pageNum = totalPages - 4 + i;
//                           } else {
//                             pageNum = currentPage - 2 + i;
//                           }
//                           return (
//                             <button
//                               key={pageNum}
//                               onClick={() => setCurrentPage(pageNum)}
//                               className={`px-3 py-2 rounded-lg transition-colors ${
//                                 currentPage === pageNum
//                                   ? 'bg-blue-600 text-white'
//                                   : 'hover:bg-white text-slate-600'
//                               }`}
//                             >
//                               {pageNum}
//                             </button>
//                           );
//                         })}
//                       </div>
//                       <button
//                         onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageProducts;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../features/prdoducts/productSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import { 
  Edit, Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight, 
  Package as PackageIcon, Plus, Grid3x3, List, Star, 
  TrendingUp, AlertCircle, CheckCircle, XCircle, ImageOff,
  DollarSign, Tag, Layers, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

// Custom Image Component with Fallback
const ProductImage = ({ src, alt, size = 'w-10 h-10' }) => {
  const [imgError, setImgError] = useState(false);
  
  if (!src || imgError) {
    return (
      <div className={`${size} bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200`}>
        <ImageOff className="h-5 w-5 text-gray-400" />
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={`${size} object-cover rounded-xl border border-gray-200`}
      onError={() => setImgError(true)}
    />
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
    {change && (
      <div className="flex items-center gap-1 mt-3 text-xs">
        <TrendingUp className="h-3 w-3 text-green-500" />
        <span className="text-green-600 font-medium">{change}</span>
        <span className="text-gray-400">vs last month</span>
      </div>
    )}
  </div>
);

// Status Badge Component
const StockBadge = ({ stock }) => {
  if (stock > 10) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="h-3 w-3" />
        In Stock ({stock})
      </span>
    );
  }
  if (stock > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <AlertCircle className="h-3 w-3" />
        Low Stock ({stock})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
      <XCircle className="h-3 w-3" />
      Out of Stock
    </span>
  );
};

// Product Card Component (for mobile/grid view)
const ProductCard = ({ product, onDelete, viewMode }) => {
  const [showMenu, setShowMenu] = useState(false);
  const stockStatus = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative">
          <ProductImage 
            src={product.images?.[0]} 
            alt={product.name}
            size="w-full h-full"
          />
          <div className="absolute top-3 right-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
            >
              <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                  <Link to={`/admin/products/view/${product._id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Eye className="h-4 w-4" /> View
                  </Link>
                  <Link to={`/admin/products/edit/${product._id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Edit className="h-4 w-4" /> Edit
                  </Link>
                  <button onClick={() => onDelete(product._id, product.name)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-base line-clamp-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <StockBadge stock={product.stock} />
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {product.category?.name || 'Uncategorized'}
          </span>
          <div className="flex gap-1">
            <Link to={`/admin/products/edit/${product._id}`} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
              <Edit className="h-4 w-4" />
            </Link>
            <button onClick={() => onDelete(product._id, product.name)} className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ManageProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Calculate stats
  const stats = {
    total: products?.length || 0,
    totalValue: products?.reduce((sum, p) => sum + (p.price * p.stock), 0) || 0,
    lowStock: products?.filter(p => p.stock > 0 && p.stock <= 10).length || 0,
    outOfStock: products?.filter(p => p.stock === 0).length || 0
  };
  
  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'stock') return a.stock - b.stock;
    return 0;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);
  
  const handleDelete = async (id, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      const result = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(result)) {
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
    setCurrentPage(1);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage your product catalog, inventory, and pricing</p>
            </div>
            <Link
              to="/admin/products/add"
              className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gray-200 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </Link>
          </div>
        </div>
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Products" value={stats.total} icon={PackageIcon} color="bg-gradient-to-r from-gray-700 to-gray-900" change="+12%" />
          <StatCard title="Inventory Value" value={`₹${(stats.totalValue / 100000).toFixed(1)}L`} icon={DollarSign} color="bg-gradient-to-r from-emerald-500 to-emerald-700" />
          <StatCard title="Low Stock Items" value={stats.lowStock} icon={AlertCircle} color="bg-gradient-to-r from-amber-500 to-amber-700" />
          <StatCard title="Out of Stock" value={stats.outOfStock} icon={XCircle} color="bg-gradient-to-r from-rose-500 to-rose-700" />
        </div>
        
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                    showFilters 
                      ? 'bg-gray-900 text-white' 
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-sm">Filters</span>
                  {(selectedCategory || searchTerm) && (
                    <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">1</span>
                  )}
                </button>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none bg-white"
                    >
                      <option value="">All Categories</option>
                      {categories?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none bg-white"
                    >
                      <option value="newest">Newest First</option>
                      <option value="priceLow">Price: Low to High</option>
                      <option value="priceHigh">Price: High to Low</option>
                      <option value="name">Product Name</option>
                      <option value="stock">Stock: Low to High</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Products Display */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-3 text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || selectedCategory 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first product"}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Clear all filters
              </button>
            )}
            {!searchTerm && !selectedCategory && (
              <Link
                to="/admin/products/add"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New Product
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts?.map((product) => (
              <ProductCard key={product._id} product={product} onDelete={handleDelete} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProducts?.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProductImage src={product.images?.[0]} alt={product.name} size="w-10 h-10" />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[200px]">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                          <Tag className="h-3 w-3" />
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">₹{product.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <StockBadge stock={product.stock} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Link to={`/admin/products/view/${product._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link to={`/admin/products/edit/${product._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button onClick={() => handleDelete(product._id, product.name)} className="p-2 text-gray-400 hover:text-rose-600 transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {filteredProducts?.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex justify-center sm:justify-end gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      className={`min-w-[36px] h-9 rounded-xl transition-colors text-sm ${
                        currentPage === pageNum
                          ? 'bg-gray-900 text-white'
                          : 'hover:bg-gray-50 text-gray-600'
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
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;