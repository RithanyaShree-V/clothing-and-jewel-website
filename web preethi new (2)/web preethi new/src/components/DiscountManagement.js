import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './ManagementModules.css';

const DiscountManagement = () => {
  const { adminToken } = useAdmin();
  const [discounts, setDiscounts] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    percentage: '',
    maxUses: '',
    expiryDate: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  // Fetch discounts on component mount
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/discounts`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setDiscounts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch discounts:', err);
      }
    };

    if (adminToken) {
      fetchDiscounts();
    }
  }, [adminToken, API_BASE]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.code || !formData.percentage || !formData.maxUses) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/discounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setDiscounts([...discounts, data.data]);
        setFormData({
          code: '',
          percentage: '',
          maxUses: '',
          expiryDate: '',
          description: ''
        });
        setSuccess('Discount created successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to create discount');
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/discounts/${discountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setDiscounts(discounts.filter(d => d._id !== discountId));
        setSuccess('Discount deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to delete discount');
    }
  };

  return (
    <div className="management-module">
      <div className="module-header">
        <h3>Discount & Offer Management</h3>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="discount-form-container">
        <h4>Create New Discount</h4>
        <form onSubmit={handleCreateDiscount} className="discount-form">
          <div className="form-row">
            <div className="form-group">
              <label>Discount Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., SUMMER20"
                maxLength="10"
              />
            </div>
            <div className="form-group">
              <label>Discount % *</label>
              <input
                type="number"
                name="percentage"
                value={formData.percentage}
                onChange={handleInputChange}
                placeholder="e.g., 20"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Max Uses *</label>
              <input
                type="number"
                name="maxUses"
                value={formData.maxUses}
                onChange={handleInputChange}
                placeholder="e.g., 100"
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this discount/offer"
              rows="3"
            />
          </div>

          <button type="submit" className="btn-create">+ Create Discount</button>
        </form>
      </div>

      <div className="discounts-list-container">
        <h4>Active Discounts</h4>
        {discounts.length === 0 ? (
          <div className="no-data">No discounts created yet</div>
        ) : (
          <div className="discounts-grid">
            {discounts.map((discount) => (
              <div key={discount._id} className="discount-card">
                <div className="discount-code">{discount.code}</div>
                <div className="discount-percentage">{discount.percentage}% OFF</div>
                <div className="discount-info">
                  <p><strong>Uses:</strong> {discount.currentUses || 0}/{discount.maxUses}</p>
                  {discount.expiryDate && (
                    <p><strong>Expires:</strong> {new Date(discount.expiryDate).toLocaleDateString()}</p>
                  )}
                  {discount.description && (
                    <p><strong>Description:</strong> {discount.description}</p>
                  )}
                  <p><strong>Status:</strong> {discount.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <button
                  className="btn-delete-discount"
                  onClick={() => handleDeleteDiscount(discount._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountManagement;
