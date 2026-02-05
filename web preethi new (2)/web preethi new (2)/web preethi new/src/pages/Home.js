import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Home.css';

function Home() {
  const newArrivals = products.filter(product => product.isNew).slice(0, 4);
  const heroStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL + '/images/Dressing.jpg'}), url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200')`
  };

  return (
    <div className="home">
      <div className="hero-section" style={heroStyle}>
        <div className="hero-overlay">
          <h1 className="hero-title">Vedha's Clothing</h1>
          <p className="hero-subtitle">Traditional Elegance Meets Modern Style</p>
          <Link to="/products?category=new" className="hero-button">
            Shop New Arrivals
            <span className="arrow-icon">→</span>
          </Link>
        </div>
      </div>

      <div className="new-arrivals-section">
        <h2 className="section-title">New Arrivals</h2>
        <p className="section-subtitle">Discover our latest collection.</p>
        
        <div className="products-grid">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/products?category=new" className="view-all-button">
            View All New Arrivals
          </Link>
        </div>
      </div>

      <div className="shop-category-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-buttons">
          <Link to="/products?category=Kurti" className="category-button">Kurti</Link>
          <Link to="/products?category=Maternity Wears" className="category-button">Maternity Wears</Link>
          <Link to="/products?category=Sarees" className="category-button">Sarees</Link>
          <Link to="/products?category=Jewelry" className="category-button">Jewelry</Link>
          <Link to="/products?category=Handbags" className="category-button">Handbags</Link>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-item">
          <div className="feature-number">100%</div>
          <div className="feature-text">Authentic Products</div>
        </div>
        <div className="feature-item">
          <div className="feature-number">Fast</div>
          <div className="feature-text">Delivery Worldwide</div>
        </div>
        <div className="feature-item">
          <div className="feature-number">24/7</div>
          <div className="feature-text">Customer Support</div>
        </div>
      </div>

      <div className="featured-products-section">
        <h2 className="section-title">Featured Products</h2>
        <p className="section-subtitle">Customer Favorites</p>
      </div>
    </div>
  );
}

export default Home;

