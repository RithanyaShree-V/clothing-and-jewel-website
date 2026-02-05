import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vedhasUser');
    const savedAuth = localStorage.getItem('vedhasAuth');
    if (savedUser && savedAuth === 'true') {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
  }, []);

  const signUp = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Signup failed' };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during signup' };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid email or password.' };
      }
      const authUser = data.user;
      setUser(authUser);
      setIsAuthenticated(true);
      localStorage.setItem('vedhasUser', JSON.stringify(authUser));
      localStorage.setItem('vedhasAuth', 'true');
      if (data.token) {
        localStorage.setItem('vedhasToken', data.token);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during login' };
    }
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vedhasUser');
    localStorage.removeItem('vedhasAuth');
    localStorage.removeItem('vedhasToken');
  };

  const checkIfUserExists = () => {
    const existingUsers = JSON.parse(localStorage.getItem('vedhasUsers') || '[]');
    return existingUsers.length > 0;
  };

  const value = {
    user,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    checkIfUserExists
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

