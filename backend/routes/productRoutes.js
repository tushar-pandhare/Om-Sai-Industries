const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', protect, adminMiddleware, createProduct);
router.put('/:id', protect, adminMiddleware, updateProduct);
router.delete('/:id', protect, adminMiddleware, deleteProduct);

// ❌ REMOVE this line - review routes are handled by reviewRoutes
// router.post('/:id/reviews', protect, createReview);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { 
//   getProducts, 
//   getProductById, 
//   createProduct, 
//   updateProduct, 
//   deleteProduct,
//   createReview 
// } = require('../controllers/productController');
// const { protect } = require('../middleware/authMiddleware');
// const { adminMiddleware } = require('../middleware/adminMiddleware');

// // Public routes
// router.get('/', getProducts);
// router.get('/:id', getProductById);
// router.post('/:id/reviews', protect, createReview);

// // Admin only routes - Note: NO '/admin' in the path
// router.post('/', protect, adminMiddleware, createProduct);
// router.put('/:id', protect, adminMiddleware, updateProduct);
// router.delete('/:id', protect, adminMiddleware, deleteProduct);

// module.exports = router;