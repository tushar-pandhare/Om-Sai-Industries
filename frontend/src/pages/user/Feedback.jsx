// components/FeedbackForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, submitFeedback } from '../../features/prdoducts/productSlice';
import toast from 'react-hot-toast';
import { FaStar, FaRegStar, FaUserCircle, FaCheckCircle, FaExclamationCircle, FaSpinner, FaQuoteLeft, FaSmile, FaHeart, FaStarHalfAlt, FaArrowLeft } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { Link } from 'react-router-dom';

const FeedbackForm = ({ productId, isGeneralFeedback = false }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  
  const currentUser = auth.userInfo || auth.user;
  const isAuthenticated = !!currentUser;
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ rating: false, comment: false });
  const [isFocused, setIsFocused] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const ratingLabels = {
    1: { text: 'Poor', emoji: '😞', color: 'text-red-500', description: 'Not satisfied at all' },
    2: { text: 'Fair', emoji: '😐', color: 'text-orange-500', description: 'Could be better' },
    3: { text: 'Good', emoji: '🙂', color: 'text-yellow-500', description: 'Met my expectations' },
    4: { text: 'Very Good', emoji: '😊', color: 'text-lime-500', description: 'Impressed with quality' },
    5: { text: 'Excellent', emoji: '🤩', color: 'text-green-500', description: 'Absolutely amazing!' }
  };

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ rating: true, comment: true });
    
    if (!isAuthenticated) {
      toast.error('Please login to submit feedback', {
        duration: 3000,
        icon: '🔒',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          borderRadius: '12px',
        },
      });
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating', {
        duration: 3000,
        icon: '⭐',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          borderRadius: '12px',
        },
      });
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please write your feedback', {
        duration: 3000,
        icon: '📝',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          borderRadius: '12px',
        },
      });
      return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting your feedback...');
    
    try {
      if (!isGeneralFeedback && productId) {
        await dispatch(createReview({ 
          productId: productId,
          rating: rating,
          comment: comment
        })).unwrap();
        
        toast.dismiss(loadingToast);
        toast.success(
          (t) => (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Review Submitted! 🎉</p>
                <p className="text-sm text-gray-600">Thank you for sharing your experience</p>
              </div>
            </div>
          ),
          {
            duration: 4000,
            style: {
              background: '#F0FDF4',
              borderRadius: '12px',
              padding: '12px',
              border: '1px solid #86EFAC',
            },
          }
        );
      } else {
        await dispatch(submitFeedback({ 
          rating: rating,
          comment: comment,
          userName: currentUser.name,
          userEmail: currentUser.email
        })).unwrap();
        
        toast.dismiss(loadingToast);
        toast.success(
          (t) => (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Feedback Sent! 🙏</p>
                <p className="text-sm text-gray-600">We appreciate your input</p>
              </div>
            </div>
          ),
          {
            duration: 4000,
            style: {
              background: '#F0FDF4',
              borderRadius: '12px',
              padding: '12px',
              border: '1px solid #86EFAC',
            },
          }
        );
      }
      
      // Reset form after successful submission
      setRating(0);
      setComment('');
      setTouched({ rating: false, comment: false });
      setSubmitSuccess(true);
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        (t) => (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Submission Failed</p>
              <p className="text-sm text-gray-600">{error.message || 'Please try again later'}</p>
            </div>
          </div>
        ),
        {
          duration: 4000,
          style: {
            background: '#FEF2F2',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid #FCA5A5',
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1.5 md:gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              setRating(star);
              setTouched({ ...touched, rating: true });
            }}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transform transition-all duration-200 hover:scale-110 group"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            {(hoveredRating || rating) >= star ? (
              <FaStar className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-yellow-400 drop-shadow-md transition-all duration-200" />
            ) : (
              <FaRegStar className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-gray-300 transition-all duration-200 group-hover:text-yellow-200" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const getCurrentRatingInfo = () => {
    if (rating === 0) return null;
    const info = ratingLabels[rating];
    return (
      <div className={`flex items-center gap-2 animate-fadeIn ${info.color}`}>
        <span className="text-xl md:text-2xl">{info.emoji}</span>
        <div>
          <p className="font-semibold text-sm md:text-base">{info.text}</p>
          <p className="text-xs text-gray-500 hidden sm:block">{info.description}</p>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 md:p-12 text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationCircle className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Login Required</h3>
          <p className="text-gray-600 mb-8 text-sm md:text-base">Please sign in to share your experience and write a review</p>
          <Link 
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <FaUserCircle className="w-5 h-5 mr-2" />
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  const isFormValid = rating > 0 && comment.trim().length > 0;

  const getHeaderTitle = () => {
    if (!isGeneralFeedback && productId) {
      return "Write a Product Review";
    }
    return "Share Your General Feedback";
  };

  const getHeaderSubtitle = () => {
    if (!isGeneralFeedback && productId) {
      return "Tell us what you think about this product";
    }
    return "Help us improve our services";
  };

  const getPlaceholder = () => {
    if (!isGeneralFeedback && productId) {
      return "Share your experience with this product...";
    }
    return "Tell us about your overall experience with our products and services...";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link 
          to={productId ? `/product/${productId}` : "/products"} 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 group"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl md:rounded-3xl p-6 md:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative flex items-start gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FaHeart className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">{getHeaderTitle()}</h1>
              <p className="text-indigo-100 text-sm md:text-base">{getHeaderSubtitle()}</p>
            </div>
            {submitSuccess && (
              <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-medium animate-pulse shadow-lg">
                ✓ Submitted!
              </div>
            )}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8">
            {/* User Info Section */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4 border border-slate-100">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-md flex-shrink-0">
                {currentUser.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Reviewing as</p>
                <p className="text-base md:text-lg font-semibold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate hidden sm:block">{currentUser.email}</p>
              </div>
              <div className="bg-emerald-100 rounded-full p-2 flex-shrink-0">
                <MdVerified className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
                Your Rating <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-slate-400 lowercase">(required)</span>
              </label>
              <div className="bg-slate-50 rounded-xl p-5 md:p-6 transition-all duration-300 hover:shadow-md border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                  {renderStars()}
                  {getCurrentRatingInfo()}
                </div>
                {rating === 0 && (
                  <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                    <FaSmile className="w-3 h-3" />
                    Click on stars to rate your experience
                  </p>
                )}
                {touched.rating && rating === 0 && (
                  <p className="text-red-500 text-xs mt-3 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    Please select a rating
                  </p>
                )}
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
                Your Feedback <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-slate-400 lowercase">(required)</span>
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 text-slate-300">
                  <FaQuoteLeft className="w-4 h-4" />
                </div>
                <textarea
                  rows={6}
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setTouched({ ...touched, comment: true });
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full px-10 md:px-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none text-sm md:text-base
                    ${isFocused 
                      ? 'border-indigo-400 ring-4 ring-indigo-100' 
                      : 'border-slate-200 hover:border-slate-300'
                    }
                    ${touched.comment && !comment.trim() 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'bg-slate-50/50'
                    }
                  `}
                  placeholder={getPlaceholder()}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white px-2 py-0.5 rounded-full shadow-sm">
                  {comment.length}/500
                </div>
              </div>
              {comment.length > 0 && comment.length < 20 && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <FaSmile className="w-3 h-3" />
                  Tip: Add more details to help other customers
                </p>
              )}
              {comment.length > 100 && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <FaCheckCircle className="w-3 h-3" />
                  Great detailed feedback!
                </p>
              )}
              {touched.comment && !comment.trim() && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <FaExclamationCircle className="w-3 h-3" />
                  Please write your feedback
                </p>
              )}
            </div>

            {/* Tips Section */}
            <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
              <p className="text-xs font-bold text-indigo-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <span className="text-lg">💡</span> Pro Tips for Great Reviews:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-indigo-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  <span>Be specific about your experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  <span>Mention what you liked/disliked</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  <span>Include photos if possible</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  <span>Keep it respectful and constructive</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin w-5 h-5" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setRating(0);
                  setComment('');
                  setTouched({ rating: false, comment: false });
                  setHoveredRating(0);
                  toast.success('Form cleared', {
                    icon: '🗑️',
                    duration: 1500,
                    style: {
                      background: '#F3F4F6',
                      color: '#374151',
                      borderRadius: '10px',
                    },
                  });
                }}
                className="px-6 py-3.5 border-2 border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
              >
                Clear Form
              </button>
            </div>

            {/* Footer Note */}
            <div className="border-t border-slate-100 pt-6 mt-2">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <MdVerified className="w-4 h-4 text-emerald-500" />
                  <span>Your review helps other customers make better decisions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🔒</span>
                  <span>Your email stays private and secure</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.02);
          }
        }
        .animate-pulse {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default FeedbackForm;