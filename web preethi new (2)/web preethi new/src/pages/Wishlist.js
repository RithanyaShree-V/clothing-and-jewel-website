import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import './Wishlist.css';

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-page">
      <h2>Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">❤️</div>
          <p className="empty-wishlist-text">Your wishlist is empty</p>
          <p className="empty-wishlist-subtext">Save your favorite items to your wishlist and they'll be waiting for you here. Start exploring our collection!</p>
          <Link to="/products" className="explore-button">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div className="wish-item" key={item.id}>
              <div className="wish-image-wrapper">
                <img src={process.env.PUBLIC_URL + item.image} alt={item.name} onError={(e)=>{e.target.src='https://via.placeholder.com/150?text='+encodeURIComponent(item.name)}} />
              </div>
              <div className="wish-info">
                <div className="wish-category">{item.category}</div>
                <div className="wish-name">{item.name}</div>
                <div className="wish-price">{formatPrice(item.price)}</div>
                <button className="remove-btn" onClick={() => removeFromWishlist(item.id)}>Remove from Wishlist</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
