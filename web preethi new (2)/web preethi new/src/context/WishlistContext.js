import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('vedhasWishlist');
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
        console.log('[Wishlist] loaded', JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing wishlist from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vedhasWishlist', JSON.stringify(wishlistItems));
    console.log('[Wishlist] saved', wishlistItems);
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(p => String(p.id) === String(product.id));
      if (exists) return prev;
      const next = [...prev, product];
      console.log('[Wishlist] add', product.id);
      return next;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => {
      const next = prev.filter(p => String(p.id) !== String(productId));
      console.log('[Wishlist] remove', productId);
      return next;
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(p => String(p.id) === String(productId));
  };

  const toggleWishlist = (product) => {
    if (!product || typeof product.id === 'undefined') {
      console.warn('[Wishlist] toggle called with invalid product', product);
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
