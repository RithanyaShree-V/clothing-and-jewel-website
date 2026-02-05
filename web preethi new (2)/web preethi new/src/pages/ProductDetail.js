import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FaHeart, FaRegHeart, FaTimes } from 'react-icons/fa';
import { formatPrice } from '../utils/currency';
import { products } from '../data/products';
import './ProductDetail.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data);
        } else {
          setProduct(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

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

  // Get related products (same category, exclude current)
  const relatedProducts = products.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="product-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      
      <div className="product-detail-content">
        <div className="product-image-section">
          <img 
            src={process.env.PUBLIC_URL + product.image} 
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

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="modal-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSizeGuide(false)}>
              <FaTimes />
            </button>
            <h2>Size Guide</h2>
            <table className="size-guide-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>XS</th>
                  <th>S</th>
                  <th>M</th>
                  <th>L</th>
                  <th>XL</th>
                  <th>XXL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bust (in inches)</td>
                  <td>32</td>
                  <td>34</td>
                  <td>36</td>
                  <td>38</td>
                  <td>40</td>
                  <td>42</td>
                </tr>
                <tr>
                  <td>Waist (in inches)</td>
                  <td>26</td>
                  <td>28</td>
                  <td>30</td>
                  <td>32</td>
                  <td>34</td>
                  <td>36</td>
                </tr>
                <tr>
                  <td>Hip (in inches)</td>
                  <td>34</td>
                  <td>36</td>
                  <td>38</td>
                  <td>40</td>
                  <td>42</td>
                  <td>44</td>
                </tr>
              </tbody>
            </table>
            <p className="size-guide-note">For best fit, measure yourself and compare with the chart above.</p>
          </div>
        </div>
      )}

      {/* PRODUCT DESCRIPTION SECTION */}
      <section className="product-description-section">
        <h2>Product Details</h2>
        <div className="description-grid">
          <div className="description-item">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          <div className="description-item">
            <h3>Key Benefits</h3>
            <ul className="benefits-list">
              <li>Premium quality fabric for comfort and durability</li>
              <li>Traditional design with modern appeal</li>
              <li>Perfect for casual and semi-formal occasions</li>
              <li>Easy to care and maintain</li>
              <li>Flattering fit for all body types</li>
            </ul>
          </div>
          <div className="description-item">
            <h3>Quotation</h3>
            <blockquote className="product-quotation">
              "Elegance is not being noticed, it's being remembered." - Giorgio Armani
            </blockquote>
          </div>
        </div>
        <button className="size-guide-btn" onClick={() => setShowSizeGuide(true)}>
          View Size Guide
        </button>
      </section>



      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>You May Also Like</h2>
          <div className="related-products-grid">
            {relatedProducts.map(relProd => (
              <div 
                key={relProd.id} 
                className="related-product-card"
                onClick={() => navigate(`/product/${relProd.id}`)}
              >
                <div className="related-image-wrapper">
                  <img 
                    src={process.env.PUBLIC_URL + relProd.image} 
                    alt={relProd.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x250?text=' + encodeURIComponent(relProd.name);
                    }}
                  />
                </div>
                <div className="related-info">
                  <h4>{relProd.name}</h4>
                  <p className="related-price">{formatPrice(relProd.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PRODUCT COMPARISON SECTION */}
      <section className="comparison-section">
        <div className="comparison-header">
          <h2>Quick Comparison</h2>
          <button className="comparison-toggle-btn" onClick={() => setShowComparison(!showComparison)}>
            {showComparison ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        {showComparison && (
          <div className="comparison-details">
            <table className="comparison-table">
              <tbody>
                <tr>
                  <td className="comparison-label">Category</td>
                  <td className="comparison-value">{product.category}</td>
                </tr>
                <tr>
                  <td className="comparison-label">Price</td>
                  <td className="comparison-value">{formatPrice(product.price)}</td>
                </tr>
                <tr>
                  <td className="comparison-label">Rating</td>
                  <td className="comparison-value">{ratingRounded} ★ ({reviewCount} reviews)</td>
                </tr>
                <tr>
                  <td className="comparison-label">Status</td>
                  <td className="comparison-value">{product.isNew ? 'New Arrival' : 'Regular'}</td>
                </tr>
                <tr>
                  <td className="comparison-label">Availability</td>
                  <td className="comparison-value">In Stock</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductDetail;

