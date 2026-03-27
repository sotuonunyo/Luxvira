import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { isAdminLoggedIn } from './utils/admin'

// Protected route - ONLY for admin pages
function AdminRoute({ children }) {
  return isAdminLoggedIn() ? children : <Navigate to="/admin" />;
}

// Simple footer with hidden admin link
function Footer() {
  return (
    <footer style={{ 
      padding: '20px', textAlign: 'center', background: '#f5f5f5', marginTop: '40px',
      fontSize: '0.9rem', color: '#666'
    }}>
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} Luxvira Scents. All rights reserved.
        {/* Hidden admin trigger - click the 🔐 */}
        <a href="/admin" style={{ 
          marginLeft: '8px', color: '#999', textDecoration: 'none', opacity: 0.6,
          transition: 'opacity 0.2s'
        }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.6'}>
          🔐
        </a>
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', fontFamily: 'Arial', display: 'flex', flexDirection: 'column' }}>
        {/* Header - NO auth check here */}
        <header style={{ padding: '20px', background: '#8B7355', color: 'white', textAlign: 'center' }}>
          <img src="/logo.png" alt="Luxvira Scents Logo" style={{ 
            width: '80px', height: '80px', objectFit: 'contain',
            verticalAlign: 'middle', marginRight: '10px'
          }} />
          <h1 style={{ margin: 0, display: 'inline-block', verticalAlign: 'middle' }}>Luxvira Scents</h1>
        </header>
        
        {/* Navigation - NO auth check here */}
        <nav style={{ background: '#6d5a43', padding: '10px', textAlign: 'center' }}>
          <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
          <Link to="/products" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Products</Link>
          <Link to="/cart" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Cart</Link>
          <Link to="/contact" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Contact</Link>
        </nav>
        
        {/* Main Content - Routes load normally, auth only checked on admin routes */}
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public routes - NO auth required */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin routes - auth required */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  )
}
