// backend/controllers/reviewController.js
const Review = require('../models/Review');
const Product = require('../models/Product');
const Feedback = require('../models/Feedback');

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId; 
    const userId = req.user._id;
    // console.log
    
    console.log('Creating review:', { productId, userId, rating, comment });
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user already reviewed this product
    // const alreadyReviewed = await Review.findOne({ user: userId, product: productId });
    // if (alreadyReviewed) {
    //   return res.status(400).json({ message: 'You have already reviewed this product' });
    // }
    
    // Create review in Review collection
    const review = new Review({
      user: userId,
      product: productId,
      rating: Number(rating),
      comment
    });
    
    const savedReview = await review.save();
    
    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    product.rating = averageRating;
    product.numReviews = allReviews.length;
    await product.save();
    
    // Populate user info
    await savedReview.populate('user', 'name email');
    
    console.log('Review saved:', savedReview);
    res.status(201).json({ 
      success: true,
      message: 'Review added successfully', 
      review: savedReview,
      productRating: averageRating,
      numReviews: allReviews.length
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ This is the endpoint your frontend is calling
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    console.log('Fetching reviews for product:', productId);
    
    // Get reviews from Review collection
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    // Get product details for rating summary
    const product = await Product.findById(productId);
    
    // Calculate rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };
    
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

// Get all reviews from ALL sources (Admin only)
const getAllReviews = async (req, res) => {
  try {
    // 1. Get reviews from Review collection
    const reviewCollectionReviews = await Review.find({})
      .populate('user', 'name email')
      .populate('product', 'name')
      .lean();
    
    // Format review collection reviews
    const formattedReviewReviews = reviewCollectionReviews.map(review => ({
      _id: review._id,
      type: 'product-review',
      source: 'review-collection',
      userName: review.user?.name || 'Unknown User',
      userEmail: review.user?.email || 'No email',
      rating: review.rating,
      comment: review.comment,
      productName: review.product?.name || 'Unknown Product',
      productId: review.product?._id,
      createdAt: review.createdAt,
      isProductReview: true
    }));
    
    // 2. Get embedded reviews from all products
    const allProducts = await Product.find({})
      .populate('category', 'name')
      .lean();
    
    const embeddedReviews = [];
    for (const product of allProducts) {
      if (product.reviews && product.reviews.length > 0) {
        for (const review of product.reviews) {
          embeddedReviews.push({
            _id: `${product._id}_${review.createdAt || Date.now()}`,
            type: 'product-review',
            source: 'embedded',
            userName: review.user?.name || 'Legacy User',
            userEmail: 'No email',
            rating: review.rating,
            comment: review.comment,
            productName: product.name,
            productId: product._id,
            createdAt: review.createdAt || product.createdAt,
            isProductReview: true,
            isLegacy: true
          });
        }
      }
    }
    
    // 3. Get feedback from Feedback collection
    const feedbacks = await Feedback.find({})
      .populate('user', 'name email')
      .lean();
    
    const formattedFeedbacks = feedbacks.map(feedback => ({
      _id: feedback._id,
      type: 'general-feedback',
      source: 'feedback-collection',
      userName: feedback.user?.name || 'Unknown User',
      userEmail: feedback.user?.email || 'No email',
      rating: feedback.rating,
      comment: feedback.comment,
      category: feedback.category || 'general',
      productName: null,
      productId: null,
      createdAt: feedback.createdAt,
      isProductReview: false
    }));
    
    // Combine all reviews
    const allReviews = [...formattedReviewReviews, ...embeddedReviews, ...formattedFeedbacks];
    
    // Sort by creation date (newest first)
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`Total combined reviews: ${allReviews.length}`);
    
    res.json(allReviews);
  } catch (error) {
    console.error('Error getting all reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    // Try to delete from Review collection first
    const review = await Review.findById(reviewId);
    if (review) {
      const productId = review.product;
      await review.deleteOne();
      
      // Update product rating after deletion
      const allReviews = await Review.find({ product: productId });
      const product = await Product.findById(productId);
      
      if (product) {
        if (allReviews.length > 0) {
          const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
          product.rating = totalRating / allReviews.length;
          product.numReviews = allReviews.length;
        } else {
          product.rating = 0;
          product.numReviews = 0;
        }
        await product.save();
      }
      
      return res.json({ message: 'Review removed successfully' });
    }
    
    // If not found in Review collection, try to delete from Feedback collection
    const feedback = await Feedback.findById(reviewId);
    if (feedback) {
      await feedback.deleteOne();
      return res.json({ message: 'Feedback removed successfully' });
    }
    
    res.status(404).json({ message: 'Review/Feedback not found' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createReview, 
  getProductReviews,  // ✅ Make sure this is exported
  getAllReviews, 
  deleteReview
};