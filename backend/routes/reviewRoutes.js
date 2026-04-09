// const express = require('express');
// const router = express.Router();
// const {
//   getAllReviews,
//   deleteReview
// } = require('../controllers/reviewController');
// const { protect } = require('../middleware/authMiddleware');
// const { adminMiddleware } = require('../middleware/adminMiddleware');

// router.get('/admin/reviews', protect, adminMiddleware, getAllReviews);
// router.delete('/admin/reviews/:id', protect, adminMiddleware, deleteReview);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getAllReviews,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router.post('/product/:productId', protect, createReview); 
router.get('/product/:productId', getProductReviews);  
// Admin routes
router.get('/', protect, adminMiddleware, getAllReviews);
router.delete('/:id', protect, adminMiddleware, deleteReview);

module.exports = router;