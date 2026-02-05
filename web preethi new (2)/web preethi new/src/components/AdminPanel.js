import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import StockManagement from './StockManagement';
import OrderManagement from './OrderManagement';
import DiscountManagement from './DiscountManagement';
import AdminSettings from './AdminSettings';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { isAdminAuthenticated, admin, adminLogout, adminSettings, isModuleEnabled, isEmployee, employeePermissions } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/');
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const modules = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '📊',
      component: AdminDashboard,
      requiresModule: null,
      employeeAccess: true
    },
    {
      id: 'users',
      name: 'User Management',
      icon: '👥',
      component: UserManagement,
      requiresModule: 'userManagement',
      employeeAccess: false
    },
    {
      id: 'stock',
      name: 'Stock Management',
      icon: '📦',
      component: StockManagement,
      requiresModule: 'stockManagement',
      employeeAccess: true
    },
    {
      id: 'orders',
      name: 'Order Management',
      icon: '🛒',
      component: OrderManagement,
      requiresModule: 'orderManagement',
      employeeAccess: false
    },
    {
      id: 'discounts',
      name: 'Discount Management',
      icon: '🏷️',
      component: DiscountManagement,
      requiresModule: 'discountManagement',
      employeeAccess: false
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      component: AdminSettings,
      requiresModule: null,
      employeeAccess: false
    }
  ];

  // Filter modules based on employee status and permissions
  const visibleModules = modules.filter(module => {
    if (isEmployee) {
      // For employees, only show allowed modules
      if (module.id === 'dashboard') return true; // Always show dashboard
      if (module.id === 'stock') return employeePermissions?.canAccessStock || false;
      if (module.id === 'orders') return employeePermissions?.canAccessOrders || false;
      if (module.id === 'users') return employeePermissions?.canAccessUsers || false;
      if (module.id === 'discounts') return employeePermissions?.canAccessDiscounts || false;
      return false; // Hide other modules for employees
    } else {
      // For admins, show based on module settings
      return !module.requiresModule || isModuleEnabled(module.requiresModule);
    }
  });

  const ActiveComponent = modules.find(m => m.id === activeTab)?.component;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      adminLogout();
      navigate('/');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h1>Admin Panel</h1>
          <p className="admin-name">{admin?.name || 'Admin'}</p>
        </div>

        <nav className="admin-nav">
          {visibleModules.map(module => (
            <button
              key={module.id}
              className={`admin-nav-item ${activeTab === module.id ? 'active' : ''}`}
              onClick={() => setActiveTab(module.id)}
              title={module.name}
            >
              <span className="admin-nav-icon">{module.icon}</span>
              <span className="admin-nav-text">{module.name}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="admin-main-content">
        <div className="admin-header">
          <h2>{modules.find(m => m.id === activeTab)?.name}</h2>
          <div className="admin-header-info">
            <span className="admin-phone">📱 {admin?.phoneNumber}</span>
          </div>
        </div>

        <div className="admin-content">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
