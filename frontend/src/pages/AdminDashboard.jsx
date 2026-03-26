// Admin panel for product management
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const navigate = useNavigate();
  
  // Check authentication
  useEffect(() => {
    if (!token) navigate('/admin/login');
    else fetchProducts();
  }, [token]);
  
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });
    if (imageFile) form.append('image', imageFile);
    
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct 
      ? `${import.meta.env.VITE_API_URL}/api/products/${editingProduct.id}`
      : `${import.meta.env.VITE_API_URL}/api/products`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
      });
      
      if (res.ok) {
        alert('Product saved successfully!');
        setEditingProduct(null);
        setFormData({});
        setImageFile(null);
        fetchProducts();
      }
    } catch (err) {
      alert('Failed to save product');
    }
  };
  
  const togglePublish = async (product) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_published: !product.is_published })
      });
      fetchProducts();
    } catch (err) {
      alert('Failed to update product');
    }
  };
  
  return (
    <div className="admin-dashboard">
      <h2>🛠️ Product Management</h2>
      
      {/* Product Form */}
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          placeholder="Product Name *"
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        
        <select
          value={formData.category || ''}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        >
          <option value="">Select Category</option>
          <option value="diffusers">Diffusers</option>
          <option value="candles">Scented Candles</option>
          <option value="gypsum">Gypsum Crafts</option>
          <option value="decor">Interior Decor</option>
        </select>
        
        <input
          type="number"
          step="0.01"
          placeholder="Price *"
          value={formData.price || ''}
          onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
          required
        />
        
        <textarea
          placeholder="Description"
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows="3"
        />
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        
        <label>
          <input
            type="checkbox"
            checked={formData.is_published || false}
            onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
          />
          Publish Product
        </label>
        
        <button type="submit">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>
      
      {/* Products Table */}
      <table className="products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                {product.image_url && (
                  <img src={product.image_url} alt={product.name} width="50" />
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <span className={`status ${product.is_published ? 'published' : 'unpublished'}`}>
                  {product.is_published ? '✅ Published' : '⏸️ Unpublished'}
                </span>
              </td>
              <td>
                <button onClick={() => {
                  setEditingProduct(product);
                  setFormData(product);
                }}>Edit</button>
                <button onClick={() => togglePublish(product)}>
                  {product.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={async () => {
                  if (confirm('Delete this product?')) {
                    await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product.id}`, {
                      method: 'DELETE',
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    fetchProducts();
                  }
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
