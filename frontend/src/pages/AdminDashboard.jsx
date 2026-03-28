import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  isAdminLoggedIn,
  logoutAdmin,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  togglePublish,
  saveProducts
} from '../utils/admin';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'diffusers',
    price: '',
    image: '',
    description: ''
  });
  const [message, setMessage] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const navigate = useNavigate();

  // Debug: Log on mount
  useEffect(() => {
    console.log('🎯 AdminDashboard mounting...');
    console.log('🔐 isAdminLoggedIn:', isAdminLoggedIn());
    
    if (!isAdminLoggedIn()) {
      console.log('❌ Not logged in, redirecting to /admin');
      navigate('/admin');
      return;
    }
    
    console.log('✅ Logged in, loading products...');
    loadProducts();
  }, [navigate]);

  const loadProducts = () => {
    console.log('📦 Loading products from localStorage...');
    try {
      // Direct localStorage check for debugging
      const raw = localStorage.getItem('luxvira_products');
      console.log('🗄️ localStorage raw:', raw ? 'Has data' : 'Empty');
      if (raw) {
        console.log('🗄️ localStorage parsed:', JSON.parse(raw));
      }
      
      const allProducts = getProducts();
      console.log('✅ getProducts() returned:', allProducts);
      console.log('📊 Product count:', Array.isArray(allProducts) ? allProducts.length : 'NOT AN ARRAY');
      
      // Ensure we always set an array
      const productsArray = Array.isArray(allProducts) ? allProducts : [];
      setProducts(productsArray);
      
      setDebugInfo({
        rawStorage: raw ? 'Has data' : 'Empty',
        productCount: productsArray.length,
        firstProduct: productsArray[0]?.name || 'N/A'
      });
    } catch (err) {
      console.error('❌ Error loading products:', err);
      setProducts([]);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📝 Form submitted:', formData);
    
    if (!formData.name || !formData.price || !formData.image) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };
    
    try {
      let result;
      if (editingProduct) {
        console.log('✏️ Updating product:', editingProduct.id);
        result = updateProduct(editingProduct.id, productData);
        setMessage({ type: 'success', text: '✅ Product updated!' });
      } else {
        console.log('➕ Adding new product:', productData);
        result = addProduct(productData);
        setMessage({ type: 'success', text: '✅ Product added!' });
      }
      
      console.log('✅ addProduct result:', result);
      
      // CRITICAL: Force reload products AFTER saving
      console.log('🔄 Reloading products list...');
      loadProducts();
      
      // Reset form
      setFormData({ name: '', category: 'diffusers', price: '', image: '', description: '' });
      setEditingProduct(null);
      setShowForm(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('❌ Error saving product:', err);
      setMessage({ type: 'error', text: 'Failed to save: ' + err.message });
    }
  };

  const handleEdit = (product) => {
    console.log('✏️ Editing product:', product);
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price?.toString() || '',
      image: product.image,
      description: product.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        console.log('🗑️ Deleting product:', id);
        deleteProduct(id);
        setMessage({ type: 'success', text: '🗑️ Product deleted' });
        loadProducts();
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        console.error('❌ Error deleting:', err);
        setMessage({ type: 'error', text: 'Failed to delete' });
      }
    }
  };

  const handleTogglePublish = (id) => {
    try {
      console.log('🔄 Toggling publish:', id);
      togglePublish(id);
      loadProducts();
    } catch (err) {
      console.error('❌ Error toggling:', err);
    }
  };

  const categories = ['diffusers', 'candles', 'gypsum', 'decor'];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
      {/* Debug Info Box */}
      <div style={{ 
        background: '#e3f2fd', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px', 
        fontSize: '0.85rem',
        border: '1px solid #90caf9'
      }}>
        <strong>🔍 Debug Info:</strong>
        <div style={{ marginTop: '10px', fontFamily: 'monospace' }}>
          <div>✅ Logged in: {isAdminLoggedIn() ? 'Yes' : 'No'}</div>
          <div>📦 Products count: {Array.isArray(products) ? products.length : 'ERROR'}</div>
          <div>💾 Storage: {debugInfo.rawStorage || 'Checking...'}</div>
          <div>🎯 First product: {debugInfo.firstProduct || 'None'}</div>
        </div>
        <p style={{ margin: '10px 0 0', color: '#666' }}>
          Check browser console (F12) for detailed logs
        </p>
      </div>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: '#8B7355',
        color: 'white',
        borderRadius: '12px'
      }}>
        <div>
          <h1 style={{ margin: 0 }}>🛠️ Admin Dashboard</h1>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Manage your Luxvira Scents products</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          🔐 Logout
        </button>
      </div>

      {/* Message Toast */}
      {message && (
        <div style={{
          padding: '15px',
          background: message.type === 'success' ? '#4CAF50' : '#f44336',
          color: 'white',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      {/* Add Product Button */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingProduct(null);
          setFormData({ name: '', category: 'diffusers', price: '', image: '', description: '' });
        }}
        style={{
          padding: '14px 30px',
          background: showForm ? '#666' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {showForm ? '✕ Cancel' : '➕ Add New Product'}
      </button>

      {/* Product Form */}
      {showForm && (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ color: '#8B7355', marginTop: 0 }}>
            {editingProduct ? '✏️ Edit Product' : '🆕 Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Lavender Dream Diffuser"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Price (₦) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 4500"
                  required
                  min="0"
                  step="100"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Image URL (Cloudinary) *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://res.cloudinary.com/.../your-image.jpg"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '14px',
                background: '#8B7355',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              {editingProduct ? '💾 Update Product' : '✨ Add Product'}
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: 0, color: '#333' }}>📦 All Products ({Array.isArray(products) ? products.length : 0})</h2>
        </div>
        {!products || products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>No products yet. Click "Add New Product" to get started!</p>
            <p style={{ fontSize: '0.85rem', marginTop: '10px', color: '#999' }}>
              💡 Tip: Check the debug box above and browser console (F12)
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9f9f9' }}>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Image</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Product</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Category</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Price</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: '#f5f5f5' }}
                      />
                    </td>
                    <td style={{ padding: '15px' }}>
                      <strong>{product.name}</strong>
                      {product.description && (
                        <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          {product.description.substring(0, 50)}...
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '15px', textTransform: 'capitalize' }}>
                      {product.category}
                    </td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#8B7355' }}>
                      ₦{product.price?.toLocaleString()}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button
                        onClick={() => handleTogglePublish(product.id)}
                        style={{
                          padding: '6px 14px',
                          background: product.isPublished ? '#4CAF50' : '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        {product.isPublished ? '✅ Published' : '⏸️ Unpublished'}
                      </button>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(product)}
                          style={{
                            padding: '8px 16px',
                            background: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <a href="/" style={{ color: '#8B7355', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Store
        </a>
      </div>
    </div>
  );
}
