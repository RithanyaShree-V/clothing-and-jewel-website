import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccess.css';

function OrderSuccess() {
  useEffect(() => {
    // Show toast notification
    const timer = setTimeout(() => {
      // Toast would appear here - we'll implement it with CSS animation
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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

