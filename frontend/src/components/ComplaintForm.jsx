import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComplaint } from '../features/complaints/complaintSlice';

const ComplaintForm = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    order: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createComplaint(formData));
    setFormData({ subject: '', description: '', order: '' });
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Raise a Complaint</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief subject of your complaint"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Order ID (Optional)</label>
        <input
          type="text"
          name="order"
          value={formData.order}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter order ID if applicable"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="5"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Provide detailed description of your complaint"
        ></textarea>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Submit Complaint
      </button>
    </form>
  );
};

export default ComplaintForm;