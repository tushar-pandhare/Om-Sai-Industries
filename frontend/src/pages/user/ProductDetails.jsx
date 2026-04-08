// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProductById, fetchProductReviews } from '../../features/prdoducts/productSlice';
// import { addToCart } from '../../features/cart/cartSlice';
// import FeedbackForm from '../../components/FeedbackForm';
// import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// const ProductDetails = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { selectedProduct, loading, productReviews } = useSelector((state) => state.products);
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState('description');

//   useEffect(() => {
//     dispatch(fetchProductById(id));
//   }, [dispatch, id]);

//   // Fetch reviews when product is loaded and reviews tab is active
//   // useEffect(() => {
//   //   if (selectedProduct?._id && activeTab === 'reviews') {
//   //     dispatch(fetchProductReviews(selectedProduct._id));
//   //   }
//   // }, [selectedProduct?._id, activeTab, dispatch]);

//   const handleAddToCart = () => {
//     dispatch(addToCart({ ...selectedProduct, quantity }));
//     navigate('/cart');
//   };

//   // Helper function to render star ratings
//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;
    
//     for (let i = 1; i <= 5; i++) {
//       if (i <= fullStars) {
//         stars.push(<FaStar key={i} className="text-yellow-400" />);
//       } else if (hasHalfStar && i === fullStars + 1) {
//         stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
//       } else {
//         stars.push(<FaRegStar key={i} className="text-yellow-400" />);
//       }
//     }
//     return stars;
//   };

//   // Calculate average rating from reviews
//   const calculateAverageRating = () => {
//     if (!productReviews || productReviews.length === 0) return 0;
//     const sum = productReviews.reduce((total, review) => total + review.rating, 0);
//     return (sum / productReviews.length).toFixed(1);
//   };

//   if (loading || !selectedProduct) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-xl">Loading product details...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="grid md:grid-cols-2 gap-8 p-6">
//           {/* Product Images */}
//           <div>
//             <img
//               src={selectedProduct.images?.[0] || '/api/placeholder/500/400'}
//               alt={selectedProduct.name}
//               className="w-full h-96 object-cover rounded-lg"
//             />
//             <div className="flex gap-2 mt-4">
//               {selectedProduct.images?.slice(1, 4).map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt={`${selectedProduct.name} ${index + 2}`}
//                   className="w-24 h-24 object-cover rounded cursor-pointer"
//                 />
//               ))}
//             </div>
//           </div>
          
//           {/* Product Info */}
//           <div>
//             <h1 className="text-3xl font-bold mb-2">{selectedProduct.name}</h1>
//             <p className="text-gray-600 mb-4">Category: {selectedProduct.category?.name}</p>
            
//             <div className="mb-4">
//               <span className="text-3xl font-bold text-orange-600">₹{selectedProduct.price}</span>
//               {selectedProduct.oldPrice && (
//                 <span className="text-gray-500 line-through ml-2">₹{selectedProduct.oldPrice}</span>
//               )}
//             </div>
            
//             <div className="mb-4">
//               <p className="text-gray-700">{selectedProduct.description}</p>
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="px-3 py-1 border rounded-md hover:bg-gray-100"
//                 >
//                   -
//                 </button>
//                 <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="px-3 py-1 border rounded-md hover:bg-gray-100"
//                 >
//                   +
//                 </button>
//                 <span className="text-sm text-gray-600 ml-2">
//                   {selectedProduct.stock} units available
//                 </span>
//               </div>
//             </div>
            
//             <div className="flex gap-4 mb-6">
//               <button
//                 onClick={handleAddToCart}
//                 className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
//               >
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
//                 Buy Now
//               </button>
//             </div>
            
//             {/* Product Specifications */}
//             <div className="border-t pt-4">
//               <h3 className="font-semibold mb-2">Product Specifications:</h3>
//               <ul className="space-y-1 text-sm text-gray-600">
//                 <li>✓ Free Shipping on orders above ₹999</li>
//                 <li>✓ 30-Day Return Policy</li>
//                 <li>✓ 1 Year Warranty</li>
//               </ul>
//             </div>
//           </div>
//         </div>
        
