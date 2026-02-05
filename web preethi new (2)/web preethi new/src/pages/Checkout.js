import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, convertToINR, formatPriceDirect } from '../utils/currency';
import './Checkout.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'John Doe',
    email: user?.email || 'john@example.com',
    address: '123 Fashion St, Design City, DC 10001'
  });
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getTotalPrice();
  const total = subtotal; // No tax on checkout page as shown in screenshot
  const totalINR = convertToINR(total);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const token = localStorage.getItem('vedhasToken');
    
    if (!token) {
      // No auth token, just clear cart locally and navigate
      clearCart();
      navigate('/order-success');
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id || item.product,
          productId: item.productId || item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          quantity: item.quantity
        })),
        shippingDetails: {
          fullName: formData.fullName,
          email: formData.email,
          address: formData.address
        },
        subtotal: subtotal,
        tax: 0,
        total: total,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
      };

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        navigate('/order-success');
      } else {
        setError(data.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout">
        <div className="empty-cart-message">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="back-button">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Please enter your shipping details.</p>

      {error && (
        <div className="error-message" style={{ margin: '20px 0', padding: '15px', background: '#fee', color: '#c33', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handlePayment}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Shipping Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              required
            />
          </div>

          <div className="payment-methods-section">
            <h3 className="payment-methods-title">Payment Method</h3>
            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === 'gpay' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="gpay"
                  checked={paymentMethod === 'gpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-label">Google Pay</span>
              </label>

              <label className={`payment-option ${paymentMethod === 'phonepe' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="phonepe"
                  checked={paymentMethod === 'phonepe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-label">PhonePe</span>
              </label>

              <label className={`payment-option ${paymentMethod === 'paytm' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paytm"
                  checked={paymentMethod === 'paytm'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-label">Paytm</span>
              </label>

              <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-label">Credit / Debit Card</span>
              </label>

              <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-label">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <button type="submit" className="pay-button" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : `Pay ${formatPriceDirect(totalINR)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h2 className="summary-title">Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id || item.productId} className="summary-item">
              <img 
                src={process.env.PUBLIC_URL + item.image} 
                alt={item.name}
                className="summary-item-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x100?text=' + encodeURIComponent(item.name);
                }}
              />
              <div className="summary-item-info">
                <div className="summary-item-name">{item.name}</div>
                <div className="summary-item-qty">Qty: {item.quantity}</div>
              </div>
              <div className="summary-item-price">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>{formatPriceDirect(totalINR)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

