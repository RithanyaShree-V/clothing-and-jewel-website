import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { formatPrice } from '../utils/currency';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-detail">
        <div className="product-not-found">
          <p>Product not found</p>
          <button onClick={() => navigate('/products')} className="back-button">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <div className="product-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      
      <div className="product-detail-content">
        <div className="product-image-section">
          <img 
            src={product.image} 
            alt={product.name}
            className="detail-product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x600?text=' + encodeURIComponent(product.name);
            }}
          />
          {product.isNew && <div className="detail-new-badge">NEW</div>}
        </div>

        <div className="product-info-section">
          <div className="detail-category">{product.category.toUpperCase()}</div>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price">{formatPrice(product.price)}</div>
          <div className="detail-actions">
            <button onClick={handleAddToCart} className="add-to-cart-button">
              Add to Cart
            </button>
            <button onClick={handleWishlist} className={`detail-wishlist-button ${inWishlist ? 'active' : ''}`} aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
              {inWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

