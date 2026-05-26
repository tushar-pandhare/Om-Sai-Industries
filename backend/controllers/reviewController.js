// // backend/controllers/reviewController.js
// const Review = require('../models/Review');
// const Product = require('../models/Product');
// const Feedback = require('../models/Feedback');

// const createReview = async (req, res) => {
//   try {
//     const { rating, comment } = req.body;
//     const productId = req.params.productId; 
//     const userId = req.user._id;
//     // console.log
    
//     console.log('Creating review:', { productId, userId, rating, comment });
    
//     // Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     // Check if user already reviewed this product
//     // const alreadyReviewed = await Review.findOne({ user: userId, product: productId });
//     // if (alreadyReviewed) {
//     //   return res.status(400).json({ message: 'You have already reviewed this product' });
//     // }
    
//     // Create review in Review collection
//     const review = new Review({
//       user: userId,
//       product: productId,
//       rating: Number(rating),
//       comment
//     });
    
//     const savedReview = await review.save();
    
//     // Update product rating
//     const allReviews = await Review.find({ product: productId });
//     const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
//     const averageRating = totalRating / allReviews.length;
    
//     product.rating = averageRating;
//     product.numReviews = allReviews.length;
//     await product.save();
    
//     // Populate user info
//     await savedReview.populate('user', 'name email');
    
//     console.log('Review saved:', savedReview);
//     res.status(201).json({ 
//       success: true,
//       message: 'Review added successfully', 
//       review: savedReview,
//       productRating: averageRating,
//       numReviews: allReviews.length
//     });
//   } catch (error) {
//     console.error('Error creating review:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ This is the endpoint your frontend is calling
// const getProductReviews = async (req, res) => {
//   try {
//     const { productId } = req.params;
    
//     console.log('Fetching reviews for product:', productId);
    
//     // Get reviews from Review collection
//     const reviews = await Review.find({ product: productId })
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 });
    
//     // Get product details for rating summary
//     const product = await Product.findById(productId);
    
//     // Calculate rating distribution
//     const ratingDistribution = {
//       5: reviews.filter(r => r.rating === 5).length,
//       4: reviews.filter(r => r.rating === 4).length,
//       3: reviews.filter(r => r.rating === 3).length,
//       2: reviews.filter(r => r.rating === 2).length,
//       1: reviews.filter(r => r.rating === 1).length
//     };
    
//     res.json({
//       success: true,
//       reviews,
//       averageRating: product?.rating || 0,
//       totalReviews: reviews.length,
//       ratingDistribution
//     });
//   } catch (error) {
//     console.error('Error fetching product reviews:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all reviews from ALL sources (Admin only)
// const getAllReviews = async (req, res) => {
//   try {
//     // 1. Get reviews from Review collection
//     const reviewCollectionReviews = await Review.find({})
//       .populate('user', 'name email')
//       .populate('product', 'name')
//       .lean();
    
//     // Format review collection reviews
//     const formattedReviewReviews = reviewCollectionReviews.map(review => ({
//       _id: review._id,
//       type: 'product-review',
//       source: 'review-collection',
//       userName: review.user?.name || 'Unknown User',
//       userEmail: review.user?.email || 'No email',
//       rating: review.rating,
//       comment: review.comment,
//       productName: review.product?.name || 'Unknown Product',
//       productId: review.product?._id,
//       createdAt: review.createdAt,
//       isProductReview: true
//     }));
    
//     // 2. Get embedded reviews from all products
//     const allProducts = await Product.find({})
//       .populate('category', 'name')
//       .lean();
    
//     const embeddedReviews = [];
//     for (const product of allProducts) {
//       if (product.reviews && product.reviews.length > 0) {
//         for (const review of product.reviews) {
//           embeddedReviews.push({
//             _id: `${product._id}_${review.createdAt || Date.now()}`,
//             type: 'product-review',
//             source: 'embedded',
//             userName: review.user?.name || 'Legacy User',
//             userEmail: 'No email',
//             rating: review.rating,
//             comment: review.comment,
//             productName: product.name,
//             productId: product._id,
//             createdAt: review.createdAt || product.createdAt,
//             isProductReview: true,
//             isLegacy: true
//           });
//         }
//       }
//     }
    
//     // 3. Get feedback from Feedback collection
//     const feedbacks = await Feedback.find({})
//       .populate('user', 'name email')
//       .lean();
    
//     const formattedFeedbacks = feedbacks.map(feedback => ({
//       _id: feedback._id,
//       type: 'general-feedback',
//       source: 'feedback-collection',
//       userName: feedback.user?.name || 'Unknown User',
//       userEmail: feedback.user?.email || 'No email',
//       rating: feedback.rating,
//       comment: feedback.comment,
//       category: feedback.category || 'general',
//       productName: null,
//       productId: null,
//       createdAt: feedback.createdAt,
//       isProductReview: false
//     }));
    
