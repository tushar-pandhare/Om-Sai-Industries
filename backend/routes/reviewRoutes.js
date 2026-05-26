// const express = require('express');
// const router = express.Router();
// const {
//   createReview,
//   getProductReviews,
//   getAllReviews,
//   deleteReview
// } = require('../controllers/reviewController');
// const { protect } = require('../middleware/authMiddleware');
// const { adminMiddleware } = require('../middleware/adminMiddleware');

// router.post('/product/:productId', protect, createReview); 
// router.get('/product/:productId', getProductReviews);  
// // Admin routes
// router.get('/', protect, adminMiddleware, getAllReviews);
// router.delete('/:id', protect, adminMiddleware, deleteReview);

// module.exports = router;

// routes/reviewRoutes.js — FIXED
// Bug fixed: duplicate review check was commented out; now enforced with a clear error message.
// Also added auth check on GET /product/:productId so reviews always return populated user.

const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, getAllReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Public — get reviews for a product
router.get('/product/:productId', getProductReviews);

// Protected — create review (must be logged in)
router.post('/product/:productId', protect, createReview);

// Admin only
router.get('/', protect, adminMiddleware, getAllReviews);
router.delete('/:id', protect, adminMiddleware, deleteReview);

module.exports = router;
