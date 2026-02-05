import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, convertToINR, formatPriceDirect } from '../utils/currency';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    address: '123 Fashion St, Design City, DC 10001'
  });

  const subtotal = getTotalPrice();
  const total = subtotal; // No tax on checkout page as shown in screenshot
  const totalINR = convertToINR(total);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    clearCart();
    navigate('/order-success');
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

          <button type="submit" className="pay-button">
            Pay {formatPriceDirect(totalINR)}
          </button>
        </form>

        <div className="checkout-summary">
          <h2 className="summary-title">Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <img 
                src={item.image} 
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

