import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { FaInstagram, FaWhatsapp, FaHeart } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isAuthenticated, signOut } = useAuth();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-name">Vedha's</div>
        <div className="brand-subtitle">Clothing</div>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link 
          to="/products?category=new" 
          className={`nav-link ${location.search === '?category=new' || location.search.includes('category=new') ? 'active' : ''}`}
        >
          <span className="nav-icon">⭐</span>
          <span>New Arrivals</span>
        </Link>
        <Link 
          to="/products" 
          className={`nav-link ${location.pathname === '/products' && !location.search.includes('category=new') ? 'active' : ''}`}
        >
          <span className="nav-icon">⊞</span>
          <span>All Products</span>
        </Link>
        <Link 
          to="/cart" 
          className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
        >
          <span className="nav-icon">🛒</span>
          <span>Cart</span>
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </Link>
        <Link 
          to="/wishlist" 
          className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`}
        >
          <span className="nav-icon"><FaHeart /></span>
          <span>Wishlist</span>
          {wishlistCount > 0 && (
            <span className="cart-badge">{wishlistCount}</span>
          )}
        </Link>
      </nav>

      <div className="sidebar-section">
        <div className="section-title">ACCOUNT</div>
        {isAuthenticated ? (
          <>
            <div className="user-info">
              <div className="user-name">{user?.fullName || 'User'}</div>
              <div className="user-email">{user?.email}</div>
            </div>
            <button onClick={signOut} className="nav-link sign-out-button">
              <span className="nav-icon">→</span>
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            >
              <span className="nav-icon">→</span>
              <span>Sign In</span>
            </Link>
            <Link 
              to="/signup" 
              className={`nav-link ${isActive('/signup') ? 'active' : ''}`}
            >
              <span className="nav-icon">👤+</span>
              <span>Sign Up</span>
            </Link>
          </>
        )}
      </div>

      <div className="sidebar-section">
        <div className="section-title">FOLLOW US</div>
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-button instagram"
        >
          <FaInstagram className="social-icon-sidebar" />
          Instagram
        </a>
        <a 
          href="https://wa.me" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-button whatsapp"
        >
          <FaWhatsapp className="social-icon-sidebar" />
          WhatsApp
        </a>
      </div>

      <div className="sidebar-footer">
        © 2024 Vedha's Clothing
      </div>
    </div>
  );
}

export default Sidebar;

