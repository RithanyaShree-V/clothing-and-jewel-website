import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import './AdminLogin.css';

const AdminLogin = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { loginWithPhone, loading } = useAdmin();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    const result = await loginWithPhone(phoneNumber);
    if (result.success) {
      setSuccessMessage('Login successful! Redirecting to admin panel...');
      setTimeout(() => {
        onClose();
        navigate('/admin');
      }, 1500);
    } else {
      setError(result.error || 'Failed to login');
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="admin-login-header">
          <h2>Admin Login</h2>
          <p className="admin-login-subtitle">
            Enter your phone number to access the admin panel
          </p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}
        {successMessage && <div className="admin-login-success">{successMessage}</div>}

        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter 10-digit phone number"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhoneNumber(value);
              }}
              maxLength="10"
              disabled={loading}
            />
            <small>Enter phone number without country code</small>
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="admin-info">
            <p><strong>Note:</strong> Only registered admin phone numbers can access this panel.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
