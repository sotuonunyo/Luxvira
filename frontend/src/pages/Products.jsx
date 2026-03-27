import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts, isAdminLoggedIn } from '../utils/admin';

// Fallback sample products (only shown if no admin products exist)
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Lavender Dream Diffuser',
    category: 'diffusers',
    price: 4500,
    image: 'https://via.placeholder.com/300x300/8B7355/FFFFFF?text=Lavender',
    description: 'Handcrafted reed diffuser with calming lavender scent.',
    isPublished: true
  },
  {
    id: 2,
    name: 'Vanilla Bean Candle',
    category: 'candles',
    price: 3200,
    image: 'https://via.placeholder.com/300x300/F5E6D3/333333?text=Vanilla',
    description: 'Soy wax candle with pure vanilla essence.',
    isPublished: true
  }
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart, cartCount } = useCart();

  // Load products: prefer admin-saved, fallback to samples
  useEffect(() => {
    const adminProducts = getProducts();
    if (adminProducts && adminProducts.length > 0) {
      setProducts(adminProducts);
    } else {
      setProducts(SAMPLE_PRODUCTS);
    }
  }, []);

  const categories = ['all', 'diffusers', 'candles', 'gypsum', 'decor'];
  
  // Filter: show published products (or all if admin)
  const filtered = products
    .filter(p => isAdminLoggedIn() || p.isPublished !== false)
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#8B7355' }}>🛍️ Our Products</h1>
        <p style={{ color: '#666' }}>Handcrafted with love in Nigeria ✨</p>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
            padding: '8px 20px',
            background: selectedCategory === cat ? '#8B7355' : '#F5E6D3',
            color: selectedCategory === cat ? 'white' : '#333',
            border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '500'
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <p>No products in this category yet.</p>
          {isAdminLoggedIn() && (
            <Link to="/admin/dashboard" style={{ color: '#8B7355', fontWeight: 'bold' }}>
              Add products in Admin Panel →
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filtered.map(product => (
            <div key={product.id} style={{
              background: 'white', borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <img src={product.image} alt={product.name} style={{
                width: '100%', height: '250px', objectFit: 'cover', background: '#f9f9f9'
              }} />
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 8px', color: '#333', fontSize: '1.1rem' }}>{product.name}</h3>
                <p style={{ margin: '0 0 12px', color: '#666', fontSize: '0.95rem' }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#8B7355' }}>
                    ₦{product.price?.toLocaleString()}
                  </span>
                  <button onClick={() => {
                    addToCart(product);
                    alert(`✅ ${product.name} added to cart!`);
                  }} style={{
                    padding: '10px 20px', background: '#8B7355', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart floating button */}
      {cartCount > 0 && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px',
          background: '#8B7355', color: 'white', padding: '15px 25px',
          borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '15px', zIndex: 100
        }}>
          <span style={{ fontSize: '1.2rem' }}>🛒</span>
          <div>
            <div style={{ fontWeight: 'bold' }}>{cartCount} item{cartCount > 1 ? 's' : ''} in cart</div>
            <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>View Cart →</Link>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/" style={{ color: '#8B7355', textDecoration: 'none' }}>← Back to Home</Link>
      </div>
    </div>
  );
}
