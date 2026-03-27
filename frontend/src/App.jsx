import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Home Page
const Home = () => (
  <div style={{padding:'40px',textAlign:'center'}}>
    <h1>🕯️ Luxvira Scents</h1>
    <p>Welcome!</p>
    <Link to="/products" style={{display:'inline-block',marginTop:'20px',padding:'12px 30px',background:'#8B7355',color:'white',textDecoration:'none',borderRadius:'8px'}}>View Products</Link>
  </div>
);

// Products Page
const Products = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('luxvira_products');
    if (saved) {
      const adminProducts = JSON.parse(saved);
      setProducts(adminProducts.filter(p => p.isPublished !== false));
    } else {
      // Sample products
      setProducts([
        { id: 1, name: 'Lavender Diffuser', category: 'diffusers', price: 4500, image: 'https://via.placeholder.com/300/8B7355/FFFFFF?text=Lavender', description: 'Calming lavender scent', isPublished: true },
        { id: 2, name: 'Vanilla Candle', category: 'candles', price: 3200, image: 'https://via.placeholder.com/300/F5E6D3/333333?text=Vanilla', description: 'Pure vanilla essence', isPublished: true }
      ]);
    }
  }, []);

  return (
    <div style={{padding:'20px',maxWidth:'1200px',margin:'0 auto'}}>
      <h1 style={{color:'#8B7355',textAlign:'center'}}>🛍️ Products ({products.length})</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'20px'}}>
        {products.map(p => (
          <div key={p.id} style={{background:'white',borderRadius:'12px',overflow:'hidden',boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}>
            <img src={p.image} alt={p.name} style={{width:'100%',height:'200px',objectFit:'cover'}} />
            <div style={{padding:'15px'}}>
              <h3>{p.name}</h3>
              <p style={{color:'#666',fontSize:'0.9rem'}}>{p.description}</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'10px'}}>
                <span style={{fontWeight:'bold',color:'#8B7355'}}>₦{p.price?.toLocaleString()}</span>
                <button style={{padding:'8px 16px',background:'#8B7355',color:'white',border:'none',borderRadius:'6px',cursor:'pointer'}}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{textAlign:'center',marginTop:'30px'}}><Link to="/" style={{color:'#8B7355'}}>← Home</Link></div>
    </div>
  );
};

// Cart Page
const Cart = () => <div style={{padding:'40px',textAlign:'center'}}><h1>🛒 Cart</h1><p>Empty</p><Link to="/">← Home</Link></div>;

// Contact Page
const Contact = () => <div style={{padding:'40px',textAlign:'center'}}><h1>📬 Contact</h1><p>WhatsApp: +234 803 799 1435</p><Link to="/">← Home</Link></div>;

// Admin Login Page
const AdminLogin = () => {
  const handleLogin = () => {
    const email = prompt('Enter authorized email:');
    if (email === 'luxvirascents@gmail.com' || email === 's.otuonunyo@gmail.com') {
      localStorage.setItem('luxvira_admin', 'true');
      window.location.href = '/admin/dashboard';
    } else {
      alert('❌ Access denied');
    }
  };

  return (
    <div style={{padding:'60px 20px',textAlign:'center'}}>
      <h1>🔐 Admin Login</h1>
      <p>Authorized accounts only</p>
      <button onClick={handleLogin} style={{padding:'14px 30px',background:'#8B7355',color:'white',border:'none',borderRadius:'10px',cursor:'pointer',fontSize:'1rem',marginTop:'20px'}}>Sign In</button>
      <p style={{marginTop:'20px',color:'#666'}}>luxvirascents@gmail.com • s.otuonunyo@gmail.com</p>
    </div>
  );
};

