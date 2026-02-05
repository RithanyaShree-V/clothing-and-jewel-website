import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import './Auth.css';

function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const result = await signIn(
      formData.email.trim().toLowerCase(),
      formData.password
    );

    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Welcome back to Vedha's Clothing</p>

        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="social-auth">
          <button type="button" className="social-button instagram">
            <FaInstagram className="social-icon" />
            Login with Instagram
          </button>
          <button type="button" className="social-button whatsapp">
            <FaWhatsapp className="social-icon" />
            Chat on WhatsApp
          </button>
        </div>

        <p className="auth-link-text">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>

        <div className="social-connect">
          <p>Connect with us on social media</p>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaInstagram className="social-icon-small" />
            </a>
            <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaWhatsapp className="social-icon-small" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
