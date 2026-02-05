import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { FaInstagram, FaWhatsapp, FaHeart } from 'react-icons/fa';
import AdminLogin from './AdminLogin';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isAuthenticated, signOut } = useAuth();
  const { isAdminAuthenticated } = useAdmin();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
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
        <div className="section-title account-title">ACCOUNT</div>
        {isAdminAuthenticated ? (
          <>
            <Link 
              to="/admin" 
              className="nav-link admin-link"
            >
              <span className="nav-icon">⚙️</span>
              <span>Admin Panel</span>
            </Link>
          </>
        ) : (
          <>
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
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="nav-link admin-button"
              title="Admin access only"
            >
              <span className="nav-icon">🔐</span>
              <span>Admin Login</span>
            </button>
          </>
        )}
      </div>

      <div className="sidebar-section contact-section">
        <div className="contact-title">CONTACT US</div>
        <div className="social-links">
          <a 
            href="https://instagram.com/vedhasclothing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-button instagram"
            title="Follow us on Instagram"
          >
            <FaInstagram className="social-icon-sidebar" />
            <span>Instagram</span>
          </a>
          <a 
            href="https://wa.me/918438859659" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-button whatsapp"
            title="Chat with us on WhatsApp"
          >
            <FaWhatsapp className="social-icon-sidebar" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
      <div className="sidebar-footer">
        © 2024 Vedha's Clothing
      </div>

      {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}
    </div>
  );
}

export default Sidebar;

