import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './ManagementModules.css';

const AdminSettings = () => {
  const { adminSettings, adminToken, updateAdminSettings } = useAdmin();
  const [settings, setSettings] = useState({
    modules: {},
    employeePermissions: {}
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (adminSettings) {
      setSettings(adminSettings);
    }
  }, [adminSettings]);

  const handleModuleToggle = async (moduleName) => {
    const newSettings = {
      modules: {
        ...settings.modules,
        [moduleName]: {
          ...settings.modules[moduleName],
          enabled: !settings.modules[moduleName].enabled
        }
      }
    };
    setSettings(newSettings);
    await updateSettingsOnServer(newSettings);
  };

  const handleEmployeePermissionToggle = async (permission) => {
    const newSettings = {
      employeePermissions: {
        ...settings.employeePermissions,
        [permission]: !settings.employeePermissions[permission]
      }
    };
    setSettings(newSettings);
    await updateSettingsOnServer(newSettings);
  };

  const updateSettingsOnServer = async (updatedSettings) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await updateAdminSettings(updatedSettings);
      if (result.success) {
        setSuccess('Settings updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update settings');
      }
    } catch (err) {
      setError('Error updating settings');
    }
    setLoading(false);
  };

  const moduleDescriptions = {
    userManagement: 'Allow admin to manage users, view profiles, and delete accounts',
    stockManagement: 'Allow access to product inventory and stock level management',
    orderManagement: 'Allow viewing and managing customer orders',
    discountManagement: 'Allow creating and managing discounts and offers'
  };

  const permissionDescriptions = {
    canAccessStock: 'Allow employees to access stock management',
    canAccessOrders: 'Allow employees to access order management',
    canAccessUsers: 'Allow employees to access user management',
    canAccessDiscounts: 'Allow employees to access discount management'
  };

  return (
    <div className="management-module">
      <div className="module-header">
        <h3>Admin Settings</h3>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="settings-container">
        <div className="settings-section">
          <h4>📋 Module Management</h4>
          <p className="section-description">Enable or disable modules for your admin panel</p>

          <div className="settings-grid">
            {settings.modules && Object.entries(settings.modules).map(([key, module]) => (
              <div key={key} className="setting-item">
                <div className="setting-header">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={module.enabled}
                      onChange={() => handleModuleToggle(key)}
                      disabled={loading}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                    <span className="setting-name">
                      {key === 'userManagement' ? '👥 User Management' :
                       key === 'stockManagement' ? '📦 Stock Management' :
                       key === 'orderManagement' ? '🛒 Order Management' :
                       '🏷️ Discount Management'}
                    </span>
                  </label>
                </div>
                <p className="setting-description">{moduleDescriptions[key]}</p>
                <span className={`status-badge ${module.enabled ? 'enabled' : 'disabled'}`}>
                  {module.enabled ? '✓ Enabled' : '✗ Disabled'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h4>👨‍💼 Employee Permissions</h4>
          <p className="section-description">Configure what permissions employees have by default</p>

          <div className="settings-grid">
            {settings.employeePermissions && Object.entries(settings.employeePermissions).map(([key, enabled]) => (
              <div key={key} className="setting-item">
                <div className="setting-header">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handleEmployeePermissionToggle(key)}
                      disabled={loading}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                    <span className="setting-name">
                      {key === 'canAccessStock' ? '📦 Stock Access' :
                       key === 'canAccessOrders' ? '🛒 Orders Access' :
                       key === 'canAccessUsers' ? '👥 Users Access' :
                       '🏷️ Discounts Access'}
                    </span>
                  </label>
                </div>
                <p className="setting-description">{permissionDescriptions[key]}</p>
                <span className={`status-badge ${enabled ? 'enabled' : 'disabled'}`}>
                  {enabled ? '✓ Allowed' : '✗ Denied'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-info">
          <h5>💡 Info</h5>
          <ul>
            <li>Disabled modules won't appear in the admin panel for anyone</li>
            <li>Employee permissions control what features new employees can access</li>
            <li>You can change individual employee permissions anytime</li>
            <li>Changes are applied immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
