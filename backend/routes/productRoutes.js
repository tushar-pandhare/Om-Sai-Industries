// const express = require('express');
// const router = express.Router();
// const { 
//   getProducts, 
//   getProductById, 
//   createProduct, 
//   updateProduct, 
//   deleteProduct
// } = require('../controllers/productController');
// const { protect } = require('../middleware/authMiddleware');
// const { adminMiddleware } = require('../middleware/adminMiddleware');

// // Public routes
// router.get('/', getProducts);
// router.get('/:id', getProductById);

// // Admin only routes
// router.post('/', protect, adminMiddleware, createProduct);
// router.put('/:id', protect, adminMiddleware, updateProduct);
// router.delete('/:id', protect, adminMiddleware, deleteProduct);

// module.exports = router;
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  deleteProductImage
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', protect, adminMiddleware, upload.array('images', 10), createProduct);
router.put('/:id', protect, adminMiddleware, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, adminMiddleware, deleteProduct);
router.delete('/image', protect, adminMiddleware, deleteProductImage);

module.exports = router;