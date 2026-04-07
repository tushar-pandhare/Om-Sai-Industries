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
  getAllReviews,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Admin routes - Note: These are mounted at /api/reviews in server.js
// So full path becomes /api/reviews for GET and DELETE
router.get('/', protect, adminMiddleware, getAllReviews);
router.delete('/:id', protect, adminMiddleware, deleteReview);

module.exports = router;