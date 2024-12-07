import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed and imported
import '../styles/FeedbackForm.css'; // Assuming SCSS is being used

const FeedbackForm = ({ user }) => {
  const [newDishRequest, setNewDishRequest] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        alert('You must be logged in to request a new dish.');
        return;
      }

      const response = await axios.post('http://localhost:5001/api/requestNewDish', {
        dishName: newDishRequest,
        userId: user.uid,
      });

      console.log('Dish request submitted:', response.data);
      alert('Your dish request has been submitted!');
      setNewDishRequest('');
    } catch (error) {
      console.error('Error submitting dish request:', error);
      alert('There was an error submitting your request. Please try again later.');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        alert('You must be logged in to submit feedback.');
        return;
      }

      const response = await axios.post('http://localhost:5001/api/submitFeedback', {
        feedback,
        userId: user.uid,
        restaurantId: 'einstein_bagels', // Replace with dynamic restaurant ID if needed
      });

      console.log('Feedback submitted:', response.data);
      setFeedback('');
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting your feedback. Please try again.');
    }
  };

  return (
    <div className="dish-feedback-container">
      {/* Dish Request Form */}
      <form className="dish-request-form" onSubmit={handleSubmit}>
        <h2>Request a New Dish</h2>
        <input
          type="text"
          placeholder="Dish Name"
          value={newDishRequest}
          onChange={(e) => setNewDishRequest(e.target.value)}
          required
        />
        <button type="submit">Submit Request</button>
      </form>

      {/* Feedback Form */}
      <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
        <h2>Feedback</h2>
        {feedbackSubmitted ? (
          <p>Thank you for your feedback!</p>
        ) : (
          <>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here"
              rows="4"
              required
            />
            <button type="submit">Submit Feedback</button>
          </>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm;
