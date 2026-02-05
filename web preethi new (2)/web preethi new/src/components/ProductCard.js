import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import './ProductCard.css';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';

function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    // prevent navigation when clicking the heart
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Calculate discount for visual display
  const originalPrice = Math.round(product.price * 1.3);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  
  // Generate a consistent rating for each product based on ID
  const rating = 3.5 + (product.id % 15) * 0.1;
  const ratingRounded = Math.round(rating * 10) / 10;
  const reviews = 100 + (product.id * 47) % 500;

  // Determine if product should have "Free Delivery" badge
  const freeDelivery = product.price > 500;

  return (
    <div className="product-card">
      <button
        className={`wishlist-button ${inWishlist ? 'active' : ''}`}
        onClick={handleWishlistClick}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {inWishlist ? <FaHeart /> : <FaRegHeart />}
      </button>
      
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="badges-section">
          {product.isNew && <div className="new-badge">NEW</div>}
          {discountPercent > 0 && <div className="discount-badge">{discountPercent}% OFF</div>}
          {freeDelivery && <div className="free-delivery-badge">FREE DELIVERY</div>}
        </div>
        
        <div className="product-image-wrapper">
          <img 
            src={process.env.PUBLIC_URL + product.image} 
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400?text=' + encodeURIComponent(product.name);
            }}
          />
          <div className="quick-view-overlay">Quick View</div>
        </div>
        
        <div className="product-info">
          <div className="product-category">{product.category.toUpperCase()}</div>
          <div className="product-name">{product.name}</div>
          
          <div className="rating-section">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i}
                  className={`star ${i < Math.floor(ratingRounded) ? 'filled' : i < ratingRounded ? 'half' : 'empty'}`}
                />
              ))}
            </div>
            <span className="rating-text">{ratingRounded}</span>
            <span className="reviews-count">({reviews})</span>
          </div>
          
          <div className="price-section">
            <div className="product-price">{formatPrice(product.price)}</div>
            <div className="original-price">{formatPrice(originalPrice)}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;

