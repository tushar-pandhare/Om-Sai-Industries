const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  respondToComplaint,
  updateComplaintStatus
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router.post('/', protect, createComplaint);
router.get('/mycomplaints', protect, getMyComplaints);

// Admin only routes
router.get('/admin/complaints', protect, adminMiddleware, getAllComplaints);
router.put('/admin/complaints/:id/respond', protect, adminMiddleware, respondToComplaint);
router.put('/admin/complaints/:id/status', protect, adminMiddleware, updateComplaintStatus);

module.exports = router;