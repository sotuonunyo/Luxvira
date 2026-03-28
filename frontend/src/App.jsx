import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { isAdminLoggedIn } from './utils/admin'

function AdminRoute({ children }) {
  return isAdminLoggedIn() ? children : <Navigate to="/admin" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', fontFamily: 'Arial' }}>
        
        {/* ===== HEADER WITH LOGO LEFT ===== */}
        <header style={{ 
          padding: '15px 30px', 
          background: '#8B7355', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            textDecoration: 'none',
            color: 'white'
          }}>
            <img
              src="/logo.png"
              alt="Luxvira Logo"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain'
              }}
            />
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>
              Luxvira
            </h1>
          </Link>
        </header>

        {/* ===== SLIDING MARQUEE TEXT ===== */}
        <div style={{
          background: '#F5E6D3',
          padding: '12px 0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          borderBottom: '1px solid #ddd'
        }}>
          <div style={{
            display: 'inline-block',
            paddingLeft: '100%',
            animation: 'slide 20s linear infinite'
          }}>
            <span style={{
              color: '#666',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              ✨ Welcome to Luxvira Scents — Handcrafted diffusers, scented candles, gypsum crafts & interior decor — Made with love in Nigeria ✨
            </span>
          </div>
          <style>{`
            @keyframes slide {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
        </div>

        {/* ===== NAVIGATION ===== */}
        <nav style={{ 
          background: '#6d5a43', 
          padding: '12px 30px',
          display: 'flex',
          justifyContent: 'center',
          gap: '40px'
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>Home</Link>
          <Link to="/products" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>Products</Link>
          <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>Cart</Link>
          <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>Contact Us</Link>
        </nav>

        {/* ===== MAIN CONTENT ===== */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
          </Routes>
        </main>

        {/* ===== FOOTER ===== */}
        <footer style={{ 
          padding: '25px', 
          textAlign: 'center', 
          background: '#f5f5f5',
          borderTop: '1px solid #ddd'
        }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
            <Link to="/admin" style={{ color: '#999', textDecoration: 'none', opacity: 0.6 }}>🔐</Link>
            {' '}© 2026 Luxvira Scents. All rights reserved.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}
