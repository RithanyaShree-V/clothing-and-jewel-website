import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { adminToken, adminSettings } = useAdmin();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch all stats
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        }),
        fetch(`${API_BASE}/api/admin/orders`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        }),
        fetch(`${API_BASE}/api/admin/stock`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        })
      ]);

      const usersData = await usersRes.json();
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      setStats({
        totalUsers: usersData.data?.totalUsers || 0,
        totalOrders: ordersData.data?.totalOrders || 0,
        totalProducts: productsData.data?.totalProducts || 0,
        totalRevenue: ordersData.data?.totalRevenue || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
    setLoading(false);
  };

  const StatCard = ({ icon, title, value, color }) => (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h3>Welcome to Admin Dashboard</h3>
        <p>Overview of your business metrics</p>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon="👥"
              title="Total Users"
              value={stats.totalUsers}
              color="blue"
            />
            <StatCard
              icon="🛒"
              title="Total Orders"
              value={stats.totalOrders}
              color="green"
            />
            <StatCard
              icon="📦"
              title="Total Products"
              value={stats.totalProducts}
              color="purple"
            />
            <StatCard
              icon="💰"
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toFixed(2)}`}
              color="orange"
            />
          </div>

          <div className="dashboard-modules">
            <h4>Available Modules</h4>
            <div className="module-grid">
              {adminSettings?.modules && Object.entries(adminSettings.modules).map(([key, module]) => (
                <div key={key} className={`module-status ${module.enabled ? 'enabled' : 'disabled'}`}>
                  <div className="module-status-icon">{module.enabled ? '✓' : '✗'}</div>
                  <div className="module-status-info">
                    <p>{key === 'userManagement' ? 'User Management' : 
                       key === 'stockManagement' ? 'Stock Management' :
                       key === 'orderManagement' ? 'Order Management' :
                       'Discount Management'}</p>
                    <small>{module.enabled ? 'Enabled' : 'Disabled'}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
