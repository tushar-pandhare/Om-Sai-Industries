// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { 
//   Search, 
//   Filter, 
//   X, 
//   Star, 
//   Tag, 
//   Sliders,
//   Grid3x3,
//   List,
//   ChevronLeft,
//   ChevronRight,
//   TrendingUp,
//   Clock,
//   ShoppingBag,
//   Zap,
//   Sparkles,
//   Truck,
//   RotateCcw,
//   LayoutGrid,
//   Plus,
//   Eye,
//   Heart,
//   Percent,
//   Gift
// } from 'lucide-react';
// import { fetchProducts } from '../../features/prdoducts/productSlice';
// import { fetchCategories } from '../../features/categories/categorySlice';
// import { fetchOffers, fetchOfferProducts, clearSelectedOffer } from '../../features/offers/offerSlice';
// import { addToCart } from '../../features/cart/cartSlice';
// import toast from 'react-hot-toast';

// const Products = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const offerId = searchParams.get('offer');
//   const offerTitle = searchParams.get('title');
//   const offerDiscount = searchParams.get('discount');
//   const offerType = searchParams.get('type');
  
//   const { products, loading } = useSelector((state) => state.products);
//   const { categories } = useSelector((state) => state.categories);
//   const { userInfo } = useSelector((state) => state.auth);
//   const { offers, selectedOffer, offerProducts, loading: offerLoading } = useSelector((state) => state.offers);
  
//   // State
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedOfferFilter, setSelectedOfferFilter] = useState('');
//   const [priceRange, setPriceRange] = useState([0, 100000]);
//   const [sortBy, setSortBy] = useState('');
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [viewMode, setViewMode] = useState('grid');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [priceInput, setPriceInput] = useState({ min: 0, max: 100000 });
//   const [addingToCart, setAddingToCart] = useState(null);
//   const itemsPerPage = 12;

//   // Determine which products to show
//   const isOfferMode = !!offerId;
//   const displayProducts = isOfferMode && offerProducts.length > 0 ? offerProducts : products;
//   const isLoading = isOfferMode ? offerLoading : loading;

//   useEffect(() => {
//     // Fetch offers for filter dropdown
//     dispatch(fetchOffers());
    
//     // If in offer mode, fetch offer-specific products
//     if (offerId) {
//       dispatch(fetchOfferProducts(offerId));
//     } else {
//       dispatch(fetchProducts());
//       dispatch(clearSelectedOffer());
//     }
//     dispatch(fetchCategories());
    
//     // Clear offer mode when component unmounts
//     return () => {
//       if (offerId) {
//         dispatch(clearSelectedOffer());
//       }
//     };
//   }, [dispatch, offerId]);

//   // Clear offer mode and show all products
//   const clearOfferMode = () => {
//     navigate('/products', { replace: true });
//     setCurrentPage(1);
//     setSearchTerm('');
//     setSelectedCategory('');
//     setSelectedOfferFilter('');
//     setSortBy('');
//     toast.success('Showing all products');
//   };

//   // Apply offer filter to products
//   const applyOfferFilter = (offerId) => {
//     if (!offerId) {
//       setSelectedOfferFilter('');
//       dispatch(fetchProducts());
//       toast.success('Showing all products');
//     } else {
//       setSelectedOfferFilter(offerId);
//       dispatch(fetchOfferProducts(offerId));
//       toast.success('Filtering products by selected offer');
//     }
//     setCurrentPage(1);
//     setIsFilterOpen(false);
//   };

//   const applyPriceFilter = () => {
//     setPriceRange([parseInt(priceInput.min), parseInt(priceInput.max)]);
//     setCurrentPage(1);
//     setIsFilterOpen(false);
//   };

//   const handleAddToCart = (product) => {
//     if (!userInfo) {
//       toast.error('Please login to add items to cart');
//       navigate('/login');
//       return;
//     }
    
//     setAddingToCart(product._id);
    
