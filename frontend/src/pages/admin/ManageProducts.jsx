import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../features/prdoducts/productSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import { 
  Edit, Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight, 
  Package as PackageIcon, Plus, Grid3x3, List, 
  TrendingUp, AlertCircle, CheckCircle, XCircle, ImageOff,
  DollarSign, Tag, Layers, Clock, Sparkles, 
  BarChart3, ShoppingBag, AlertTriangle, Box
} from 'lucide-react';
import toast from 'react-hot-toast';

// Custom Image Component with Fallback
const ProductImage = ({ src, alt, size = 'w-10 h-10' }) => {
  const [imgError, setImgError] = useState(false);
  
  if (!src || imgError) {
    return (
      <div className={`${size} bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-blue-100`}>
        <ImageOff className="h-5 w-5 text-blue-300" />
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={`${size} object-cover rounded-xl border border-blue-100 shadow-sm`}
      onError={() => setImgError(true)}
    />
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, change, trend }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
    {change && (
      <div className="flex items-center gap-1 mt-3 text-xs">
        {trend === 'up' ? (
          <TrendingUp className="h-3 w-3 text-emerald-500" />
        ) : (
          <TrendingUp className="h-3 w-3 text-rose-500 transform rotate-180" />
        )}
        <span className={`font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>{change}</span>
        <span className="text-gray-400">vs last month</span>
      </div>
    )}
  </div>
);

// Status Badge Component
const StockBadge = ({ stock }) => {
  if (stock > 10) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
        <CheckCircle className="h-3 w-3" />
        In Stock ({stock})
      </span>
    );
  }
  if (stock > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
        <AlertCircle className="h-3 w-3" />
        Low Stock ({stock})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-100">
      <XCircle className="h-3 w-3" />
      Out of Stock
    </span>
  );
};

// Product Card Component
const ProductCard = ({ product, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const discountPercent = product.discountPercent || 0;
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 relative">
          <ProductImage 
            src={product.images?.[0]} 
            alt={product.name}
            size="w-full h-full"
          />
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                {discountPercent}% OFF
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
            >
              <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                  {/* <Link to={`/admin/products/view/${product._id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                    <Eye className="h-4 w-4" /> View
                  </Link> */}
                  <Link to={`/admin/products/edit/${product._id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                    <Edit className="h-4 w-4" /> Edit
                  </Link>
                  <button onClick={() => onDelete(product._id, product.name)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
          <h3 className="font-semibold text-gray-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description?.substring(0, 80)}</p>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
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
            <button onClick={() => onDelete(product._id, product.name)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
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
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  const stats = {
    total: products?.length || 0,
    totalValue: products?.reduce((sum, p) => sum + (p.price * p.stock), 0) || 0,
    lowStock: products?.filter(p => p.stock > 0 && p.stock <= 10).length || 0,
    outOfStock: products?.filter(p => p.stock === 0).length || 0
  };
  
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              </div>
              <p className="text-sm text-gray-500 ml-11">Manage your product catalog, inventory, and pricing</p>
            </div>
            <Link
              to="/admin/products/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Products" 
            value={stats.total} 
            icon={PackageIcon} 
            color="bg-gradient-to-r from-blue-600 to-blue-700" 
            change="+12%" 
            trend="up"
          />
          <StatCard 
            title="Inventory Value" 
            value={`₹${(stats.totalValue / 100000).toFixed(1)}L`} 
            icon={DollarSign} 
            color="bg-gradient-to-r from-emerald-500 to-emerald-600" 
            change="+8%" 
            trend="up"
          />
          <StatCard 
            title="Low Stock Items" 
            value={stats.lowStock} 
            icon={AlertTriangle} 
            color="bg-gradient-to-r from-amber-500 to-amber-600" 
            change="-3%" 
            trend="down"
          />
          <StatCard 
            title="Out of Stock" 
            value={stats.outOfStock} 
            icon={XCircle} 
            color="bg-gradient-to-r from-red-500 to-red-600" 
            change="+2%" 
            trend="up"
          />
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                    showFilters 
                      ? 'bg-blue-600 text-white' 
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
                    className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
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
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
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
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
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
                      className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
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
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageIcon className="h-12 w-12 text-blue-400" />
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
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
            {!searchTerm && !selectedCategory && (
              <Link
                to="/admin/products/add"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New Product
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts?.map((product) => (
              <ProductCard key={product._id} product={product} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
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
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProductImage src={product.images?.[0]} alt={product.name} size="w-12 h-12" />
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[250px]">
                              {product.description?.substring(0, 60)}
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
                        {product.discountPercent > 0 && (
                          <div className="text-xs text-green-600">-{product.discountPercent}%</div>
                        )}
                       </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <StockBadge stock={product.stock} />
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {/* <Link to={`/admin/products/view/${product._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                            <Eye className="h-4 w-4" />
                          </Link> */}
                          <Link to={`/admin/products/edit/${product._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button onClick={() => handleDelete(product._id, product.name)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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
                          ? 'bg-blue-600 text-white'
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