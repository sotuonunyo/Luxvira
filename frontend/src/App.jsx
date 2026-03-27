import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { isAdminLoggedIn } from './utils/admin'

// Protected route component
function AdminRoute({ children }) {
  return isAdminLoggedIn() ? children : <Navigate to="/admin" />;
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
        
        <nav style={{ background: '#6d5a43', padding: '10px', textAlign: 'center' }}>
          <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
          <Link to="/products" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Products</Link>
          <Link to="/cart" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Cart</Link>
          <Link to="/contact" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Contact</Link>
          <Link to="/admin/dashboard" style={{ margin: '0 15px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>🛠️ Admin</Link>
        </nav>
        
        <main>
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
        
        <footer style={{ padding: '20px', textAlign: 'center', background: '#f5f5f5', marginTop: '40px' }}>
          <p>© 2026 Luxvira Scents. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}
