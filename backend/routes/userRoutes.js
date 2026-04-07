const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router.get('/admin/users', protect, adminMiddleware, getAllUsers);
router.get('/admin/users/:id', protect, adminMiddleware, getUserById);
router.put('/admin/users/:id/role', protect, adminMiddleware, updateUserRole);
router.delete('/admin/users/:id', protect, adminMiddleware, deleteUser);

module.exports = router;