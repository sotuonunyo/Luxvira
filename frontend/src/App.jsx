import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

// Simple placeholder pages (we'll enhance these step by step)
function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>🕯️ Luxvira Scents</h1>
      <p>Handcrafted Diffusers • Scented Candles • Gypsum Crafts • Interior Decor</p>
      <div style={{ marginTop: '30px' }}>
        <Link to="/products" style={{ margin: '0 10px', padding: '10px 20px', background: '#8B7355', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          View Products
        </Link>
        <Link to="/contact" style={{ margin: '0 10px', padding: '10px 20px', background: '#F5E6D3', color: '#333', textDecoration: 'none', borderRadius: '5px' }}>
          Contact Us
        </Link>
      </div>
    </div>
  )
}

function Products() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>🛍️ Our Products</h1>
      <p>Products will appear here soon! (Admin panel coming next)</p>
      <Link to="/" style={{ color: '#8B7355' }}>← Back to Home</Link>
    </div>
  )
}

function Contact() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>📬 Contact Us</h1>
      <p>Have questions or feedback? We'd love to hear from you!</p>
      <p><i>Contact form coming in the next step...</i></p>
      <Link to="/" style={{ color: '#8B7355' }}>← Back to Home</Link>
    </div>
  )
}

// Main App with routing
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Simple Header */}
        <header style={{ padding: '15px 20px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold', color: '#8B7355', textDecoration: 'none' }}>
              🕯️ Luxvira Scents
            </Link>
            <nav>
              <Link to="/" style={{ margin: '0 10px', color: '#333', textDecoration: 'none' }}>Home</Link>
              <Link to="/products" style={{ margin: '0 10px', color: '#333', textDecoration: 'none' }}>Products</Link>
              <Link to="/contact" style={{ margin: '0 10px', color: '#333', textDecoration: 'none' }}>Contact</Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer style={{ padding: '20px', background: '#F5E6D3', textAlign: 'center', fontSize: '14px' }}>
          <p>© {new Date().getFullYear()} Luxvira Scents. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}
