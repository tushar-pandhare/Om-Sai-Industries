// FeedbackPage.jsx
import React from 'react';
import FeedbackForm from '../components/FeedbackForm';

const FeedbackPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">We Value Your Feedback</h1>
        <FeedbackForm isGeneralFeedback={true} />
      </div>
    </div>
  );
};

export default FeedbackPage;