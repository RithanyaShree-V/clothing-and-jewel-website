import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import './AllProducts.css';

function AllProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    if (categoryParam === 'new') {
      setSelectedCategory('New');
    } else if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam]);

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

  const getFilteredProducts = () => {
    if (selectedCategory === 'New') {
      return products.filter(product => product.isNew);
    } else if (selectedCategory === 'All') {
      return products;
    } else {
      return products.filter(product => product.category === selectedCategory);
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="all-products">
      <h1 className="page-title">All Products</h1>
      <p className="page-subtitle">Browse our complete collection of traditional and modern clothing.</p>

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

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No products found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default AllProducts;