//         {/* Tabs Section */}
//         <div className="border-t">
//           <div className="flex border-b">
//             <button
//               onClick={() => setActiveTab('description')}
//               className={`px-6 py-3 font-medium ${
//                 activeTab === 'description'
//                   ? 'text-orange-600 border-b-2 border-orange-600'
//                   : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               Description
//             </button>
//             <button
//               onClick={() => setActiveTab('specifications')}
//               className={`px-6 py-3 font-medium ${
//                 activeTab === 'specifications'
//                   ? 'text-orange-600 border-b-2 border-orange-600'
//                   : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               Specifications
//             </button>
//             <button
//               onClick={() => setActiveTab('reviews')}
//               className={`px-6 py-3 font-medium flex items-center gap-2 ${
//                 activeTab === 'reviews'
//                   ? 'text-orange-600 border-b-2 border-orange-600'
//                   : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               Reviews
//               {productReviews && productReviews.length > 0 && (
//                 <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
//                   {productReviews.length}
//                 </span>
//               )}
//             </button>
//           </div>
          
//           <div className="p-6">
//             {activeTab === 'description' && (
//               <div>
//                 <p className="text-gray-700">{selectedProduct.description}</p>
//               </div>
//             )}
            
//             {activeTab === 'specifications' && (
//               <div>
//                 <table className="w-full">
//                   <tbody>
//                     {selectedProduct.specifications && Object.entries(selectedProduct.specifications).map(([key, value]) => (
//                       <tr key={key} className="border-b">
//                         <td className="py-2 font-semibold w-1/3">{key}</td>
//                         <td className="py-2">{value}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
            
