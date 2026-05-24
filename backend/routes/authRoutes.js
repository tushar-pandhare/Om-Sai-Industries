
// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser, getUserProfile, updateUserProfile , updateUserPassword } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// // Public routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// // Protected routes (uses token)
// router.get('/profile', protect, getUserProfile);
// router.put('/profile', protect, updateUserProfile);

// // Optional: ID-based routes for admin or compatibility (also protected)
// router.put('/profile/:id', protect, updateUserProfile);
// router.put('/password', protect, updateUserPassword);

// module.exports = router;
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  forgotPassword,
  verifyOTP,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Forgot password flow (public)
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/profile/:id', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);

module.exports = router;
