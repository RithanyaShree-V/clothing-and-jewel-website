import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import './Wishlist.css';

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-page">
      <h2>Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <div className="empty">No items in wishlist.</div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div className="wish-item" key={item.id}>
              <div className="wish-image-wrapper">
                <img src={item.image} alt={item.name} onError={(e)=>{e.target.src='https://via.placeholder.com/150?text='+encodeURIComponent(item.name)}} />
              </div>
              <div className="wish-info">
                <div className="wish-name">{item.name}</div>
                <div className="wish-price">{formatPrice(item.price)}</div>
                <button className="remove-btn" onClick={() => removeFromWishlist(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
