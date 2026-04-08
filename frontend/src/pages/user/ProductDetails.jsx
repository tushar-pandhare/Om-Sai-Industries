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
import { fetchOffers } from '../../features/offers/offerSlice';
import { addToCart } from '../../features/cart/cartSlice';
import FeedbackForm from '../../components/FeedbackForm';
import { 
  FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaBolt, 
  FaTruck, FaUndo, FaShieldAlt, FaShare, FaChevronLeft, 
  FaChevronRight, FaCalendar, FaCheckCircle, FaGift, FaTag, 
  FaPercentage, FaHeart, FaEye, FaClock, FaBoxOpen, 
  FaExclamationTriangle, FaStore, FaCreditCard, FaWallet
} from 'react-icons/fa';
import { MdVerified, MdLocalShipping, MdSecurity, MdPayment } from 'react-icons/md';
import { BiSolidDiscount, BiRupee } from 'react-icons/bi';
import { GiReturnArrow } from 'react-icons/gi';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading, productReviews, reviewSubmitSuccess } = useSelector((state) => state.products);
  const { offers } = useSelector((state) => state.offers);
  const { userInfo } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState(0);
  const [bestOffer, setBestOffer] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [savedAmount, setSavedAmount] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProductReviews(id));
    dispatch(fetchOffers());
  }, [dispatch, id]);

  // Calculate best offer for the product
  useEffect(() => {
    if (selectedProduct && offers && offers.length > 0) {
      calculateBestOffer();
    }
  }, [selectedProduct, offers]);

  const calculateBestOffer = () => {
    if (!selectedProduct || !offers) return;

    const currentDate = new Date();
    let bestDiscount = 0;
    let bestOfferData = null;

    offers.forEach(offer => {
      const offerStartDate = new Date(offer.startDate);
      const offerEndDate = new Date(offer.endDate);
      
      if (offerStartDate <= currentDate && offerEndDate >= currentDate && offer.isActive) {
        let isProductEligible = false;
        
        if (offer.applicableProducts && offer.applicableProducts.length > 0) {
          isProductEligible = offer.applicableProducts.some(
            product => product._id === selectedProduct._id || product === selectedProduct._id
          );
        } else {
          isProductEligible = true;
        }

        if (isProductEligible) {
          let discountAmount = 0;
          
          if (offer.discountType === 'percentage') {
            discountAmount = (selectedProduct.price * offer.discountValue) / 100;
          } else if (offer.discountType === 'fixed') {
            discountAmount = offer.discountValue;
          }

          if (discountAmount > bestDiscount) {
            bestDiscount = discountAmount;
            bestOfferData = offer;
          }
        }
      }
    });

    if (bestOfferData && bestDiscount > 0) {
      const finalPrice = Math.max(0, selectedProduct.price - bestDiscount);
      setDiscountedPrice(finalPrice);
      setSavedAmount(bestDiscount);
      setBestOffer(bestOfferData);
    } else {
      setDiscountedPrice(null);
      setSavedAmount(0);
      setBestOffer(null);
    }
  };

  useEffect(() => {
    if (reviewSubmitSuccess) {
      toast.success('Review submitted successfully! Thank you for your feedback.', {
        duration: 4000,
        position: 'top-center',
        icon: '⭐',
        style: {
          background: '#1F2937',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
      
      dispatch(fetchProductReviews(id));
      
      setTimeout(() => {
        dispatch(clearReviewSubmitStatus());
      }, 3000);
    }
  }, [reviewSubmitSuccess, dispatch, id]);

  const handleAddToCart = () => {
    // Check if product is out of stock
    if (selectedProduct.stock === 0) {
      toast.error('This product is out of stock!', {
        duration: 3000,
        position: 'top-center',
        icon: '❌',
        style: {
          background: '#DC2626',
          color: '#fff',
          borderRadius: '12px',
        },
      });
      return;
    }

    if (!userInfo) {
      toast.error('Please login to add items to cart', {
        duration: 3000,
        position: 'top-center',
        icon: '🔐',
      });
      navigate('/login');
      return;
    }
    
    const productToAdd = {
      ...selectedProduct,
      quantity,
      price: discountedPrice || selectedProduct.price,
      originalPrice: selectedProduct.price,
      appliedOffer: bestOffer ? {
        id: bestOffer._id,
        title: bestOffer.title,
        discountType: bestOffer.discountType,
        discountValue: bestOffer.discountValue
      } : null
    };
    
    dispatch(addToCart(productToAdd));
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
    // Check if product is out of stock
    if (selectedProduct.stock === 0) {
      toast.error('This product is out of stock!', {
        duration: 3000,
        position: 'top-center',
        icon: '❌',
      });
      return;
    }
    
    if (!userInfo) {
      toast.error('Please login to purchase', {
        duration: 3000,
        position: 'top-center',
        icon: '🔐',
      });
      navigate('/login');
      return;
    }
    
    const productToAdd = {
      ...selectedProduct,
      quantity,
      price: discountedPrice || selectedProduct.price,
      originalPrice: selectedProduct.price,
      appliedOffer: bestOffer ? {
        id: bestOffer._id,
        title: bestOffer.title,
        discountType: bestOffer.discountType,
        discountValue: bestOffer.discountValue
      } : null
    };
    
    dispatch(addToCart(productToAdd));
    toast.loading('Redirecting to checkout...', {
      duration: 1000,
    });
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      toast.success('Product link copied to clipboard!', {
        icon: '📋',
        duration: 2000,
      });
      setTimeout(() => setShowShareTooltip(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleWishlist = () => {
    if (!userInfo) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

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

  const calculateAverageRating = () => {
    if (!productReviews || productReviews.length === 0) return 0;
    const sum = productReviews.reduce((total, review) => total + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };

  if (loading || !selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading amazing product details...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the best deals for you</p>
        </div>
      </div>
    );
  }

  const displayPrice = discountedPrice || selectedProduct.price;
  const hasDiscount = discountedPrice && discountedPrice < selectedProduct.price;
  const isOutOfStock = selectedProduct.stock === 0;
  const isLowStock = selectedProduct.stock > 0 && selectedProduct.stock < 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 p-6 md:p-8 lg:p-10">
            {/* Product Images Section */}
            <div className="space-y-4">
              <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={selectedProduct.images?.[mainImage] || '/api/placeholder/600/500'}
                  alt={selectedProduct.name}
                  className="w-full h-80 md:h-96 lg:h-[450px] object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Stock Status Badge */}
                {isOutOfStock ? (
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-pulse">
                      <FaExclamationTriangle className="w-4 h-4" />
                      <span className="text-xs font-bold">OUT OF STOCK</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {hasDiscount && bestOffer && (
                      <div className="absolute top-4 left-4 z-20 animate-bounce">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                          <FaGift className="w-4 h-4" />
                          <span className="text-xs font-bold">{bestOffer.title}</span>
                        </div>
                      </div>
                    )}
                    {isLowStock && !isOutOfStock && (
                      <div className="absolute top-4 left-4 z-20">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                          <FaClock className="w-4 h-4" />
                          <span className="text-xs font-bold">Only {selectedProduct.stock} left!</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Image Navigation Arrows */}
                {selectedProduct.images?.length > 1 && (
                  <>
                    <button
                      onClick={() => setMainImage((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white p-2 md:p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    >
                      <FaChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setMainImage((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white p-2 md:p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    >
                      <FaChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {selectedProduct.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {selectedProduct.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        mainImage === index 
                          ? 'border-blue-600 shadow-xl transform scale-105' 
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <img src={img} alt={`${selectedProduct.name} view ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info Section */}
            <div className="space-y-6">
              {/* Title and Actions */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 leading-tight">{selectedProduct.name}</h1>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaStore className="text-blue-500" />
                    Category: {selectedProduct.category?.name}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleWishlist}
                    className="relative p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110 group"
                    title="Add to wishlist"
                  >
                    <FaHeart className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600 group-hover:text-red-500'}`} />
                  </button>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110"
                      title="Share product"
                    >
                      <FaShare className="w-5 h-5 text-gray-600" />
                    </button>
                    {showShareTooltip && (
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
                        Copied!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating Summary */}
              {productReviews && productReviews.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 py-3 border-y border-gray-100 bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1">
                    {renderStars(parseFloat(calculateAverageRating()))}
                  </div>
                  <span className="text-base md:text-lg font-bold text-gray-800">{calculateAverageRating()}</span>
                  <span className="text-sm text-gray-500">({productReviews.length} reviews)</span>
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FaCheckCircle className="w-3 h-3" />
                    Verified Ratings
                  </span>
                </div>
              )}

              {/* Price with Offer */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-5 rounded-2xl">
                <div className="flex flex-wrap items-baseline gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-4xl md:text-5xl font-bold text-red-600 flex items-center gap-1">
                        <BiRupee className="w-6 h-6" />
                        {Math.round(displayPrice).toLocaleString()}
                      </span>
                      <span className="text-xl md:text-2xl text-gray-500 line-through flex items-center gap-1">
                        <BiRupee className="w-5 h-5" />
                        {selectedProduct.price.toLocaleString()}
                      </span>
                      <span className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                        Save ₹{Math.round(savedAmount).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl md:text-5xl font-bold text-gray-800 flex items-center gap-1">
                      <BiRupee className="w-6 h-6" />
                      {selectedProduct.price.toLocaleString()}
                    </span>
                  )}
                </div>
                
                {/* Offer Details */}
                {bestOffer && !isOutOfStock && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                      <FaTag className="text-orange-500" />
                      <span className="font-bold text-orange-700">Offer Applied:</span>
                      <span className="text-gray-700 font-medium">{bestOffer.title}</span>
                      {bestOffer.discountType === 'percentage' ? (
                        <span className="text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full text-xs">
                          {bestOffer.discountValue}% OFF
                        </span>
                      ) : (
                        <span className="text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full text-xs">
                          ₹{bestOffer.discountValue} OFF
                        </span>
                      )}
                    </div>
                    {bestOffer.description && (
                      <p className="text-xs text-gray-600 mt-2 ml-6">{bestOffer.description}</p>
                    )}
                  </div>
                )}
                
                <p className="text-xs md:text-sm text-green-600 mt-3 flex items-center gap-1">
                  <FaCheckCircle className="w-3 h-3" />
                  Inclusive of all taxes
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <FaTruck className="text-blue-500 w-5 h-5" />
                  <span className="text-xs text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <GiReturnArrow className="text-green-500 w-5 h-5" />
                  <span className="text-xs text-gray-600">30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <MdSecurity className="text-purple-500 w-5 h-5" />
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <FaWallet className="text-orange-500 w-5 h-5" />
                  <span className="text-xs text-gray-600">COD Available</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-gray-800 mb-2 text-base">Product Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{selectedProduct.description}</p>
              </div>

              {/* Quantity Selector - Disabled when out of stock */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Quantity</label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`flex items-center border-2 rounded-xl overflow-hidden ${isOutOfStock ? 'border-gray-200 bg-gray-100' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      className={`px-4 py-2 font-bold text-lg transition-colors ${
                        isOutOfStock 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      -
                    </button>
                    <span className={`px-8 py-2 text-lg font-semibold text-center min-w-[80px] ${isOutOfStock ? 'text-gray-400' : 'text-gray-800'}`}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      disabled={isOutOfStock}
                      className={`px-4 py-2 font-bold text-lg transition-colors ${
                        isOutOfStock 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      +
                    </button>
                  </div>
                  {!isOutOfStock && (
                    <span className="text-sm text-gray-500">
                      {selectedProduct.stock} units available
                    </span>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      ⚡ Hurry! Only {selectedProduct.stock} left
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons - Disabled when out of stock */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {isOutOfStock ? (
                  <>
                    <button
                      disabled
                      className="flex-1 bg-gray-300 text-gray-500 py-4 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2 text-base"
                    >
                      <FaBoxOpen className="w-5 h-5" />
                      Out of Stock
                    </button>
                    <button
                      onClick={() => navigate('/products')}
                      className="flex-1 bg-gradient-to-r from-gray-600 to-gray-800 text-white py-4 rounded-xl font-bold hover:from-gray-700 hover:to-gray-900 transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg"
                    >
                      <FaEye className="w-5 h-5" />
                      Browse Other Products
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-base"
                    >
                      <FaShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white py-4 rounded-xl font-bold hover:from-gray-800 hover:to-gray-950 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-base"
                    >
                      <FaBolt className="w-5 h-5" />
                      Buy Now
                    </button>
                  </>
                )}
              </div>

              {/* Out of Stock Message */}
              {isOutOfStock && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="text-red-500 w-5 h-5 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-700 mb-1">Currently Unavailable</h4>
                      <p className="text-sm text-red-600">This product is out of stock. Please check back later or explore similar products.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MdLocalShipping className="w-5 h-5 text-blue-500" />
                  <span>Free delivery on orders above ₹999</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <GiReturnArrow className="w-5 h-5 text-green-500" />
                  <span>30-day easy returns & exchange</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MdSecurity className="w-5 h-5 text-purple-500" />
                  <span>1 year manufacturer warranty</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto px-6 md:px-8 bg-gray-50">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold transition-all duration-300 relative whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                  )}
                  {tab === 'reviews' && productReviews && productReviews.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                      {productReviews.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-6 md:p-8 bg-gray-50">
              {activeTab === 'description' && (
                <div className="max-w-3xl">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Product Details</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Technical Specifications</h3>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <tbody>
                          {selectedProduct.specifications && Object.entries(selectedProduct.specifications).map(([key, value], index) => (
                            <tr key={key} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100`}>
                              <td className="py-3 px-4 font-semibold text-gray-700 w-1/3">{key}</td>
                              <td className="py-3 px-4 text-gray-600">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Reviews Summary */}
                  {productReviews && productReviews.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-md">
                      <h3 className="text-xl font-bold mb-4 text-gray-800">Customer Reviews</h3>
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="text-center md:text-left">
                          <div className="text-5xl font-bold text-gray-800 mb-2">
                            {calculateAverageRating()}
                          </div>
                          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                            {renderStars(parseFloat(calculateAverageRating()))}
                          </div>
                          <div className="text-sm text-gray-500">
                            Based on {productReviews.length} reviews
                          </div>
                        </div>
                        <div className="flex-1">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = productReviews.filter(r => Math.floor(r.rating) === star).length;
                            const percentage = (count / productReviews.length) * 100;
                            return (
                              <div key={star} className="flex items-center gap-3 mb-2">
                                <div className="w-16 text-sm text-gray-600">{star} stars</div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <div className="w-12 text-sm text-gray-600">{count}</div>
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
                      <h3 className="text-lg font-bold text-gray-800">What customers are saying</h3>
                      <div className="space-y-4">
                        {productReviews.slice(0, 5).map((review, index) => (
                          <div key={review._id || index} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center gap-1">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="font-semibold text-gray-800">
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
                            <p className="text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                      {productReviews.length > 5 && (
                        <button className="text-blue-600 hover:text-blue-700 font-medium mt-2">
                          See all {productReviews.length} reviews →
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* No Reviews Message */}
                  {(!productReviews || productReviews.length === 0) && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                      <div className="text-6xl mb-4">📝</div>
                      <p className="text-gray-600 mb-2 text-lg">No reviews yet for this product</p>
                      <p className="text-sm text-gray-400">Be the first to share your experience!</p>
                    </div>
                  )}
                  
                  {/* Feedback Form */}
                  <div className="mt-8">
                    <div className="bg-white rounded-2xl p-6 shadow-md">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Write a Review</h3>
                        <p className="text-sm text-gray-500 mt-1">Share your experience with this product to help other customers</p>
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