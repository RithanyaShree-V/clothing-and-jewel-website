import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const CartContext = createContext();

const normalizeId = (value) => {
  const raw = value?.id ?? value?._id ?? value?.productId ?? value?.product?.id ?? value?.product?._id ?? value;
  return raw != null ? raw.toString() : '';
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from backend if authenticated, else from localStorage
  useEffect(() => {
    const token = localStorage.getItem('vedhasToken');
    if (token) {
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setCartItems(data.data.items || []);
          } else {
            // fallback to local storage
            const savedCart = localStorage.getItem('vedhasCart');
            if (savedCart) setCartItems(JSON.parse(savedCart));
          }
        } catch {
          const savedCart = localStorage.getItem('vedhasCart');
          if (savedCart) setCartItems(JSON.parse(savedCart));
        }
      })();
    } else {
      const savedCart = localStorage.getItem('vedhasCart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vedhasCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product) => {
    const token = localStorage.getItem('vedhasToken');
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product.id, quantity: 1 })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCartItems(data.data.items || []);
          return;
        }
      } catch (e) {
        // fall back to local storage below
      }
    }
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('vedhasToken');
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/cart/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCartItems(data.data.items || []);
          return;
        }
      } catch {}
    }
    const targetId = normalizeId(productId);
    setCartItems(prevItems => prevItems.filter(item => normalizeId(item) !== targetId));
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const token = localStorage.getItem('vedhasToken');
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/cart/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ quantity })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCartItems(data.data.items || []);
          return;
        }
      } catch {}
    }
    const targetId = normalizeId(productId);
    setCartItems(prevItems =>
      prevItems.map(item =>
        normalizeId(item) === targetId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    const token = localStorage.getItem('vedhasToken');
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/cart`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCartItems([]);
          localStorage.removeItem('vedhasCart');
          return;
        }
      } catch {}
    }
    setCartItems([]);
    localStorage.removeItem('vedhasCart');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