//     setTimeout(() => {
//       dispatch(addToCart({
//         _id: product._id,
//         name: product.name,
//         price: product.price,
//         images: product.images,
//         quantity: 1,
//         stock: product.stock
//       }));
//       toast.success(`${product.name} added to cart!`);
//       setAddingToCart(null);
//     }, 300);
//   };

//   const handleBuyNow = (product) => {
//     if (!userInfo) {
//       toast.error('Please login to purchase');
//       navigate('/login');
//       return;
//     }
    
//     dispatch(addToCart({
//       _id: product._id,
//       name: product.name,
//       price: product.price,
//       images: product.images,
//       quantity: 1,
//       stock: product.stock
//     }));
//     navigate('/cart');
//   };

//   // Get active offers for filter dropdown
//   const getActiveOffers = () => {
//     return offers?.filter(offer => new Date(offer.endDate) > new Date()) || [];
//   };

//   const filteredProducts = displayProducts?.filter(product => {
//     const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;
//     const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
//     return matchesSearch && matchesCategory && matchesPrice;
//   });

//   const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
//     switch(sortBy) {
//       case 'price-low': return a.price - b.price;
//       case 'price-high': return b.price - a.price;
//       case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
//       case 'rating': return (b.rating || 0) - (a.rating || 0);
//       case 'popular': return (b.soldCount || 0) - (a.soldCount || 0);
//       default: return 0;
//     }
//   });

//   const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
//   const paginatedProducts = sortedProducts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const clearAllFilters = () => {
//     setSearchTerm('');
//     setSelectedCategory('');
//     setSelectedOfferFilter('');
//     setPriceRange([0, 100000]);
//     setPriceInput({ min: 0, max: 100000 });
//     setSortBy('');
//     setCurrentPage(1);
    
//     // If in offer mode, clear it
//     if (isOfferMode) {
//       navigate('/products', { replace: true });
//       dispatch(fetchProducts());
//     }
    
//     toast.success('All filters cleared');
//   };

//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (searchTerm) count++;
//     if (selectedCategory) count++;
//     if (selectedOfferFilter) count++;
//     if (priceRange[0] > 0 || priceRange[1] < 100000) count++;
//     if (sortBy) count++;
//     return count;
//   };

//   const StarRating = ({ rating }) => {
//     return (
//       <div className="flex items-center gap-0.5">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             className={`w-3.5 h-3.5 ${
//               star <= Math.floor(rating || 0)
//                 ? 'text-yellow-400 fill-current'
//                 : 'text-gray-300'
//             }`}
//           />
//         ))}
//         <span className="text-xs text-gray-500 ml-1">({rating || 0})</span>
//       </div>
//     );
//   };

//   // Calculate discounted price for offer products
//   const getDiscountedPrice = (product) => {
//     if (isOfferMode && offerDiscount) {
//       const discount = parseInt(offerDiscount);
//       if (offerType === 'percentage') {
//         return product.price - (product.price * discount / 100);
//       } else {
//         return Math.max(0, product.price - discount);
//       }
//     }
//     return product.price;
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
//           <p className="mt-4 text-slate-500 font-light tracking-widest uppercase text-xs">
//             {isOfferMode ? 'Loading Offer Products...' : 'Loading Collection'}
//           </p>
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
//           {isOfferMode ? (
//             <>
//               <span className="inline-block py-1 px-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold tracking-widest uppercase mb-4">
//                 Limited Time Offer
//               </span>
//               <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
//                 {offerTitle || 'Special Offer'}
//               </h1>
//               <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
//                 {offerType === 'percentage' 
//                   ? `Get ${offerDiscount}% OFF on selected products` 
//                   : `Get ₹${offerDiscount} OFF on selected products`}
//               </p>
//             </>
//           ) : (
//             <>
//               <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
//                 New Arrivals 2026
//               </span>
//               <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
//                 Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Lifestyle.</span>
//               </h1>
//               <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
//                 A curated selection of premium essentials designed for the modern individual. Quality meets aesthetic.
//               </p>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
        
