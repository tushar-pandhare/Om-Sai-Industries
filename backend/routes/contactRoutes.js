const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  updateContactInfo
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router.get('/', getContactInfo);
router.put('/admin/contact', protect, adminMiddleware, updateContactInfo);

module.exports = router;