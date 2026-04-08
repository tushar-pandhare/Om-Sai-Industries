const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin only routes with image upload support
router.post('/', protect, adminMiddleware, upload.single('image'), createCategory);
router.put('/:id', protect, adminMiddleware, upload.single('image'), updateCategory);
router.delete('/:id', protect, adminMiddleware, deleteCategory);

module.exports = router;