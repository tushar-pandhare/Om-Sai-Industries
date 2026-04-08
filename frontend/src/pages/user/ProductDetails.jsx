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
  FaHeart, FaEye, FaClock, FaBoxOpen, 
  FaExclamationTriangle, FaStore, FaCreditCard, FaWallet,
  FaInfoCircle, FaRuler, FaWeightHanging, FaBox, FaShippingFast,
  FaThumbsUp, FaUserCheck
} from 'react-icons/fa';
import { MdVerified, MdLocalShipping, MdSecurity, MdPayment, MdOutlineDiscount } from 'react-icons/md';
import { BiRupee } from 'react-icons/bi';
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
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProductReviews(id));
    dispatch(fetchOffers());
  }, [dispatch, id]);

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
    if (selectedProduct.stock === 0) {
      toast.error('This product is out of stock!', {
        duration: 3000,
        position: 'top-center',
        icon: '❌',
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
    });
    navigate('/cart');
  };

  const handleBuyNow = () => {
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
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  const displayPrice = discountedPrice || selectedProduct.price;
  const hasDiscount = discountedPrice && discountedPrice < selectedProduct.price;
  const isOutOfStock = selectedProduct.stock === 0;
  const isLowStock = selectedProduct.stock > 0 && selectedProduct.stock < 10;
  const discountPercent = hasDiscount ? Math.round(((selectedProduct.price - discountedPrice) / selectedProduct.price) * 100) : 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6 overflow-x-auto pb-2">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap">
            Home
          </button>
          <span className="text-gray-400">/</span>
          <button onClick={() => navigate('/products')} className="text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap">
            Products
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium truncate">{selectedProduct.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
              <img
                src={selectedProduct.images?.[selectedImage] || '/api/placeholder/600/600'}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              {isOutOfStock ? (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                  Out of Stock
                </div>
              ) : (
                <>
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                      {discountPercent}% OFF
                    </div>
                  )}
                  {isLowStock && (
                    <div className="absolute top-4 right-4 bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                      Only {selectedProduct.stock} left
                    </div>
                  )}
                </>
              )}
              
              {/* Navigation Arrows */}
              {selectedProduct.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  >
                    <FaChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  >
                    <FaChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails */}
            {selectedProduct.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {selectedProduct.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-blue-600 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {selectedProduct.name}
                </h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleWishlist}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <FaHeart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </button>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      aria-label="Share product"
                    >
                      <FaShare className="w-5 h-5 text-gray-600" />
                    </button>
                    {showShareTooltip && (
                      <div className="absolute top-full right-0 mt-2 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap z-10">
                        Copied!
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <FaStore className="text-blue-500" />
                  {selectedProduct.category?.name}
                </span>
              </div>
            </div>

            {/* Rating */}
            {productReviews && productReviews.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(parseFloat(calculateAverageRating()))}
                </div>
                <span className="text-lg font-semibold text-gray-800">{calculateAverageRating()}</span>
                <span className="text-sm text-gray-500">({productReviews.length} reviews)</span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <FaCheckCircle className="w-3 h-3" />
                  Verified
                </span>
              </div>
            )}

            {/* Price */}
            <div className="border-t border-b border-gray-100 py-4">
              <div className="flex items-baseline gap-3">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl md:text-4xl font-bold text-gray-900">
                      ₹{Math.round(displayPrice).toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{selectedProduct.price.toLocaleString()}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-sm font-semibold">
                      Save ₹{Math.round(savedAmount).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">
                    ₹{selectedProduct.price.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <FaCheckCircle className="w-3 h-3" />
                Inclusive of all taxes
              </p>
            </div>

            {/* Offer Banner */}
            {bestOffer && !isOutOfStock && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MdOutlineDiscount className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900">{bestOffer.title}</p>
                    <p className="text-sm text-blue-700 mt-1">{bestOffer.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-medium">
                        {bestOffer.discountType === 'percentage' 
                          ? `${bestOffer.discountValue}% OFF` 
                          : `₹${bestOffer.discountValue} OFF`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaTruck className="text-blue-500" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GiReturnArrow className="text-green-500" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MdSecurity className="text-purple-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaWallet className="text-blue-500" />
                <span>COD Available</span>
              </div>
            </div>

            {/* Description Preview */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {selectedProduct.description?.substring(0, 150)}
                {selectedProduct.description?.length > 150 && '...'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className={`px-4 py-2 text-lg font-medium transition-colors ${
                      isOutOfStock 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    -
                  </button>
                  <span className={`w-16 text-center py-2 text-gray-900 font-medium ${isOutOfStock ? 'text-gray-400' : ''}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    disabled={isOutOfStock}
                    className={`px-4 py-2 text-lg font-medium transition-colors ${
                      isOutOfStock 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white hover:bg-gray-50 text-gray-700'
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
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {isOutOfStock ? (
                <>
                  <button
                    disabled
                    className="flex-1 bg-gray-200 text-gray-500 py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaBoxOpen className="w-5 h-5" />
                    Out of Stock
                  </button>
                  <button
                    onClick={() => navigate('/products')}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEye className="w-5 h-5" />
                    Browse Products
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaBolt className="w-5 h-5" />
                    Buy Now
                  </button>
                </>
              )}
            </div>

            {/* Delivery Info */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaShippingFast className="w-5 h-5 text-blue-500" />
                <span>Free delivery on orders above ₹999</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaUndo className="w-5 h-5 text-green-500" />
                <span>30-day easy returns & exchange</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaShieldAlt className="w-5 h-5 text-purple-500" />
                <span>1 year manufacturer warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 overflow-x-auto">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'reviews' && productReviews && productReviews.length > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {productReviews.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                
                {selectedProduct.features && selectedProduct.features.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 ? (
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                          <div className="font-medium text-gray-700">{key}</div>
                          <div className="md:col-span-2 text-gray-600">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No specifications available for this product.</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Rating Summary */}
                {productReviews && productReviews.length > 0 ? (
                  <>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Summary</h3>
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="text-center md:text-left">
                          <div className="text-5xl font-bold text-gray-900 mb-2">
                            {calculateAverageRating()}
                          </div>
                          <div className="flex justify-center md:justify-start gap-1 mb-2">
                            {renderStars(parseFloat(calculateAverageRating()))}
                          </div>
                          <div className="text-sm text-gray-500">
                            Based on {productReviews.length} reviews
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = productReviews.filter(r => Math.floor(r.rating) === star).length;
                            const percentage = (count / productReviews.length) * 100;
                            return (
                              <div key={star} className="flex items-center gap-3">
                                <div className="w-16 text-sm text-gray-600">{star} star</div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-yellow-500 rounded-full transition-all"
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

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                      <div className="space-y-4">
                        {productReviews.slice(0, 5).map((review) => (
                          <div key={review._id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex gap-1">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="font-medium text-gray-900">
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
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                  <MdVerified className="w-3 h-3" />
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-gray-600 mb-2">No reviews yet for this product</p>
                    <p className="text-sm text-gray-400">Be the first to share your experience!</p>
                  </div>
                )}

                {/* Write a Review */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                  <FeedbackForm productId={selectedProduct._id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;