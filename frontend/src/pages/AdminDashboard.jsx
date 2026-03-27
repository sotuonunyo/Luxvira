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
  getCurrentAdmin 
} from '../utils/admin';

// Add this inside the component, before the return:
const adminUser = getCurrentAdmin();

{/* Replace the header div with this */}
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
    <p style={{ margin: '5px 0 0', opacity: 0.9 }}>
      Welcome, {adminUser?.name || adminUser?.email} ✨
    </p>
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
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}
  >
    <img 
      src={adminUser?.photo} 
      alt="" 
      style={{ width: '24px', height: '24px', borderRadius: '50%' }} 
    />
    Logout
  </button>
</div>

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
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin');
      return;
    }
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = getProducts();
    setProducts(allProducts);
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
    
    if (!formData.name || !formData.price || !formData.image) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setMessage({ type: 'success', text: '✅ Product updated!' });
    } else {
      addProduct(productData);
      setMessage({ type: 'success', text: '✅ Product added!' });
    }

    // Reset form
    setFormData({ name: '', category: 'diffusers', price: '', image: '', description: '' });
    setEditingProduct(null);
    setShowForm(false);
    loadProducts();
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      description: product.description
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      setMessage({ type: 'success', text: '🗑️ Product deleted' });
      loadProducts();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleTogglePublish = (id) => {
    togglePublish(id);
    loadProducts();
  };

  const categories = ['diffusers', 'candles', 'gypsum', 'decor'];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
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
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                💡 Tip: Use Cloudinary URL with /w_600,h_600,c_fill,q_auto,f_auto/ for best results
              </p>
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
          <h2 style={{ margin: 0, color: '#333' }}>📦 All Products ({products.length})</h2>
        </div>
        
        {products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>No products yet. Click "Add New Product" to get started!</p>
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