//         {/* Offer Banner - Show when in offer mode */}
//         {isOfferMode && (
//           <div className="mb-8">
//             <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
//                     <Gift className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-white">{offerTitle || 'Special Offer'}</h2>
//                     <p className="text-indigo-100 text-sm">
//                       {offerType === 'percentage' 
//                         ? `${offerDiscount}% OFF on all products below` 
//                         : `₹${offerDiscount} OFF on all products below`}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={clearOfferMode}
//                   className="px-5 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl text-white font-medium transition-all flex items-center gap-2"
//                 >
//                   <X className="w-4 h-4" />
//                   Show All Products
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Active Offer Filter Indicator */}
//         {selectedOfferFilter && !isOfferMode && (
//           <div className="mb-4">
//             <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-3 flex items-center justify-between">
//               <div className="flex items-center gap-2 text-white">
//                 <Gift className="w-4 h-4" />
//                 <span className="text-sm font-medium">
//                   Filtered by: {offers?.find(o => o._id === selectedOfferFilter)?.title || 'Special Offer'}
//                 </span>
//               </div>
//               <button
//                 onClick={() => applyOfferFilter('')}
//                 className="text-white/80 hover:text-white text-xs"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Utility Bar */}
//         <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 p-2 md:p-3 mb-8 border border-slate-100">
//           <div className="flex flex-col lg:flex-row gap-2">
//             <div className="relative flex-grow">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search our catalog..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
//               />
//             </div>

//             <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
//               <button
//                 onClick={() => setIsFilterOpen(true)}
//                 className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shrink-0"
//               >
//                 <Filter className="h-4 w-4" />
//                 <span className="text-sm font-semibold">Filters</span>
//                 {getActiveFiltersCount() > 0 && (
//                   <span className="ml-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
//                     {getActiveFiltersCount()}
//                   </span>
//                 )}
//               </button>

//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-4 py-4 bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none min-w-[160px]"
//               >
//                 <option value="">Recommended</option>
//                 <option value="newest">Newest</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="rating">Top Rated</option>
//               </select>

//               <div className="hidden md:flex bg-slate-50 p-1 rounded-xl gap-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
//                 >
//                   <LayoutGrid className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
//                 >
//                   <List className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Results Info */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-2">
//           <h2 className="text-slate-800 font-bold text-xl">
//             {isOfferMode ? 'Offer Products' : 'All Products'} 
//             <span className="text-slate-400 font-normal ml-2">({sortedProducts.length})</span>
//           </h2>
//           {getActiveFiltersCount() > 0 && (
//             <button onClick={clearAllFilters} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
//               <RotateCcw className="h-3 w-3" /> Reset Filters
//             </button>
//           )}
//         </div>

//         {/* Products Grid/List */}
//         {paginatedProducts.length > 0 ? (
//           viewMode === 'grid' ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {paginatedProducts.map((product) => {
//                 const discountedPrice = isOfferMode ? getDiscountedPrice(product) : null;
//                 const hasDiscount = isOfferMode && discountedPrice < product.price;
                
//                 return (
//                   <div key={product._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
//                     {/* Product Image */}
//                     <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-slate-100">
//                       <img
//                         src={product.images?.[0] || '/api/placeholder/300/300'}
//                         alt={product.name}
//                         className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                       {/* Offer Badge */}
//                       {hasDiscount && (
//                         <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
//                           <Percent className="w-3 h-3" />
//                           {offerType === 'percentage' ? `${offerDiscount}% OFF` : `₹${offerDiscount} OFF`}
//                         </div>
//                       )}
//                       {product.stock < 5 && product.stock > 0 && !hasDiscount && (
//                         <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
//                           Only {product.stock} left
//                         </span>
//                       )}
//                       {product.stock === 0 && (
//                         <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                           Out of Stock
//                         </span>
//                       )}
//                       <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white">
//                         <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
//                       </button>
//                     </Link>

