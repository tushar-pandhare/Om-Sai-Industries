const Complaint = require('../models/Complaint');

const createComplaint = async (req, res) => {
  try {
    // Create complaint with required fields
    const complaintData = {
      user: req.user._id,
      subject: req.body.subject,
      description: req.body.description,
      status: 'pending'
    };
    
    // Only add order if it's provided and not empty
    if (req.body.order && req.body.order.trim() !== '') {
      // Try to convert to ObjectId, if fails, just don't add it
      try {
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(req.body.order)) {
          complaintData.order = req.body.order;
        } else {
          console.log('Invalid Order ID provided, skipping...');
        }
      } catch (err) {
        console.log('Error processing order ID:', err.message);
      }
    }
    
    const complaint = new Complaint(complaintData);
    const savedComplaint = await complaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: error.message });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .populate('user', 'name email phone')
      .populate('order')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (complaint) {
      complaint.response = req.body.response;
      complaint.status = 'resolved';
      complaint.resolvedAt = Date.now();
      
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (complaint) {
      complaint.status = req.body.status;
      
      if (req.body.status === 'resolved') {
        complaint.resolvedAt = Date.now();
      }
      
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComplaint, getMyComplaints, getAllComplaints, respondToComplaint, updateComplaintStatus };