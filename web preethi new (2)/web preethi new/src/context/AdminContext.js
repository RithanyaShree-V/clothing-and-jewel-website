import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminSettings, setAdminSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [employeePermissions, setEmployeePermissions] = useState(null);

  // Load admin from localStorage on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem('vedhasAdmin');
    const savedToken = localStorage.getItem('vedhasAdminToken');
    const savedIsEmployee = localStorage.getItem('vedhasIsEmployee');
    const savedPermissions = localStorage.getItem('vedhasEmployeePermissions');
    
    if (savedAdmin && savedToken) {
      try {
        setAdmin(JSON.parse(savedAdmin));
        setAdminToken(savedToken);
        setIsAdminAuthenticated(true);
        if (savedIsEmployee === 'true') {
          setIsEmployee(true);
          setEmployeePermissions(JSON.parse(savedPermissions || '{}'));
        }
        // Fetch settings only for admins
        if (savedIsEmployee !== 'true') {
          fetchAdminSettings(savedToken);
        }
      } catch (error) {
        console.error('Error loading admin from localStorage:', error);
        localStorage.removeItem('vedhasAdmin');
        localStorage.removeItem('vedhasAdminToken');
        localStorage.removeItem('vedhasIsEmployee');
        localStorage.removeItem('vedhasEmployeePermissions');
      }
    }
  }, []);

  const fetchAdminSettings = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAdminSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching admin settings:', error);
    }
  };

  const requestOTP = async (phoneNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await res.json();
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Network error' };
    }
  };

  const loginWithPhone = async (phoneNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.data.token) {
        const adminData = data.data.admin;
        const isEmp = adminData.type === 'employee';

        setAdmin(adminData);
        setAdminToken(data.data.token);
        setIsAdminAuthenticated(true);
        setIsEmployee(isEmp);
        
        if (isEmp) {
          setEmployeePermissions(adminData.permissions || {});
          localStorage.setItem('vedhasIsEmployee', 'true');
          localStorage.setItem('vedhasEmployeePermissions', JSON.stringify(adminData.permissions || {}));
        } else {
          localStorage.setItem('vedhasIsEmployee', 'false');
        }

        localStorage.setItem('vedhasAdmin', JSON.stringify(adminData));
        localStorage.setItem('vedhasAdminToken', data.data.token);
        
        // Fetch settings only for admins
        if (!isEmp) {
          fetchAdminSettings(data.data.token);
        }
      }

      return data;
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Network error' };
    }
  };

  const verifyOTP = async (phoneNumber, otp) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.data.token) {
        const adminData = data.data.admin;
        setAdmin(adminData);
        setAdminToken(data.data.token);
        setIsAdminAuthenticated(true);
        localStorage.setItem('vedhasAdmin', JSON.stringify(adminData));
        localStorage.setItem('vedhasAdminToken', data.data.token);
        // Fetch settings
        fetchAdminSettings(data.data.token);
      }

      return data;
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Network error' };
    }
  };

  const adminLogout = () => {
    setAdmin(null);
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    setAdminSettings(null);
    localStorage.removeItem('vedhasAdmin');
    localStorage.removeItem('vedhasAdminToken');
  };

  const updateAdminSettings = async (updatedSettings) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(updatedSettings)
      });
      const data = await res.json();
      if (data.success) {
        setAdminSettings(data.data);
      }
      return data;
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const isModuleEnabled = (moduleName) => {
    return adminSettings?.modules?.[moduleName]?.enabled || false;
  };

  const value = {
    admin,
    adminToken,
    isAdminAuthenticated,
    adminSettings,
    loading,
    isEmployee,
    employeePermissions,
    loginWithPhone,
    requestOTP,
    verifyOTP,
    adminLogout,
    updateAdminSettings,
    isModuleEnabled
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
