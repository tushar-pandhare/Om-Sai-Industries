// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.get('/profile', protect, getUserProfile);
// router.put('/profile', protect, updateUserProfile);

// module.exports = router;

// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile , updateUserPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (uses token)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Optional: ID-based routes for admin or compatibility (also protected)
router.put('/profile/:id', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);

module.exports = router;