import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

// ========== HOME PAGE ==========
function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#8B7355', fontSize: '2.5rem' }}>🕯️ Luxvira Scents</h1>
      <p style={{ fontSize: '1.2rem', color: '#555' }}>
        Handcrafted Diffusers • Scented Candles • Gypsum Crafts • Interior Decor
      </p>
      
      <div style={{ marginTop: '40px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/products" style={{ 
          padding: '12px 30px', 
          background: '#8B7355', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>
          🛍️ View Products
        </Link>
        <Link to="/contact" style={{ 
          padding: '12px 30px', 
          background: '#F5E6D3', 
          color: '#333', 
          textDecoration: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>
          📬 Contact Us
        </Link>
      </div>

      <div style={{ marginTop: '60px', padding: '30px', background: '#FFF9F5', borderRadius: '12px' }}>
        <h2 style={{ color: '#8B7355' }}>✨ Welcome to Luxvira Scents</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          Discover our collection of handcrafted home fragrance and decor items. 
          Each piece is made with love to bring warmth and elegance to your space.
        </p>
      </div>
    </div>
  )
}

// ========== PRODUCTS PAGE ==========
function Products() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#8B7355' }}>🛍️ Our Products</h1>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
        <span style={{ padding: '8px 16px', background: '#F5E6D3', borderRadius: '20px', fontSize: '0.9rem' }}>All</span>
        <span style={{ padding: '8px 16px', background: '#eee', borderRadius: '20px', fontSize: '0.9rem' }}>Diffusers</span>
        <span style={{ padding: '8px 16px', background: '#eee', borderRadius: '20px', fontSize: '0.9rem' }}>Candles</span>
        <span style={{ padding: '8px 16px', background: '#eee', borderRadius: '20px', fontSize: '0.9rem' }}>Gypsum</span>
        <span style={{ padding: '8px 16px', background: '#eee', borderRadius: '20px', fontSize: '0.9rem' }}>Decor</span>
      </div>

      <div style={{ padding: '40px 20px', background: '#FFF9F5', borderRadius: '12px', margin: '30px 0' }}>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          🎨 Products will appear here once added via the Admin Panel.<br/>
          <strong>Next step:</strong> We'll set up your Admin Login so you can add your first product!
        </p>
      </div>
      
      <Link to="/" style={{ color: '#8B7355', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Back to Home
      </Link>
    </div>
  )
}

// ========== CONTACT PAGE ==========
function Contact() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#8B7355' }}>📬 Contact Us</h1>
      
      <div style={{ padding: '30px', background: '#FFF9F5', borderRadius: '12px', margin: '30px 0', textAlign: 'left' }}>
        <p style={{ marginBottom: '20px' }}><strong>We'd love to hear from you!</strong></p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={(e) => { e.preventDefault(); alert('Thank you! We will get back to you soon. ✨'); }}>
          <input type="text" placeholder="Your Name *" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
          <input type="email" placeholder="Your Email *" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
          <input type="tel" placeholder="Phone (optional)" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
          <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}>
            <option value="">Select Inquiry Type</option>
            <option value="order">Order Question</option>
            <option value="product">Product Info</option>
            <option value="feedback">Feedback</option>
            <option value="newsletter">Join Newsletter</option>
            <option value="other">Other</option>
          </select>
          <textarea placeholder="Your Message *" required rows="4" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical' }}></textarea>
          <button type="submit" style={{ 
            padding: '14px', 
            background: '#8B7355', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Send Message ✨
          </button>
        </form>
      </div>
      
      <div style={{ color: '#666', lineHeight: '1.8' }}>
        <p>📧 Email: hello@luxvirascents.com</p>
        <p>📱 WhatsApp: +1 (234) 567-890</p>
        <p>🕒 Hours: Mon-Sat, 9AM - 6PM</p>
      </div>
      
      <Link to="/" style={{ color: '#8B7355', textDecoration: 'none', fontWeight: 'bold', display: 'block', marginTop: '30px' }}>
        ← Back to Home
      </Link>
    </div>
  )
}

// ========== MAIN APP WITH ROUTING ==========
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        
        {/* Header */}
        <header style={{ 
          padding: '15px 20px', 
          background: '#fff', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Link to="/" style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#8B7355', 
              textDecoration: 'none' 
            }}>
              🕯️ Luxvira Scents
            </Link>
            <nav style={{ display: 'flex', gap: '20px' }}>
              <Link to="/" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
              <Link to="/products" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>Products</Link>
              <Link to="/contact" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>Contact</Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{ 
          padding: '25px 20px', 
          background: '#F5E6D3', 
          textAlign: 'center', 
          fontSize: '0.9rem',
          color: '#555'
        }}>
          <p style={{ margin: '5px 0' }}>© {new Date().getFullYear()} Luxvira Scents. All rights reserved.</p>
          <p style={{ margin: '5px 0', fontSize: '0.85rem' }}>Handcrafted with love • Premium Home Fragrance & Decor</p>
        </footer>

      </div>
    </BrowserRouter>
  )
}
