import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './AllProducts.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function AllProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    // Fetch categories
    fetch(`${API_BASE}/api/products/categories/all`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    if (categoryParam === 'new') {
      setSelectedCategory('New');
    } else if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam, categories]);

  useEffect(() => {
    // Fetch products based on selected category
    setLoading(true);
    let url = `${API_BASE}/api/products`;
    if (selectedCategory === 'New') {
      url += '?isNew=true';
    } else if (selectedCategory !== 'All') {
      url += `?category=${encodeURIComponent(selectedCategory)}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setSearchParams({});
    } else if (category === 'New') {
      setSearchParams({ category: 'new' });
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="all-products">
      <h1 className="page-title">{selectedCategory === 'New' ? 'New Arrivals' : 'All Products'}</h1>
      <p className="page-subtitle">
        {selectedCategory === 'New'
          ? 'Discover the latest additions to our collection.'
          : 'Browse our complete collection of traditional and modern clothing.'}
      </p>

      <div className="category-filters">
        <button
          className={`filter-button ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('All')}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="no-products">
              <p>No products found in this category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AllProducts;

