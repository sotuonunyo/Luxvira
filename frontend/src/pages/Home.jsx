import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <img 
        src="/logo.png" 
        alt="Luxvira Scents Logo" 
        style={{ 
          width: '200px', 
          height: '200px', 
          objectFit: 'contain',
          marginBottom: '30px'
        }} 
      />
      <h1 style={{ color: '#8B7355', fontSize: '2.5rem', marginBottom: '20px' }}>
        Welcome to Luxvira Scents
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
        Handcrafted diffusers, scented candles, gypsum crafts & interior decor.<br/>
        Made with love in Nigeria ✨
      </p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link 
          to="/products" 
          style={{ 
            padding: '15px 40px',
            background: '#8B7355',
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#6d5a43'}
          onMouseLeave={(e) => e.target.style.background = '#8B7355'}
        >
          🛍️ Shop Now
        </Link>
        <Link 
          to="/contact" 
          style={{ 
            padding: '15px 40px',
            background: '#F5E6D3',
            color: '#333',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          📬 Contact Us
        </Link>
      </div>
      
      <div style={{ marginTop: '60px', padding: '30px', background: '#FFF9F5', borderRadius: '12px' }}>
        <h2 style={{ color: '#8B7355', marginBottom: '15px' }}>✨ Why Choose Us?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌿</div>
            <h3>Handcrafted</h3>
            <p>Made with care & premium ingredients</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚚</div>
            <h3>Fast Delivery</h3>
            <p>Quick shipping across Nigeria</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💯</div>
            <h3>Quality Guaranteed</h3>
            <p>100% satisfaction guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
