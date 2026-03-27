import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <img 
        src="/logo.png" 
        alt="Luxvira Scents Logo" 
        style={{ 
          width: '150px', 
          height: '150px', 
          objectFit: 'contain',
          marginBottom: '20px'
        }} 
      />
      <h1>Luxvira Scents</h1>
      <p>Version: 1.0 - Fresh Build</p>
      <nav style={{ marginTop: '30px' }}>
        <Link to="/products" style={{ margin: '0 10px' }}>Products</Link>
        <Link to="/contact" style={{ margin: '0 10px' }}>Contact</Link>
      </nav>
    </div>
  )
}

function Products() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <img 
        src="/logo.png" 
        alt="Luxvira Scents Logo" 
        style={{ 
          width: '120px', 
          height: '120px', 
          objectFit: 'contain',
          marginBottom: '20px'
        }} 
      />
      <h1>🛍️ Products</h1>
      <p>Products coming soon!</p>
      <Link to="/">← Back to Home</Link>
    </div>
  )
}

function Contact() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <img 
        src="/logo.png" 
        alt="Luxvira Scents Logo" 
        style={{ 
          width: '120px', 
          height: '120px', 
          objectFit: 'contain',
          marginBottom: '20px'
        }} 
      />
      <h1>📬 Contact Us</h1>
      <p style={{ background: '#4CAF50', color: 'white', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
        ✅ FRESH BUILD - WhatsApp Integration v1.0
      </p>
      <p><strong>WhatsApp:</strong> +234 803 799 1435</p>
      <p><strong>Email:</strong> luxvirascents@gmail.com</p>
      <Link to="/">← Back to Home</Link>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', fontFamily: 'Arial' }}>
        <header style={{ padding: '20px', background: '#8B7355', color: 'white', textAlign: 'center' }}>
          <img 
            src="/logo.png" 
            alt="Luxvira Scents Logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'contain',
              verticalAlign: 'middle',
              marginRight: '10px'
            }} 
          />
          <h1 style={{ margin: 0, display: 'inline-block', verticalAlign: 'middle' }}>
            Luxvira Scents
          </h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <footer style={{ padding: '20px', textAlign: 'center', background: '#f5f5f5', marginTop: '40px' }}>
          <p>© 2026 Luxvira Scents. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}
