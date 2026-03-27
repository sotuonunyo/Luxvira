import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

// Simple pages (inline for reliability)
const Home = () => <div style={{padding:'40px',textAlign:'center'}}><h1>🕯️ Luxvira Scents</h1><p>Welcome!</p><Link to="/products">View Products</Link></div>;

const Products = () => {
  useEffect(() => { console.log('🎯 Products page loaded') }, []);
  return <div style={{padding:'40px',textAlign:'center'}}><h1>🛍️ Products</h1><p>Loading products...</p><Link to="/">← Home</Link></div>;
};

const Cart = () => <div style={{padding:'40px',textAlign:'center'}}><h1>🛒 Cart</h1><p>Empty</p><Link to="/">← Home</Link></div>;

const Contact = () => <div style={{padding:'40px',textAlign:'center'}}><h1>📬 Contact</h1><p>WhatsApp: +234 803 799 1435</p><Link to="/">← Home</Link></div>;

const AdminLogin = () => {
  useEffect(() => { console.log('🎯 AdminLogin page loaded') }, []);
  return (
    <div style={{padding:'60px 20px',textAlign:'center',fontFamily:'Arial'}}>
      <h1>🔐 Admin Login</h1>
      <p>Authorized accounts only</p>
      <button onClick={() => {
        console.log('🔑 Login clicked');
        // Simple test auth - replace with Firebase later
        const email = prompt('Enter authorized email:');
        if (email === 'luxvirascents@gmail.com' || email === 's.otuonunyo@gmail.com') {
          localStorage.setItem('luxvira_admin', 'true');
          window.location.href = '/admin/dashboard';
        } else {
          alert('❌ Access denied');
        }
      }} style={{padding:'14px 30px',background:'#8B7355',color:'white',border:'none',borderRadius:'10px',cursor:'pointer',fontSize:'1rem'}}>
        Sign In
      </button>
      <p style={{marginTop:'20px',fontSize:'0.9rem',color:'#666'}}>
        Authorized: luxvirascents@gmail.com • s.otuonunyo@gmail.com
      </p>
    </div>
  );
};

const AdminDashboard = () => {
  useEffect(() => {
    console.log('🎯 AdminDashboard loaded');
    if (!localStorage.getItem('luxvira_admin')) {
      console.log('❌ Not authenticated, redirecting');
      window.location.href = '/admin';
    }
  }, []);
  
  return (
    <div style={{padding:'20px',maxWidth:'800px',margin:'0 auto',fontFamily:'Arial'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h1>🛠️ Admin Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('luxvira_admin'); window.location.href='/'; }} style={{padding:'8px 16px',background:'#f44336',color:'white',border:'none',borderRadius:'6px',cursor:'pointer'}}>Logout</button>
      </div>
      
      {/* Add Product Form */}
      <div style={{background:'#FFF9F5',padding:'20px',borderRadius:'12px',marginBottom:'20px'}}>
        <h3>➕ Add Product</h3>
        <form onSubmit={(e) => {
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
          const products = JSON.parse(localStorage.getItem('luxvira_products') || '[]');
          products.push(product);
          localStorage.setItem('luxvira_products', JSON.stringify(products));
          console.log('✅ Product saved:', product);
          alert('✅ Product added! Check /products page');
          form.reset();
        }} style={{display:'grid',gap:'12px'}}>
          <input name="name" placeholder="Product name *" required style={{padding:'10px',borderRadius:'6px',border:'1px solid #ddd'}} />
          <select name="category" style={{padding:'10px',borderRadius:'6px',border:'1px solid #ddd'}}>
            <option value="diffusers">Diffusers</option>
            <option value="candles">Candles</option>
            <option value="gypsum">Gypsum</option>
            <option value="decor">Decor</option>
          </select>
          <input name="price" type="number" placeholder="Price (₦) *" required style={{padding:'10px',borderRadius:'6px',border:'1px solid #ddd'}} />
          <input name="image" type="url" placeholder="Image URL (Cloudinary) *" required style={{padding:'10px',borderRadius:'6px',border:'1px solid #ddd'}} />
          <textarea name="description" placeholder="Description" rows="2" style={{padding:'10px',borderRadius:'6px',border:'1px solid #ddd'}} />
          <button type="submit" style={{padding:'12px',background:'#4CAF50',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}>Add Product</button>
        </form>
      </div>
      
      {/* Product List */}
      <div>
        <h3>📦 Products ({JSON.parse(localStorage.getItem('luxvira_products')||'[]').length})</h3>
        <div id="product-list" style={{display:'grid',gap:'10px'}}></div>
      </div>
      
      <script dangerouslySetInnerHTML={{__html: `
        // Load products into list
        function loadProducts() {
          const list = document.getElementById('product-list');
          const products = JSON.parse(localStorage.getItem('luxvira_products') || '[]');
          list.innerHTML = products.map(p => \`
            <div style="padding:12px;background:white;border-radius:8px;display:flex;justify-content:space-between;align-items:center">
              <div>
                <strong>\${p.name}</strong><br/>
                <small>₦\${p.price?.toLocaleString()} • \${p.category}</small>
              </div>
              <button onclick="togglePublish(\${p.id})" style="padding:6px 12px;background:\${p.isPublished?'#4CAF50':'#f44336'};color:white;border:none;borderRadius:6px;cursor:pointer">
                \${p.isPublished?'✅ Published':'⏸️ Unpublished'}
              </button>
            </div>
          \`).join('') || '<p style="color:#666">No products yet</p>';
        }
        function togglePublish(id) {
          const products = JSON.parse(localStorage.getItem('luxvira_products') || '[]');
          const p = products.find(x => x.id === id);
          if (p) { p.isPublished = !p.isPublished; localStorage.setItem('luxvira_products', JSON.stringify(products)); loadProducts(); }
        }
        loadProducts();
      `}} />
      
      <div style={{textAlign:'center',marginTop:'30px'}}><Link to="/" style={{color:'#8B7355'}}>← Back to Store</Link></div>
    </div>
  );
};

// Footer with WORKING admin link
const Footer = () => (
  <footer style={{padding:'20px',textAlign:'center',background:'#f5f5f5',marginTop:'40px',fontSize:'0.9rem',color:'#666'}}>
    <p style={{margin:0}}>
      © {new Date().getFullYear()} Luxvira Scents. All rights reserved.
      {/* ✅ This Link WILL work */}
      <Link to="/admin" style={{marginLeft:'8px',color:'#999',textDecoration:'none',opacity:0.6}} onMouseEnter={(e)=>e.target.style.opacity='1'} onMouseLeave={(e)=>e.target.style.opacity='0.6'}>🔐</Link>
    </p>
  </footer>
);

// Main App
export default function App() {
  useEffect(() => {
    console.log('🎯 Luxvira App initialized');
    console.log('📦 localStorage keys:', Object.keys(localStorage));
  }, []);

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
