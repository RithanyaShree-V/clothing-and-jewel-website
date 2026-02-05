import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, convertToINR, formatPriceDirect } from '../utils/currency';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  const getItemId = (item) => {
    const id = item?.id ?? item?._id ?? item?.productId ?? item?.product?.id ?? item?.product?._id;
    return id != null ? id : '';
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity) || 1);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const subtotal = getTotalPrice();
  const subtotalINR = convertToINR(subtotal);
  const tax = calculateTax(subtotal);
  const taxINR = convertToINR(tax);
  const total = subtotal + tax;
  const totalINR = convertToINR(total);

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <h1 className="page-title">Shopping Cart</h1>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p className="empty-cart-text">Your cart is empty</p>
          <p className="empty-cart-subtext">Looks like you haven't added any items yet. Start shopping and add some beautiful items to your cart!</p>
          <Link to="/products" className="start-shopping-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1 className="page-title">Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => {
            const itemId = getItemId(item);
            return (
            <div key={itemId} className="cart-item">
              <button 
                className="remove-item-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromCart(itemId);
                }}
                aria-label="Remove item"
              >
                🗑️
              </button>
              <img 
                src={process.env.PUBLIC_URL + item.image} 
                alt={item.name}
                className="cart-item-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x200?text=' + encodeURIComponent(item.name);
                }}
              />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-category">{item.category}</div>
              </div>
              <div className="cart-item-quantity">
                <button 
                  onClick={() => handleQuantityChange(itemId, item.quantity - 1)}
                  className="quantity-button"
                >
                  -
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(itemId, item.quantity + 1)}
                  className="quantity-button"
                >
                  +
                </button>
              </div>
              <div className="cart-item-price">{formatPrice(item.price * item.quantity)}</div>
            </div>
          )})}
        </div>

        <div className="order-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
            <span>{formatPriceDirect(subtotalINR)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          <div className="summary-row">
            <span>Taxes (estimated)</span>
            <span>{formatPriceDirect(taxINR)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{formatPriceDirect(totalINR)}</span>
          </div>
          <Link to="/checkout" className="checkout-button">
            Proceed to Checkout
            <span className="arrow-icon">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;

