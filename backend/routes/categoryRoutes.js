const express = require('express');
const router = express.Router();
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

// Admin only routes - Note: no /admin prefix here because it's already mounted on /api/categories
router.post('/', protect, adminMiddleware, createCategory);
router.put('/:id', protect, adminMiddleware, updateCategory);
router.delete('/:id', protect, adminMiddleware, deleteCategory);

module.exports = router;