import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../features/prdoducts/productSlice';
import { FaStar, FaRegStar, FaUserCircle, FaCheckCircle, FaSpinner, FaQuoteLeft, FaSmile, FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const FeedbackForm = ({ productId }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const ratingLabels = {
    1: { text: 'Poor', color: 'text-red-500', emoji: '😞', description: 'Not satisfied at all' },
    2: { text: 'Fair', color: 'text-orange-500', emoji: '😐', description: 'Could be better' },
    3: { text: 'Good', color: 'text-yellow-500', emoji: '🙂', description: 'Met my expectations' },
    4: { text: 'Very Good', color: 'text-lime-500', emoji: '😊', description: 'Impressed with quality' },
    5: { text: 'Excellent', color: 'text-green-500', emoji: '🤩', description: 'Absolutely amazing!' }
  };

  useEffect(() => {
    if (rating > 0 && comment.length > 0) {
      // Form is valid
    }
  }, [rating, comment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      toast.error('Please login to submit a review', {
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
      toast.error('Please write your review', {
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
    const loadingToast = toast.loading('Submitting your review...');

    try {
      await dispatch(createReview({ productId, rating, comment })).unwrap();
      
      toast.dismiss(loadingToast);
      toast.success(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Review Submitted!</p>
            <p className="text-sm text-gray-600">Thank you for sharing your experience</p>
          </div>
        </div>,
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
      
      // Reset form
      setRating(0);
      setComment('');
      setHoverRating(0);
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Submission Failed</p>
            <p className="text-sm text-gray-600">{error.message || 'Please try again later'}</p>
          </div>
        </div>,
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
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transform transition-all duration-200 hover:scale-110"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            {star <= (hoverRating || rating) ? (
              <FaStar className="w-8 h-8 sm:w-9 sm:h-9 text-yellow-400 drop-shadow-md transition-all duration-200" />
            ) : (
              <FaRegStar className="w-8 h-8 sm:w-9 sm:h-9 text-gray-300 transition-all duration-200" />
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
        <span className="text-2xl">{info.emoji}</span>
        <div>
          <p className="font-semibold">{info.text}</p>
          <p className="text-xs text-gray-500">{info.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <FaHeart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Share Your Experience</h3>
            <p className="text-blue-100 text-sm mt-0.5">Your feedback helps us improve</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* User Info Section */}
        {userInfo && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {userInfo.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Reviewing as</p>
              <p className="text-base font-medium text-gray-900">{userInfo.name}</p>
              <p className="text-xs text-gray-500">{userInfo.email}</p>
            </div>
            <div className="bg-green-100 rounded-full p-1.5">
              <FaCheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
        )}

        {/* Rating Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="bg-gray-50 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {renderStars()}
              {getCurrentRatingInfo()}
            </div>
            {rating === 0 && (
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <FaSmile className="w-3 h-3" />
                Click on stars to rate
              </p>
            )}
          </div>
        </div>

        {/* Review Text Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Your Review <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 text-gray-300">
              <FaQuoteLeft className="w-4 h-4" />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required
              rows="5"
              className={`w-full px-10 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none
                ${isFocused 
                  ? 'border-blue-400 ring-4 ring-blue-100' 
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${comment.length > 0 ? 'bg-white' : 'bg-gray-50'}
              `}
              placeholder="What do you think about this product? Share your honest experience..."
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full">
              {comment.length}/500
            </div>
          </div>
          {comment.length > 0 && comment.length < 20 && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <FaSmile className="w-3 h-3" />
              Try to add more details to help other customers
            </p>
          )}
          {comment.length > 100 && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <FaCheckCircle className="w-3 h-3" />
              Great detailed review!
            </p>
          )}
        </div>

        {/* Review Tips */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-800 mb-2">✨ Review Tips:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-700">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
              <span>Share specific features you liked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
              <span>Mention product quality and durability</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
              <span>Compare with similar products if applicable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
              <span>Include photos for better context</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin w-5 h-5" />
                <span>Submitting Review...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="w-5 h-5" />
                <span>Publish Review</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setRating(0);
              setComment('');
              setHoverRating(0);
              toast('Form cleared', {
                icon: '🗑️',
                duration: 1500,
                style: {
                  background: '#F3F4F6',
                  color: '#374151',
                  borderRadius: '10px',
                },
              });
            }}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
          >
            Clear Form
          </button>
        </div>

        {/* Footer Note */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Your review will be visible to other customers</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Your email will remain private</span>
            </div>
          </div>
        </div>
      </form>

      {/* Add animation keyframes */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default FeedbackForm;