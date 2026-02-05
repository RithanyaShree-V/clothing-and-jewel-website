import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './OrderSuccess.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function OrderSuccess() {
  const [showReviewForm, setShowReviewForm] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Show toast notification
    const timer = setTimeout(() => {
      // Toast would appear here - we'll implement it with CSS animation
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0 || reviewText.trim() === '') {
      alert('Please provide both a rating and review text.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          text: reviewText
        })
      });
      if (response.ok) {
        setSubmitted(true);
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-success">
      <div className="success-content">
        <div className="success-icon">
          <svg viewBox="0 0 100 100" className="checkmark">
            <circle cx="50" cy="50" r="45" fill="#25a244" />
            <path
              d="M30 50 L45 65 L70 35"
              stroke="white"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-message">
          Thank you for your purchase. We have received your order and will begin processing it right away.
        </p>
        <Link to="/products" className="continue-shopping-button">
          Continue Shopping
        </Link>
      </div>

      {showReviewForm && !submitted && (
        <div className="review-form-section">
          <h2 className="review-form-title">Share Your Experience</h2>
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="rating-input">
              <label>Rate this product:</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= rating ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} stars`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-input">
              <label htmlFor="review-text">Write your review:</label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows="5"
                maxLength="1000"
              />
              <span className="char-count">{reviewText.length}/1000</span>
            </div>

            <button type="submit" className="submit-review-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="review-success-message">
          <p>Thank you for your review! We appreciate your feedback.</p>
        </div>
      )}

      <div className="toast-notification">
        <div className="toast-content">
          <div className="toast-title">Order Placed Successfully</div>
          <div className="toast-message">We'll send you an email confirmation shortly.</div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;

