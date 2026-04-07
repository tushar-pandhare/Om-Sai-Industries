const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Submit feedback (authenticated users)
router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment, category } = req.body;
    
    console.log('Received feedback:', { rating, comment, category, user: req.user._id });
    
    // Validate required fields
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }
    
    const feedback = new Feedback({
      user: req.user._id,
      rating: Number(rating),
      comment,
      category: category || 'general'
    });
    
    const savedFeedback = await feedback.save();
    res.status(201).json({ 
      success: true,
      message: 'Feedback submitted successfully', 
      feedback: savedFeedback 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all feedback (admin only)
router.get('/admin', protect, adminMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;