//             {activeTab === 'reviews' && (
//               <div className="space-y-8">
//                 {/* Reviews Summary */}
//                 {productReviews && productReviews.length > 0 && (
//                   <div className="bg-gray-50 rounded-lg p-6">
//                     <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
//                     <div className="flex items-center gap-4 mb-6">
//                       <div className="text-center">
//                         <div className="text-4xl font-bold text-gray-800">
//                           {calculateAverageRating()}
//                         </div>
//                         <div className="flex items-center gap-1 mt-2">
//                           {renderStars(parseFloat(calculateAverageRating()))}
//                         </div>
//                         <div className="text-sm text-gray-600 mt-1">
//                           Based on {productReviews.length} reviews
//                         </div>
//                       </div>
//                       <div className="flex-1">
//                         {[5, 4, 3, 2, 1].map((star) => {
//                           const count = productReviews.filter(r => Math.floor(r.rating) === star).length;
//                           const percentage = (count / productReviews.length) * 100;
//                           return (
//                             <div key={star} className="flex items-center gap-2 mb-2">
//                               <div className="w-12 text-sm text-gray-600">{star} stars</div>
//                               <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                                 <div 
//                                   className="h-full bg-yellow-400 rounded-full"
//                                   style={{ width: `${percentage}%` }}
//                                 />
//                               </div>
//                               <div className="w-12 text-sm text-gray-600">{count}</div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Individual Reviews */}
//                 {productReviews && productReviews.length > 0 && (
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">All Reviews</h3>
//                     {productReviews.map((review) => (
//                       <div key={review._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <div className="flex items-center gap-2 mb-1">
//                               <div className="flex items-center gap-1">
//                                 {renderStars(review.rating)}
//                               </div>
//                               <span className="font-semibold text-gray-800">
//                                 {review.user?.name || 'Anonymous User'}
//                               </span>
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {review.createdAt && new Date(review.createdAt).toLocaleDateString('en-IN', {
//                                 year: 'numeric',
//                                 month: 'long',
//                                 day: 'numeric'
//                               })}
//                             </div>
//                           </div>
//                           {review.verified && (
//                             <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
//                               Verified Purchase
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-gray-700 mt-2">{review.comment}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
                
//                 {/* No Reviews Message */}
//                 {(!productReviews || productReviews.length === 0) && (
//                   <div className="text-center py-8 bg-gray-50 rounded-lg">
//                     <p className="text-gray-600 mb-2">No reviews yet for this product</p>
//                     <p className="text-sm text-gray-500">Be the first to share your experience!</p>
//                   </div>
//                 )}
                
//                 {/* Feedback Form - Product Specific */}
//                 <div className="mt-8">
//                   <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
//                   <FeedbackForm productId={selectedProduct._id} />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProductReviews, clearReviewSubmitStatus } from '../../features/prdoducts/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import FeedbackForm from '../../components/FeedbackForm';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaBolt, FaTruck, FaUndo, FaShieldAlt, FaShare, FaChevronLeft, FaChevronRight, FaUser, FaCalendar, FaCheckCircle } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading, productReviews, reviewSubmitSuccess } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProductReviews(id));
  }, [dispatch, id]);

  // Show toast when review is successfully submitted
  // useEffect(() => {
  //   if (reviewSubmitSuccess) {
  //     toast.success('Review submitted successfully! Thank you for your feedback.', {
  //       duration: 4000,
  //       position: 'top-center',
  //       icon: '⭐',
  //       style: {
  //         background: '#1F2937',
  //         color: '#fff',
  //         padding: '16px',
  //         borderRadius: '12px',
  //         fontSize: '14px',
  //         fontWeight: '500',
  //       },
  //     });
      
  //     // Refresh reviews after successful submission
  //     dispatch(fetchProductReviews(id));
      
  //     // Clear the success status
  //     setTimeout(() => {
  //       dispatch(clearReviewSubmitStatus());
  //     }, 3000);
  //   }
  // }, [reviewSubmitSuccess, dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...selectedProduct, quantity }));
    toast.success(`${quantity} item(s) added to cart!`, {
      duration: 2000,
      position: 'bottom-center',
      icon: '🛒',
      style: {
        background: '#3B82F6',
        color: '#fff',
        borderRadius: '10px',
      },
    });
    navigate('/cart');
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...selectedProduct, quantity }));
    toast.loading('Redirecting to checkout...', {
      duration: 1000,
    });
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Product link copied to clipboard!', {
      icon: '📋',
      duration: 2000,
    });
  };

  // Helper function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (!productReviews || productReviews.length === 0) return 0;
    const sum = productReviews.reduce((total, review) => total + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };

  if (loading || !selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading amazing product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-xs md:text-sm overflow-x-auto pb-2">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap">
            Home
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <button onClick={() => navigate('/products')} className="text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap">
            Products
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium truncate">{selectedProduct.name}</span>
        </nav>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-6 lg:p-8">
            {/* Product Images Section */}
            <div className="space-y-4">
              <div className="relative group overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={selectedProduct.images?.[mainImage] || '/api/placeholder/600/500'}
                  alt={selectedProduct.name}
                  className="w-full h-80 md:h-96 lg:h-[450px] object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                {/* Image Navigation Arrows */}
                {selectedProduct.images?.length > 1 && (
                  <>
                    <button
                      onClick={() => setMainImage((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1))}
                      className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 md:p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <FaChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setMainImage((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 md:p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <FaChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {selectedProduct.images?.length > 1 && (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
                  {selectedProduct.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(index)}
                      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        mainImage === index 
                          ? 'border-blue-600 shadow-lg transform scale-105' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <img src={img} alt={`${selectedProduct.name} view ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info Section */}
            <div className="space-y-5 md:space-y-6">
              {/* Title and Actions */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 leading-tight">{selectedProduct.name}</h1>
                  <p className="text-sm text-gray-500">Category: {selectedProduct.category?.name}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleShare}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110"
                    title="Share product"
                  >
                    <FaShare className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Rating Summary */}
              {productReviews && productReviews.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 md:gap-3 py-3 border-y border-gray-100">
                  <div className="flex items-center gap-1">
                    {renderStars(parseFloat(calculateAverageRating()))}
                  </div>
                  <span className="text-base md:text-lg font-semibold text-gray-800">{calculateAverageRating()}</span>
                  <span className="text-sm text-gray-500">({productReviews.length} reviews)</span>
                  <span className="text-green-600 text-xs md:text-sm font-medium">✓ Verified Ratings</span>
                </div>
              )}

              {/* Price */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
                  <span className="text-3xl md:text-4xl font-bold text-blue-600">₹{selectedProduct.price}</span>
                  {selectedProduct.oldPrice && (
                    <>
                      <span className="text-lg md:text-xl text-gray-500 line-through">₹{selectedProduct.oldPrice}</span>
                      <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs md:text-sm font-semibold">
                        Save ₹{selectedProduct.oldPrice - selectedProduct.price}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs md:text-sm text-green-600 mt-2">✓ Inclusive of all taxes</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Product Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{selectedProduct.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Quantity</label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 md:px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors font-bold text-lg"
                    >
                      -
                    </button>
                    <span className="px-6 md:px-8 py-2 text-lg font-semibold text-center min-w-[60px] md:min-w-[80px]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      className="px-3 md:px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs md:text-sm text-gray-500">
                    {selectedProduct.stock} units available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <FaShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-950 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <FaBolt className="w-4 h-4 md:w-5 md:h-5" />
                  Buy Now
                </button>
              </div>

              {/* Delivery Info */}
              <div className="border-t pt-4 space-y-2 md:space-y-3">
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                  <FaTruck className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  <span>Free delivery on orders above ₹999</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                  <FaUndo className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                  <FaShieldAlt className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  <span>1 year warranty</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto px-4 md:px-6">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-6 py-3 md:py-4 font-medium transition-all duration-300 relative whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                  )}
                  {tab === 'reviews' && productReviews && productReviews.length > 0 && (
                    <span className="ml-2 bg-gray-200 text-gray-700 px-1.5 md:px-2 py-0.5 rounded-full text-xs">
                      {productReviews.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-4 md:p-6 lg:p-8 bg-gray-50">
              {activeTab === 'description' && (
                <div className="max-w-3xl">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">Product Details</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{selectedProduct.description}</p>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">Technical Specifications</h3>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[300px]">
                        <tbody>
                          {selectedProduct.specifications && Object.entries(selectedProduct.specifications).map(([key, value], index) => (
                            <tr key={key} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100`}>
                              <td className="py-2 md:py-3 px-3 md:px-4 font-semibold text-gray-700 w-1/3 text-sm md:text-base">{key}</td>
                              <td className="py-2 md:py-3 px-3 md:px-4 text-gray-600 text-sm md:text-base">{value}</td>
                            </tr>)
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="space-y-6 md:space-y-8">
                  {/* Reviews Summary */}
                  {productReviews && productReviews.length > 0 && (
                    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Customer Reviews</h3>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="text-center md:text-left">
                          <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                            {calculateAverageRating()}
                          </div>
                          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                            {renderStars(parseFloat(calculateAverageRating()))}
                          </div>
                          <div className="text-xs md:text-sm text-gray-500">
                            Based on {productReviews.length} reviews
                          </div>
                        </div>
                        <div className="flex-1">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = productReviews.filter(r => Math.floor(r.rating) === star).length;
                            const percentage = (count / productReviews.length) * 100;
                            return (
                              <div key={star} className="flex items-center gap-2 md:gap-3 mb-2">
                                <div className="w-12 md:w-16 text-xs md:text-sm text-gray-600">{star} stars</div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <div className="w-10 md:w-12 text-xs md:text-sm text-gray-600">{count}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Individual Reviews */}
                  {productReviews && productReviews.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800">What customers are saying</h3>
                      <div className="space-y-4">
                        {productReviews.slice(0, 5).map((review, index) => (
                          <div key={review._id || index} className="bg-white rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center gap-1">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="font-semibold text-gray-800 text-sm md:text-base">
                                    {review.user?.name || 'Anonymous User'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <FaCalendar className="w-3 h-3" />
                                  <span>
                                    {review.createdAt && new Date(review.createdAt).toLocaleDateString('en-IN', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                              </div>
                              {review.verified && (
                                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1 self-start">
                                  <MdVerified className="w-3 h-3" />
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mt-2 leading-relaxed text-sm md:text-base">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                      {productReviews.length > 5 && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm md:text-base font-medium mt-2">
                          See all {productReviews.length} reviews →
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* No Reviews Message */}
                  {(!productReviews || productReviews.length === 0) && (
                    <div className="text-center py-8 md:py-12 bg-white rounded-xl">
                      <div className="text-5xl md:text-6xl mb-4">📝</div>
                      <p className="text-gray-600 mb-2 text-base md:text-lg">No reviews yet for this product</p>
                      <p className="text-xs md:text-sm text-gray-400">Be the first to share your experience!</p>
                    </div>
                  )}
                  
                  {/* Feedback Form - Improved Design */}
                  <div className="mt-6 md:mt-8">
                    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                      <div className="mb-4 md:mb-6">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">Write a Review</h3>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">Share your experience with this product to help other customers</p>
                      </div>
                      <FeedbackForm productId={selectedProduct._id} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
