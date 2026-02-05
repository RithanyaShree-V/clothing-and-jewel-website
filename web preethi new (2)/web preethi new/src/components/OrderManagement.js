import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './ManagementModules.css';

const OrderManagement = () => {
  const { adminToken } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.orders || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch orders');
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update order status');
    }
    setUpdatingStatus(null);
  };

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f97316';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#666';
    }
  };

  return (
    <div className="management-module">
      <div className="module-header">
        <h3>Order Management</h3>
        <button className="refresh-btn" onClick={fetchOrders}>🔄 Refresh</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="no-data">No orders found</div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="order-item">
                <div className="order-header" onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}>
                  <div className="order-basic">
                    <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="order-customer">
                      Customer: {order.userId?.fullName || 'Unknown'}
                    </div>
                  </div>
                  <div className="order-right">
                    <div className="order-price">₹{order.totalPrice?.toFixed(2) || 0}</div>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      disabled={updatingStatus === order._id}
                      className="status-select"
                      style={{ borderColor: getStatusColor(order.status) }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {expandedId === order._id && (
                  <div className="order-details">
                    <div className="details-grid">
                      <div className="detail">
                        <span className="label">Email:</span>
                        <span className="value">{order.userId?.email || 'N/A'}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Date:</span>
                        <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Items:</span>
                        <span className="value">{order.items?.length || 0}</span>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="order-items">
                        <h5>Items:</h5>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="item-detail">
                            <span>{item.productId?.name || 'Product'} × {item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