// Admin Dashboard Page - MUST be exported properly!
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Check auth
    if (!localStorage.getItem('luxvira_admin')) {
      window.location.href = '/admin';
      return;
    }
    
    // Load products
    const saved = localStorage.getItem('luxvira_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const form = e.target;
    const product = {
      id: Date.now(),
      name: form.name.value,
      category: form.category.value,
      price: parseFloat(form.price.value),
      image: form.image.value,
      description: form.description.value,
      isPublished: true,
      createdAt: new Date().toISOString()
    };
    
    const updated = [...products, product];
    localStorage.setItem('luxvira_products', JSON.stringify(updated));
    setProducts(updated);
    alert('✅ Product added!');
    form.reset();
  };

  const togglePublish = (id) => {
    const updated = products.map(p => 
      p.id === id ? {...p, isPublished: !p.isPublished} : p
    );
    localStorage.setItem('luxvira_products', JSON.stringify(updated));
    setProducts(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem('luxvira_admin');
    window.location.href = '/';
  };

  return (
    <div style={{padding:'20px',maxWidth:'800px',margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h1>🛠️ Admin Dashboard</h1>
        <button onClick={handleLogout} style={{padding:'8px 16px',background:'#f44336',color:'white',border:'none',borderRadius:'6px',cursor:'pointer'}}>Logout</button>
      </div>
      
      <div style={{background:'#FFF9F5',padding:'20px',borderRadius:'12px',marginBottom:'20px'}}>
        <h3>➕ Add Product</h3>
        <form onSubmit={handleAddProduct} style={{display:'grid',gap:'12px'}}>
          <input name="name" placeholder="Product name *" required style={{padding:'10px',borderRadius:'6px',border:'1px solid #ddd'}} />
          <select name="category" style={{padding:'10px',borderRadius:'6px',border:'1px solid #ddd'}}>
            <option value="diffusers">Diffusers</option>
            <option value="candles">Candles</option>
            <option value="gypsum">Gypsum</option>
            <option value="decor">Decor</option>
          </select>
          <input name="price" type="number" placeholder="Price (₦) *" required style={{padding:'10px',borderRadius:'6px',border:'1px solid #ddd'}} />
          <input name="image" type="url" placeholder="Image URL *" required style={{padding:'10px',borderRadius:'6px',border:'1px solid #ddd'}} />
          <textarea name="description" placeholder="Description" rows="2" style={{padding:'10px',borderRadius:'6px',border:'1px solid #ddd'}} />
          <button type="submit" style={{padding:'12px',background:'#4CAF50',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}>Add Product</button>
        </form>
      </div>
      
      <div>
        <h3>📦 Products ({products.length})</h3>
        <div style={{display:'grid',gap:'10px'}}>
          {products.map(p => (
            <div key={p.id} style={{padding:'12px',background:'white',borderRadius:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <strong>{p.name}</strong><br/>
                <small>₦{p.price?.toLocaleString()} • {p.category}</small>
              </div>
              <button onClick={() => togglePublish(p.id)} style={{padding:'6px 12px',background:p.isPublished?'#4CAF50':'#f44336',color:'white',border:'none',borderRadius:'6px',cursor:'pointer'}}>
                {p.isPublished?'✅ Published':'⏸️ Unpublished'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{textAlign:'center',marginTop:'30px'}}><Link to="/" style={{color:'#8B7355'}}>← Back to Store</Link></div>
    </div>
  );
};

// Footer Component
const Footer = () => (
  <footer style={{padding:'20px',textAlign:'center',background:'#f5f5f5',marginTop:'40px',fontSize:'0.9rem',color:'#666'}}>
    <p style={{margin:0}}>
      © {new Date().getFullYear()} Luxvira Scents. All rights reserved.
      <Link to="/admin" style={{marginLeft:'8px',color:'#999',textDecoration:'none',opacity:0.6}}>🔐</Link>
    </p>
  </footer>
);

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <div style={{minHeight:'100vh',fontFamily:'Arial',display:'flex',flexDirection:'column'}}>
        <header style={{padding:'20px',background:'#8B7355',color:'white',textAlign:'center'}}>
          <img src="/logo.png" alt="Logo" style={{width:'80px',height:'80px',objectFit:'contain',verticalAlign:'middle',marginRight:'10px'}} />
          <h1 style={{margin:0,display:'inline-block',verticalAlign:'middle'}}>Luxvira Scents</h1>
        </header>
        
        <nav style={{background:'#6d5a43',padding:'10px',textAlign:'center'}}>
          <Link to="/" style={{margin:'0 15px',color:'white',textDecoration:'none',fontWeight:'500'}}>Home</Link>
          <Link to="/products" style={{margin:'0 15px',color:'white',textDecoration:'none',fontWeight:'500'}}>Products</Link>
          <Link to="/cart" style={{margin:'0 15px',color:'white',textDecoration:'none',fontWeight:'500'}}>Cart</Link>
          <Link to="/contact" style={{margin:'0 15px',color:'white',textDecoration:'none',fontWeight:'500'}}>Contact</Link>
        </nav>
        
        <main style={{flex:1}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  )
}
