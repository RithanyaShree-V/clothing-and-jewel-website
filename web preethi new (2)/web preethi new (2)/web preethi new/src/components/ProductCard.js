import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import './ProductCard.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
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

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        {product.isNew && <div className="new-badge">NEW</div>}
        <button
          className={`wishlist-button ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>
        <div className="product-image-wrapper">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400?text=' + encodeURIComponent(product.name);
            }}
          />
        </div>
        <div className="product-info">
          <div className="product-category">{product.category.toUpperCase()}</div>
          <div className="product-name">{product.name}</div>
          <div className="product-price">{formatPrice(product.price)}</div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;

