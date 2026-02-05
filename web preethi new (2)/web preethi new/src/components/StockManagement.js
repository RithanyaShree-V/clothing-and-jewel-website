import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './ManagementModules.css';

const StockManagement = () => {
  const { adminToken } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/stock`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch products');
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditData({
      stock: product.stock || 0,
      price: product.price || 0
    });
  };

  const handleUpdateStock = async (productId) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/stock/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => p._id === productId ? data.data : p));
        setEditingId(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update stock');
    }
  };

  return (
    <div className="management-module">
      <div className="module-header">
        <h3>Stock Management</h3>
        <button className="refresh-btn" onClick={fetchProducts}>🔄 Refresh</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="table-container">
          <table className="management-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">No products found</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>
                      {editingId === product._id ? (
                        <input
                          type="number"
                          value={editData.price}
                          onChange={(e) => setEditData({...editData, price: parseFloat(e.target.value)})}
                          className="edit-input"
                        />
                      ) : (
                        `₹${product.price}`
                      )}
                    </td>
                    <td>
                      {editingId === product._id ? (
                        <input
                          type="number"
                          value={editData.stock}
                          onChange={(e) => setEditData({...editData, stock: parseInt(e.target.value)})}
                          className="edit-input"
                        />
                      ) : (
                        <span className={`stock-badge ${product.stock > 10 ? 'stock-high' : product.stock > 0 ? 'stock-low' : 'stock-out'}`}>
                          {product.stock || 0}
                        </span>
                      )}
                    </td>
                    <td>{product.category}</td>
                    <td>
                      {editingId === product._id ? (
                        <div className="edit-actions">
                          <button
                            className="btn-save"
                            onClick={() => handleUpdateStock(product._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
