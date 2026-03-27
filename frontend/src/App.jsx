import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { isAdminLoggedIn, subscribeToAuth } from './utils/admin'

// Protected route component
function AdminRoute({ children }) {
  return isAdminLoggedIn() ? children : <Navigate to="/admin" />;
}

// Footer component with hidden admin link in ©
function Footer() {
  const navigate = useNavigate();
  
  const handleCopyrightClick = () => {
    // Hidden admin access: click © 3 times quickly
    // Or just navigate directly for now (you can add click counter later)
    navigate('/admin');
  };

  return (
    <footer style={{ 
      padding: '20px', 
      textAlign: 'center', 
      background: '#f5f5f5', 
      marginTop: '40px',
      fontSize: '0.9rem',
      color: '#666'
    }}>
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} Luxvira Scents. All rights reserved.
        {/* Hidden admin trigger - styled to look normal */}
        <span 
          onClick={handleCopyrightClick}
          style={{ 
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s',
            marginLeft: '5px'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
          title="Admin access"
        >
          🔐
        </span>
      </p>
      <p style={{ margin: '8px 0 0', fontSize: '0.8rem' }}>
        Handcrafted with love in Nigeria 🇳🇬
      </p>
    </footer>
  );
}

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);

  // Subscribe to auth changes globally
  useEffect(() => {
    const unsubscribe = subscribeToAuth(() => {
      setAuthChecked(true);
    });
    
    // Initial check
    setAuthChecked(true);
    
    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Arial',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', fontFamily: 'Arial', display: 'flex', flexDirection: 'column' }}>
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
        
        <nav style={{ background: '#6d5a43', padding: '10px', textAlign: 'center' }}>
          <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
          <Link to="/products" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Products</Link>
          <Link to="/cart" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Cart</Link>
          <Link to="/contact" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Contact</Link>
          {/* Admin link REMOVED from nav - now hidden in footer © */}
        </nav>
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  )
}
