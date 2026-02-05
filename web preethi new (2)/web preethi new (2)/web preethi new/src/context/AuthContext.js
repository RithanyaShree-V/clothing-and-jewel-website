import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const signUp = (userData) => {
    // Get existing users
    const existingUsers = JSON.parse(localStorage.getItem('vedhasUsers') || '[]');
    
    // Check if email already exists
    const emailExists = existingUsers.some(u => u.email === userData.email);
    if (emailExists) {
      return { success: false, error: 'Email already registered. Please sign in instead.' };
    }

    // Add new user
    const newUser = {
      id: Date.now().toString(),
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    };

    existingUsers.push(newUser);
    localStorage.setItem('vedhasUsers', JSON.stringify(existingUsers));
    
    // Removed auto-login logic
    return { success: true };
  };

  const signIn = (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('vedhasUsers') || '[]');
    const user = existingUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: 'Invalid email or password. Please check your credentials or sign up first.' };
    }

    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('vedhasUser', JSON.stringify(user));
    localStorage.setItem('vedhasAuth', 'true');

    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vedhasUser');
    localStorage.removeItem('vedhasAuth');
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