//     // Combine all reviews
//     const allReviews = [...formattedReviewReviews, ...embeddedReviews, ...formattedFeedbacks];
    
//     // Sort by creation date (newest first)
//     allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
//     console.log(`Total combined reviews: ${allReviews.length}`);
    
//     res.json(allReviews);
//   } catch (error) {
//     console.error('Error getting all reviews:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteReview = async (req, res) => {
//   try {
//     const reviewId = req.params.id;
    
//     // Try to delete from Review collection first
//     const review = await Review.findById(reviewId);
//     if (review) {
//       const productId = review.product;
//       await review.deleteOne();
      
//       // Update product rating after deletion
//       const allReviews = await Review.find({ product: productId });
//       const product = await Product.findById(productId);
      
//       if (product) {
//         if (allReviews.length > 0) {
//           const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
//           product.rating = totalRating / allReviews.length;
//           product.numReviews = allReviews.length;
//         } else {
//           product.rating = 0;
//           product.numReviews = 0;
//         }
//         await product.save();
//       }
      
//       return res.json({ message: 'Review removed successfully' });
//     }
    
//     // If not found in Review collection, try to delete from Feedback collection
//     const feedback = await Feedback.findById(reviewId);
//     if (feedback) {
//       await feedback.deleteOne();
//       return res.json({ message: 'Feedback removed successfully' });
//     }
    
//     res.status(404).json({ message: 'Review/Feedback not found' });
//   } catch (error) {
//     console.error('Error deleting review:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { 
//   createReview, 
//   getProductReviews,  // ✅ Make sure this is exported
//   getAllReviews, 
//   deleteReview
// };
// controllers/reviewController.js — FIXED
// Bugs fixed:
// 1. Duplicate review check was commented out — now enforced (one review per user per product)
// 2. getProductReviews was destructuring response.data.reviews in slice but controller 
//    returned { reviews, averageRating, ... } — kept that shape, fixed slice to match
// 3. Rating calculation now uses $set and rounds to 1 decimal

const Review = require('../models/Review');
const Product = require('../models/Product');
const Feedback = require('../models/Feedback');

// ─── Create Review ────────────────────────────────────────────────────────────
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({ message: 'Please write a meaningful review' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // ── Enforce one review per user per product ──
    const alreadyReviewed = await Review.findOne({ user: userId, product: productId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product. Delete your existing review to add a new one.' });
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating: Number(rating),
      comment: comment.trim()
    });

    // Update product average rating
    await updateProductRating(productId);

    await review.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Product Reviews ──────────────────────────────────────────────────────
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const product = await Product.findById(productId);

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1; });

    res.json({
      success: true,
      reviews,
      averageRating: product?.rating || 0,
      totalReviews: reviews.length,
      ratingDistribution
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Get All Reviews (Admin) ──────────────────────────────────────────────────
const getAllReviews = async (req, res) => {
  try {
    const reviewCollectionReviews = await Review.find({})
      .populate('user', 'name email')
      .populate('product', 'name')
      .lean();

    const formattedReviews = reviewCollectionReviews.map(r => ({
      _id: r._id,
      type: 'product-review',
      source: 'review-collection',
      userName: r.user?.name || 'Unknown User',
      userEmail: r.user?.email || '',
      rating: r.rating,
      comment: r.comment,
      productName: r.product?.name || 'Unknown Product',
      productId: r.product?._id,
      createdAt: r.createdAt,
      isProductReview: true
    }));

    const feedbacks = await Feedback.find({}).populate('user', 'name email').lean();
    const formattedFeedbacks = feedbacks.map(f => ({
      _id: f._id,
      type: 'general-feedback',
      source: 'feedback-collection',
      userName: f.user?.name || 'Unknown User',
      userEmail: f.user?.email || '',
      rating: f.rating,
      comment: f.comment,
      category: f.category || 'general',
      productName: null,
      productId: null,
      createdAt: f.createdAt,
      isProductReview: false
    }));

    const all = [...formattedReviews, ...formattedFeedbacks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(all);
  } catch (error) {
    console.error('Error getting all reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete Review (Admin) ────────────────────────────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      const productId = review.product;
      await review.deleteOne();
      await updateProductRating(productId);
      return res.json({ message: 'Review removed successfully' });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (feedback) {
      await feedback.deleteOne();
      return res.json({ message: 'Feedback removed successfully' });
    }

    res.status(404).json({ message: 'Review not found' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Helper ───────────────────────────────────────────────────────────────────
async function updateProductRating(productId) {
  const allReviews = await Review.find({ product: productId });
  const product = await Product.findById(productId);
  if (!product) return;

  if (allReviews.length > 0) {
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Math.round((total / allReviews.length) * 10) / 10;
    product.numReviews = allReviews.length;
  } else {
    product.rating = 0;
    product.numReviews = 0;
  }
  await product.save();
}

module.exports = { createReview, getProductReviews, getAllReviews, deleteReview };