//                     {/* Product Info */}
//                     <div className="p-4">
//                       <Link to={`/product/${product._id}`}>
//                         <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1">
//                           {product.name}
//                         </h3>
//                       </Link>
                      
//                       <div className="mt-1">
//                         <StarRating rating={product.rating} />
//                       </div>
                      
//                       <div className="mt-3 flex items-center justify-between">
//                         <div>
//                           {hasDiscount ? (
//                             <div className="flex items-center gap-2 flex-wrap">
//                               <span className="text-2xl font-bold text-indigo-600">₹{Math.round(discountedPrice).toLocaleString()}</span>
//                               <span className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString()}</span>
//                             </div>
//                           ) : (
//                             <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="mt-4 flex gap-2">
//                         <button
//                           onClick={() => handleAddToCart(product)}
//                           disabled={product.stock === 0 || addingToCart === product._id}
//                           className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                         >
//                           {addingToCart === product._id ? (
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <>
//                               <ShoppingBag className="w-4 h-4" />
//                               Add to Cart
//                             </>
//                           )}
//                         </button>
//                         <button
//                           onClick={() => handleBuyNow(product)}
//                           disabled={product.stock === 0}
//                           className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium text-sm hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Buy Now
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {paginatedProducts.map((product) => {
//                 const discountedPrice = isOfferMode ? getDiscountedPrice(product) : null;
//                 const hasDiscount = isOfferMode && discountedPrice < product.price;
                
//                 return (
//                   <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 border border-slate-100 flex flex-col sm:flex-row gap-4">
//                     <Link to={`/product/${product._id}`} className="sm:w-32 h-32 bg-slate-100 rounded-xl overflow-hidden relative">
//                       <img
//                         src={product.images?.[0] || '/api/placeholder/300/300'}
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                       />
//                       {hasDiscount && (
//                         <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
//                           {offerType === 'percentage' ? `${offerDiscount}% OFF` : `₹${offerDiscount} OFF`}
//                         </div>
//                       )}
//                     </Link>
                    
//                     <div className="flex-1">
//                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                         <div>
//                           <Link to={`/product/${product._id}`}>
//                             <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
//                               {product.name}
//                             </h3>
//                           </Link>
//                           <StarRating rating={product.rating} />
//                           <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
//                         </div>
//                         <div className="text-right">
//                           {hasDiscount ? (
//                             <>
//                               <div className="text-2xl font-bold text-indigo-600">₹{Math.round(discountedPrice).toLocaleString()}</div>
//                               <div className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString()}</div>
//                             </>
//                           ) : (
//                             <div className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</div>
//                           )}
//                           {product.stock === 0 && <span className="text-xs text-red-500">Out of Stock</span>}
//                         </div>
//                       </div>
                      
//                       <div className="flex gap-3 mt-4">
//                         <button
//                           onClick={() => handleAddToCart(product)}
//                           disabled={product.stock === 0}
//                           className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
//                         >
//                           <ShoppingBag className="w-4 h-4" />
//                           Add to Cart
//                         </button>
//                         <button
//                           onClick={() => handleBuyNow(product)}
//                           disabled={product.stock === 0}
//                           className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium text-sm hover:bg-indigo-50 transition-all"
//                         >
//                           Buy Now
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )
//         ) : (
//           <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
//             <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Search className="text-slate-300 h-10 w-10" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-800">No products found</h3>
//             <p className="text-slate-500 mt-2">
//               {isOfferMode 
//                 ? 'No products are currently available for this offer.' 
//                 : 'Try adjusting your filters or search terms.'}
//             </p>
//             {isOfferMode && (
//               <button
//                 onClick={clearOfferMode}
//                 className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
//               >
//                 Browse All Products
//               </button>
//             )}
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-3 mt-16">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage(p => p - 1)}
//               className="p-3 rounded-xl border border-slate-200 hover:bg-white transition-all disabled:opacity-30"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </button>
//             <div className="flex gap-2">
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) pageNum = i + 1;
//                 else if (currentPage <= 3) pageNum = i + 1;
//                 else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
//                 else pageNum = currentPage - 2 + i;
                
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => setCurrentPage(pageNum)}
//                     className={`w-10 h-10 rounded-xl font-medium transition-all ${
//                       currentPage === pageNum
//                         ? 'bg-indigo-600 text-white shadow-md'
//                         : 'hover:bg-white text-slate-600'
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
//             </div>
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage(p => p + 1)}
//               className="p-3 rounded-xl border border-slate-200 hover:bg-white transition-all disabled:opacity-30"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Filter Panel - Updated with Offers Filter */}
//       {isFilterOpen && (
//         <div className="fixed inset-0 z-[100] flex justify-end">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsFilterOpen(false)} />
//           <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
//             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//               <h3 className="text-xl font-bold text-slate-900">Filters</h3>
//               <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//               {/* Offers Filter - New Section */}
//               <div>
//                 <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block flex items-center gap-2">
//                   <Gift className="h-3 w-3" />
//                   Filter by Offer
//                 </label>
//                 <select
//                   value={selectedOfferFilter}
//                   onChange={(e) => applyOfferFilter(e.target.value)}
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
//                 >
//                   <option value="">All Products</option>
//                   {getActiveOffers().map((offer) => (
//                     <option key={offer._id} value={offer._id}>
//                       {offer.title} - {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
//                     </option>
//                   ))}
//                 </select>
//                 {selectedOfferFilter && (
//                   <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1">
//                     <Percent className="h-3 w-3" />
//                     Showing products with selected offer
//                   </p>
//                 )}
//               </div>

