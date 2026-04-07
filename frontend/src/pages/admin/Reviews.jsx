import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Search, Filter, Trash2, User, Package, Calendar, TrendingUp, MessageSquare, Tag, Info, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchAllReviews, deleteReview } from '../../features/prdoducts/productSlice';
import toast from 'react-hot-toast';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

// Star Rating Component
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-3.5 w-3.5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

// Review Card Component
const ReviewCard = ({ review, onDelete }) => {
  const getTypeBadge = () => {
    if (!review.isProductReview) {
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: MessageSquare, label: 'Feedback' };
    }
    if (review.source === 'embedded') {
      return { bg: 'bg-amber-100', text: 'text-amber-700', icon: Info, label: 'Legacy' };
    }
    return { bg: 'bg-blue-100', text: 'text-blue-700', icon: Package, label: 'Review' };
  };
  
  const badge = getTypeBadge();
  const BadgeIcon = badge.icon;
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${badge.bg} ${badge.text}`}>
              <BadgeIcon className="h-3 w-3" />
              {badge.label}
            </span>
            {review.category && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">
                <Tag className="h-3 w-3" />
                {review.category}
              </span>
            )}
          </div>
          
          {/* User Info */}
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0">
              {review.userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={review.rating} />
                <span className="text-sm font-medium text-gray-600">{review.rating}.0</span>
              </div>
              {review.productName && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                  <Package className="h-3.5 w-3.5" />
                  <span className="truncate">{review.productName}</span>
                </div>
              )}
              {review.comment && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm text-gray-700 leading-relaxed break-words">{review.comment}</p>
                </div>
              )}
              {review.userEmail && review.userEmail !== 'No email' && (
                <p className="text-xs text-gray-400 mt-2 truncate">{review.userEmail}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <button
          onClick={() => onDelete(review._id, review.userName, review.isProductReview)}
          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors self-start"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Main Component
const Reviews = () => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.products);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const productReviews = reviews?.filter(r => r.isProductReview) || [];
  const generalFeedbacks = reviews?.filter(r => !r.isProductReview) || [];
  const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / (productReviews.length || 1);

  const filteredReviews = reviews?.filter(review => {
    const matchesSearch = review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filter === 'all' || review.rating === parseInt(filter);
    const matchesType = typeFilter === 'all' || (typeFilter === 'product-review' ? review.isProductReview : !review.isProductReview);
    return matchesSearch && matchesRating && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReviews?.length / itemsPerPage);
  const paginatedReviews = filteredReviews?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id, userName, isProductReview) => {
    if (window.confirm(`Delete ${!isProductReview ? 'feedback' : 'review'} from ${userName}?`)) {
      const result = await dispatch(deleteReview(id));
      if (deleteReview.fulfilled.match(result)) {
        toast.success(`${!isProductReview ? 'Feedback' : 'Review'} deleted`);
      } else {
        toast.error('Failed to delete');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  const stats = {
    productReviews: productReviews.length,
    generalFeedbacks: generalFeedbacks.length,
    averageRating: averageRating.toFixed(1),
    total: reviews?.length || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Customer Feedback & Reviews
          </h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and manage customer feedback and product reviews</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Product Reviews" value={stats.productReviews} icon={Package} color="bg-gradient-to-r from-blue-500 to-blue-700" />
          <StatCard title="General Feedback" value={stats.generalFeedbacks} icon={MessageSquare} color="bg-gradient-to-r from-emerald-500 to-emerald-700" />
          <StatCard title="Avg Rating" value={stats.averageRating} icon={Star} color="bg-gradient-to-r from-yellow-500 to-yellow-700" />
          <StatCard title="Total Responses" value={stats.total} icon={TrendingUp} color="bg-gradient-to-r from-purple-500 to-purple-700" />
        </div>

        {/* Rating Distribution */}
        {productReviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = productReviews.filter(r => r.rating === rating).length;
                const percentage = (count / productReviews.length) * 100;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="w-12 text-sm text-gray-600">{rating}★</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                    <div className="w-12 text-sm text-gray-500 text-right">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by user, product, or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(filter !== 'all' || typeFilter !== 'all') && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid sm:grid-cols-2 gap-4">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="product-review">Product Reviews</option>
                    <option value="general-feedback">General Feedback</option>
                  </select>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                {(searchTerm || filter !== 'all' || typeFilter !== 'all') && (
                  <button onClick={clearFilters} className="mt-3 text-sm text-gray-500 hover:text-gray-700">
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : paginatedReviews?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No feedback found</h3>
            <p className="text-gray-500">No customer feedback available</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedReviews?.map((review) => (
                <ReviewCard key={review._id} review={review} onDelete={handleDelete} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-xl disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-xl disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;
// // frontend/src/pages/admin/Reviews.jsx
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Star, Search, Filter, Trash2, User, Package, Calendar, TrendingUp, MessageSquare, Tag, Info } from 'lucide-react';
// import { fetchAllReviews, deleteReview } from '../../features/prdoducts/productSlice';
// import toast from 'react-hot-toast';

// const Reviews = () => {
//   const dispatch = useDispatch();
//   const { reviews, loading } = useSelector((state) => state.products);
//   const [filter, setFilter] = useState('all');
//   const [typeFilter, setTypeFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllReviews());
//   }, [dispatch]);

//   const filteredReviews = reviews?.filter(review => {
//     const matchesSearch = 
//       review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       review.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesRating = filter === 'all' || review.rating === parseInt(filter);
//     const matchesType = typeFilter === 'all' || (typeFilter === 'product-review' ? review.isProductReview : !review.isProductReview);
    
//     return matchesSearch && matchesRating && matchesType;
//   });

//   const handleDelete = async (id, userName, isProductReview) => {
//     const confirmMessage = !isProductReview 
//       ? `Are you sure you want to delete this feedback from ${userName}?`
//       : `Are you sure you want to delete the review by ${userName}?`;
    
//     if (window.confirm(confirmMessage)) {
//       const result = await dispatch(deleteReview(id));
//       if (deleteReview.fulfilled.match(result)) {
//         toast.success(`${!isProductReview ? 'Feedback' : 'Review'} deleted successfully`);
//       } else {
//         toast.error('Failed to delete');
//       }
//     }
//   };

//   const productReviews = reviews?.filter(r => r.isProductReview) || [];
//   const generalFeedbacks = reviews?.filter(r => !r.isProductReview) || [];
  
//   const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / (productReviews.length || 1);
  
//   const ratingDistribution = {
//     5: productReviews.filter(r => r.rating === 5).length || 0,
//     4: productReviews.filter(r => r.rating === 4).length || 0,
//     3: productReviews.filter(r => r.rating === 3).length || 0,
//     2: productReviews.filter(r => r.rating === 2).length || 0,
//     1: productReviews.filter(r => r.rating === 1).length || 0,
//   };

//   const getRatingPercentage = (count) => {
//     return productReviews.length ? ((count / productReviews.length) * 100).toFixed(0) : 0;
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilter('all');
//     setTypeFilter('all');
//   };

//   const StarRating = ({ rating }) => {
//     return (
//       <div className="flex items-center gap-0.5">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             className={`h-3 w-3 sm:h-4 sm:w-4 ${
//               star <= rating
//                 ? 'text-yellow-400 fill-current'
//                 : 'text-slate-300'
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

//   const getTypeBadge = (review) => {
//     if (!review.isProductReview) {
//       return (
//         <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 text-xs rounded-full">
//           <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
//           <span className="hidden xs:inline">General Feedback</span>
//           <span className="xs:hidden">Feedback</span>
//         </span>
//       );
//     } else if (review.source === 'embedded') {
//       return (
//         <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
//           <Info className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
//           <span className="hidden xs:inline">Legacy Review</span>
//           <span className="xs:hidden">Legacy</span>
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
//           <Package className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
//           <span className="hidden xs:inline">Product Review</span>
//           <span className="xs:hidden">Review</span>
//         </span>
//       );
//     }
//   };

//   const stats = {
//     productReviews: productReviews.length,
//     generalFeedbacks: generalFeedbacks.length,
//     averageRating: averageRating.toFixed(1),
//     totalResponses: reviews?.length || 0
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 sticky top-0 z-10">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Customer Feedback & Reviews</h1>
//           <p className="text-sm sm:text-base text-slate-500 mt-1">Monitor and manage all customer feedback including product reviews and general feedback</p>
//         </div>
//       </div>

//       <div className="p-4 sm:p-6 lg:p-8">
//         {/* Stats Overview - Responsive Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 lg:p-6">
//             <div className="flex items-center justify-between mb-2 sm:mb-3">
//               <div className="text-slate-500 text-xs sm:text-sm font-medium">Product Reviews</div>
//               <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
//                 <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
//               </div>
//             </div>
//             <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{stats.productReviews}</div>
//             <div className="text-xs sm:text-sm text-slate-500">product ratings</div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 lg:p-6">
//             <div className="flex items-center justify-between mb-2 sm:mb-3">
//               <div className="text-slate-500 text-xs sm:text-sm font-medium">General Feedback</div>
//               <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
//                 <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
//               </div>
//             </div>
//             <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{stats.generalFeedbacks}</div>
//             <div className="text-xs sm:text-sm text-slate-500">customer suggestions</div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 lg:p-6">
//             <div className="flex items-center justify-between mb-2 sm:mb-3">
//               <div className="text-slate-500 text-xs sm:text-sm font-medium">Average Rating</div>
//               <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
//                 <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 fill-current" />
//               </div>
//             </div>
//             <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{stats.averageRating}</div>
//             <div className="text-xs sm:text-sm text-slate-500">out of 5.0 stars</div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 lg:p-6">
//             <div className="flex items-center justify-between mb-2 sm:mb-3">
//               <div className="text-slate-500 text-xs sm:text-sm font-medium">Total Responses</div>
//               <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
//                 <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
//               </div>
//             </div>
//             <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{stats.totalResponses}</div>
//             <div className="text-xs sm:text-sm text-slate-500">total feedback received</div>
//           </div>
//         </div>

//         {/* Rating Distribution - Only for product reviews */}
//         {productReviews.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
//             <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Product Rating Distribution</h3>
//             <div className="space-y-2 sm:space-y-3">
//               {[5, 4, 3, 2, 1].map((rating) => {
//                 const count = ratingDistribution[rating];
//                 const percentage = getRatingPercentage(count);
//                 return (
//                   <div key={rating} className="flex flex-wrap items-center gap-2 sm:gap-3">
//                     <div className="w-12 sm:w-16 text-xs sm:text-sm text-slate-600">{rating} Star</div>
//                     <div className="flex-1 min-w-[100px]">
//                       <div className="h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-yellow-400 rounded-full transition-all duration-500"
//                           style={{ width: `${percentage}%` }}
//                         />
//                       </div>
//                     </div>
//                     <div className="w-12 sm:w-16 text-xs sm:text-sm text-slate-500 text-right">{count}</div>
//                     <div className="w-10 sm:w-12 text-xs sm:text-sm text-slate-400">{percentage}%</div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
      
//         {/* Search and Filters Bar */}
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
//           <div className="p-3 sm:p-4">
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by user, product, or comment..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none"
//                 />
//               </div>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-700"
//               >
//                 <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
//                 <span className="text-sm">Filters</span>
//                 {(filter !== 'all' || typeFilter !== 'all') && (
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
//                       Feedback Type
//                     </label>
//                     <select
//                       value={typeFilter}
//                       onChange={(e) => setTypeFilter(e.target.value)}
//                       className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none bg-white"
//                     >
//                       <option value="all">All Types</option>
//                       <option value="product-review">Product Reviews</option>
//                       <option value="general-feedback">General Feedback</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
//                       Rating Filter
//                     </label>
//                     <select
//                       value={filter}
//                       onChange={(e) => setFilter(e.target.value)}
//                       className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none bg-white"
//                     >
//                       <option value="all">All Ratings</option>
//                       <option value="5">5 Stars - Excellent</option>
//                       <option value="4">4 Stars - Good</option>
//                       <option value="3">3 Stars - Average</option>
//                       <option value="2">2 Stars - Poor</option>
//                       <option value="1">1 Star - Terrible</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="mt-3 sm:mt-4 flex justify-end">
//                   {(searchTerm || filter !== 'all' || typeFilter !== 'all') && (
//                     <button
//                       onClick={clearFilters}
//                       className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-600 hover:text-slate-800 transition-colors"
//                     >
//                       Clear all filters
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
      
//         {/* Reviews List */}
//         {loading ? (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-slate-800"></div>
//             <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500">Loading feedback...</p>
//           </div>
//         ) : filteredReviews?.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
//             <div className="text-slate-400 mb-3 sm:mb-4">
//               <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
//             </div>
//             <h3 className="text-base sm:text-lg font-medium text-slate-800 mb-1 sm:mb-2">No feedback found</h3>
//             <p className="text-sm sm:text-base text-slate-500">
//               {searchTerm || filter !== 'all' || typeFilter !== 'all'
//                 ? 'Try adjusting your search or filters' 
//                 : 'No customer feedback available yet'}
//             </p>
//             {(searchTerm || filter !== 'all' || typeFilter !== 'all') && (
//               <button
//                 onClick={clearFilters}
//                 className="mt-3 sm:mt-4 text-slate-600 hover:text-slate-700 text-xs sm:text-sm font-medium"
//               >
//                 Clear all filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-3 sm:space-y-4">
//             {filteredReviews?.map((review) => (
//               <div key={review._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
//                 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
//                   <div className="flex-1 min-w-0">
//                     {/* Header with type badge */}
//                     <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
//                       {getTypeBadge(review)}
//                       {review.category && (
//                         <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
//                           <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
//                           <span className="truncate max-w-[100px]">{review.category}</span>
//                         </span>
//                       )}
//                     </div>
                    
//                     {/* User Info */}
//                     <div className="flex items-start gap-2 sm:gap-3">
//                       <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
//                         {review.userName?.charAt(0).toUpperCase() || 'U'}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
//                           <h4 className="font-semibold text-slate-800 text-sm sm:text-base">{review.userName}</h4>
//                           <span className="text-xs text-slate-400">•</span>
//                           <div className="flex items-center gap-1 text-xs text-slate-500">
//                             <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
//                             <span className="whitespace-nowrap">
//                               {new Date(review.createdAt).toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'short',
//                                 day: 'numeric'
//                               })}
//                             </span>
//                           </div>
//                           {review.userEmail && review.userEmail !== 'No email' && (
//                             <>
//                               <span className="text-xs text-slate-400 hidden xs:inline">•</span>
//                               <span className="text-xs text-slate-500 truncate max-w-[150px] sm:max-w-none hidden xs:inline">{review.userEmail}</span>
//                             </>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
//                           <StarRating rating={review.rating} />
//                           <span className="text-xs sm:text-sm font-medium text-slate-600">{review.rating}.0</span>
//                         </div>
//                         {review.productName && (
//                           <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">
//                             <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
//                             <span className="break-words">
//                               Product: <span className="font-medium text-slate-700">{review.productName}</span>
//                             </span>
//                           </div>
//                         )}
//                         {review.comment && (
//                           <div className="bg-slate-50 rounded-lg p-2 sm:p-3">
//                             <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">{review.comment}</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Actions */}
//                   <div className="flex gap-1 sm:gap-2 flex-shrink-0 self-start">
//                     <button
//                       onClick={() => handleDelete(review._id, review.userName, review.isProductReview)}
//                       className="p-1.5 sm:p-2 text-slate-500 hover:text-red-600 transition-colors"
//                       title="Delete"
//                     >
//                       <Trash2 className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Reviews;