//               {/* Categories Filter */}
//               <div>
//                 <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Collections</label>
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     onClick={() => setSelectedCategory('')}
//                     className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
//                   >
//                     All Items
//                   </button>
//                   {categories?.slice(0, 8).map(cat => (
//                     <button
//                       key={cat._id}
//                       onClick={() => setSelectedCategory(cat._id)}
//                       className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat._id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
//                     >
//                       {cat.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Range Filter */}
//               <div>
//                 <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Price Range (₹)</label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <input 
//                       type="number" 
//                       placeholder="Min"
//                       value={priceInput.min} 
//                       onChange={e => setPriceInput({...priceInput, min: parseInt(e.target.value) || 0})}
//                       className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
//                     />
//                   </div>
//                   <div>
//                     <input 
//                       type="number" 
//                       placeholder="Max"
//                       value={priceInput.max} 
//                       onChange={e => setPriceInput({...priceInput, max: parseInt(e.target.value) || 100000})}
//                       className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Price Sets */}
//               <div>
//                 <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Quick Sets</label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {[
//                     { l: 'Under ₹1k', v: [0, 1000] },
//                     { l: '₹1k - ₹5k', v: [1000, 5000] },
//                     { l: '₹5k - ₹15k', v: [5000, 15000] },
//                     { l: 'Above ₹15k', v: [15000, 100000] }
//                   ].map(set => (
//                     <button 
//                       key={set.l}
//                       onClick={() => { setPriceInput({min: set.v[0], max: set.v[1]}); }}
//                       className="p-2 text-center bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"
//                     >
//                       {set.l}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
//               <button 
//                 onClick={clearAllFilters}
//                 className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all rounded-xl"
//               >
//                 Clear All
//               </button>
//               <button 
//                 onClick={() => {
//                   applyPriceFilter();
//                   setIsFilterOpen(false);
//                 }}
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
//         .line-clamp-1 {
//           display: -webkit-box;
//           -webkit-line-clamp: 1;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Products;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Tag, 
  Sliders,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  ShoppingBag,
  Zap,
  Sparkles,
  Truck,
  RotateCcw,
  LayoutGrid,
  Plus,
  Eye,
  Heart,
  Percent,
  Gift
} from 'lucide-react';
import { fetchProducts } from '../../features/prdoducts/productSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import { fetchOffers } from '../../features/offers/offerSlice';
import { addToCart } from '../../features/cart/cartSlice';
import toast from 'react-hot-toast';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get('offer');
  const offerTitle = searchParams.get('title');
  
  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { userInfo } = useSelector((state) => state.auth);
  const { offers, loading: offerLoading } = useSelector((state) => state.offers);
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOfferFilter, setSelectedOfferFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceInput, setPriceInput] = useState({ min: 0, max: 100000 });
  const [addingToCart, setAddingToCart] = useState(null);
  const itemsPerPage = 12;

  const isLoading = loading || offerLoading;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOffers());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter products based on offer
  const getProductsForOffer = () => {
    if (!selectedOfferFilter && !offerId) return products;
    
    const targetOfferId = selectedOfferFilter || offerId;
    const targetOffer = offers?.find(o => o._id === targetOfferId);
    
    if (!targetOffer) return products;
    
    return products?.filter(product => {
      // If offer applies to all products
      if (targetOffer.applicableProducts?.length === 0) return true;
      // Check if product is in applicable products
      return targetOffer.applicableProducts?.some(p => p._id === product._id || p === product._id);
    });
  };

  const displayProducts = getProductsForOffer();
  const isOfferMode = !!offerId || !!selectedOfferFilter;

  // Clear offer mode and show all products
  const clearOfferMode = () => {
    navigate('/products', { replace: true });
    setSelectedOfferFilter('');
    setCurrentPage(1);
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
    toast.success('Showing all products');
  };

  // Apply offer filter to products
  const applyOfferFilter = (offerIdValue) => {
    if (!offerIdValue) {
      setSelectedOfferFilter('');
      toast.success('Showing all products');
    } else {
      setSelectedOfferFilter(offerIdValue);
      toast.success('Filtering products by selected offer');
    }
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const applyPriceFilter = () => {
    setPriceRange([parseInt(priceInput.min), parseInt(priceInput.max)]);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleAddToCart = (product) => {
    if (!userInfo) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    setAddingToCart(product._id);
    
    setTimeout(() => {
      dispatch(addToCart({
        _id: product._id,
        name: product.name,
        price: product.originalPrice || product.price,
        images: product.images,
        quantity: 1,
        stock: product.stock
      }));
      toast.success(`${product.name} added to cart!`);
      setAddingToCart(null);
    }, 300);
  };

  const handleBuyNow = (product) => {
    if (!userInfo) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }
    
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.originalPrice || product.price,
      images: product.images,
      quantity: 1,
      stock: product.stock
    }));
    navigate('/cart');
  };

  // Get active offers for filter dropdown
  const getActiveOffers = () => {
    return offers?.filter(offer => new Date(offer.endDate) > new Date()) || [];
  };

  const filteredProducts = displayProducts?.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;
    const productPrice = product.discountedPrice || product.price;
    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    const priceA = a.discountedPrice || a.price;
    const priceB = b.discountedPrice || b.price;
    
    switch(sortBy) {
      case 'price-low': return priceA - priceB;
      case 'price-high': return priceB - priceA;
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      default: return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedOfferFilter('');
    setPriceRange([0, 100000]);
    setPriceInput({ min: 0, max: 100000 });
    setSortBy('');
    setCurrentPage(1);
    
    if (offerId) {
      navigate('/products', { replace: true });
    }
    
    toast.success('All filters cleared');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory) count++;
    if (selectedOfferFilter || offerId) count++;
    if (priceRange[0] > 0 || priceRange[1] < 100000) count++;
    if (sortBy) count++;
    return count;
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.floor(rating || 0)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating || 0})</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-light tracking-widest uppercase text-xs">Loading Collection</p>
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
          {isOfferMode ? (
            <>
              <span className="inline-block py-1 px-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold tracking-widest uppercase mb-4">
                Limited Time Offer
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                {offerTitle || 'Special Offer'}
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                Exclusive discounts on selected products
              </p>
            </>
          ) : (
            <>
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
                New Arrivals 2026
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Lifestyle.</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                A curated selection of premium essentials designed for the modern individual.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
        
        {/* Offer Banner - Show when in offer mode */}
        {isOfferMode && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{offerTitle || 'Special Offer'}</h2>
                    <p className="text-indigo-100 text-sm">
                      Exclusive discounts on selected products
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearOfferMode}
                  className="px-5 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl text-white font-medium transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Show All Products
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Utility Bar */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 p-2 md:p-3 mb-8 border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search our catalog..."
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

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-4 bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none min-w-[160px]"
              >
                <option value="">Recommended</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <div className="hidden md:flex bg-slate-50 p-1 rounded-xl gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-2">
          <h2 className="text-slate-800 font-bold text-xl">
            {isOfferMode ? 'Offer Products' : 'All Products'} 
            <span className="text-slate-400 font-normal ml-2">({sortedProducts.length})</span>
          </h2>
          {getActiveFiltersCount() > 0 && (
            <button onClick={clearAllFilters} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> Reset Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => {
              const hasDiscount = product.discountedPrice && product.discountedPrice < product.originalPrice;
              const displayPrice = hasDiscount ? product.discountedPrice : product.price;
              const originalPrice = product.originalPrice || product.price;
              const discountPercent = hasDiscount ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;
              
              return (
                <div key={product._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
                  {/* Product Image */}
                  <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-slate-100">
                    <img
                      src={product.images?.[0] || '/api/placeholder/300/300'}
                      alt={product.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Offer Badge - Show best discount */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                        <Zap className="w-3 h-3" />
                        {discountPercent}% OFF
                      </div>
                    )}
                    {product.stock < 5 && product.stock > 0 && !hasDiscount && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        Only {product.stock} left
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Out of Stock
                      </span>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white">
                      <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                    </button>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-1">
                      <StarRating rating={product.rating} />
                    </div>
                    
                    <div className="mt-3">
                      {hasDiscount ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-2xl font-bold text-indigo-600">₹{Math.round(displayPrice).toLocaleString()}</span>
                          <span className="text-sm text-gray-400 line-through">₹{Math.round(originalPrice).toLocaleString()}</span>
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                            Save ₹{Math.round(originalPrice - displayPrice).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">₹{Math.round(displayPrice).toLocaleString()}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0 || addingToCart === product._id}
                        className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {addingToCart === product._id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        disabled={product.stock === 0}
                        className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium text-sm hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Buy Now
                      </button>
                    </div>
                    
                    {/* Best Offer Info */}
                    {product.bestOffer && (
                      <div className="mt-2 text-xs text-indigo-600 bg-indigo-50 rounded-lg p-1.5 text-center">
                        Best Price: {product.bestOffer.title}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-slate-300 h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No products found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-3 rounded-xl border border-slate-200 hover:bg-white transition-all disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'hover:bg-white text-slate-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-3 rounded-xl border border-slate-200 hover:bg-white transition-all disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Offers Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block flex items-center gap-2">
                  <Gift className="h-3 w-3" />
                  Filter by Offer
                </label>
                <select
                  value={selectedOfferFilter}
                  onChange={(e) => applyOfferFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="">All Products</option>
                  {getActiveOffers().map((offer) => (
                    <option key={offer._id} value={offer._id}>
                      {offer.title} - {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categories Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Collections</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    All Items
                  </button>
                  {categories?.slice(0, 8).map(cat => (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat._id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Price Range (₹)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" 
                    placeholder="Min"
                    value={priceInput.min} 
                    onChange={e => setPriceInput({...priceInput, min: parseInt(e.target.value) || 0})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max"
                    value={priceInput.max} 
                    onChange={e => setPriceInput({...priceInput, max: parseInt(e.target.value) || 100000})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button 
                onClick={clearAllFilters}
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all rounded-xl"
              >
                Clear All
              </button>
              <button 
                onClick={() => {
                  applyPriceFilter();
                  setIsFilterOpen(false);
                }}
                className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
