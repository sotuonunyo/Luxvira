import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    console.log('🎯 Products page mounting');
    
    // Load from localStorage (admin-added) or use samples
    const saved = localStorage.getItem('luxvira_products');
    if (saved) {
      const adminProducts = JSON.parse(saved);
      console.log('📦 Loaded admin products:', adminProducts.length);
      setProducts(adminProducts.filter(p => p.isPublished !== false));
    } else {
      console.log('📦 No admin products, using samples');
      setProducts([
        { id: 1, name: 'Lavender Diffuser', category: 'diffusers', price: 4500, image: 'https://via.placeholder.com/300/8B7355/FFFFFF?text=Lavender', description: 'Calming lavender scent', isPublished: true },
        { id: 2, name: 'Vanilla Candle', category: 'candles', price: 3200, image: 'https://via.placeholder.com/300/F5E6D3/333333?text=Vanilla', description: 'Pure vanilla essence', isPublished: true }
      ]);
    }
  }, []);

  return (
    <div style={{padding:'20px',maxWidth:'1200px',margin:'0 auto',fontFamily:'Arial'}}>
      <h1 style={{color:'#8B7355',textAlign:'center'}}>🛍️ Products ({products.length})</h1>
      
      {products.length === 0 ? (
        <p style={{textAlign:'center',color:'#666',padding:'40px'}}>No products yet. <Link to="/admin">Add some!</Link></p>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'20px'}}>
          {products.map(p => (
            <div key={p.id} style={{background:'white',borderRadius:'12px',overflow:'hidden',boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}>
              <img src={p.image} alt={p.name} style={{width:'100%',height:'200px',objectFit:'cover',background:'#f9f9f9'}} />
              <div style={{padding:'15px'}}>
                <h3 style={{margin:'0 0 5px'}}>{p.name}</h3>
                <p style={{margin:'0 0 10px',color:'#666',fontSize:'0.9rem'}}>{p.description}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontWeight:'bold',color:'#8B7355'}}>₦{p.price?.toLocaleString()}</span>
                  <button onClick={() => { addToCart(p); alert('✅ Added!'); }} style={{padding:'8px 16px',background:'#8B7355',color:'white',border:'none',borderRadius:'6px',cursor:'pointer'}}>Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {cartCount > 0 && (
        <div style={{position:'fixed',bottom:'20px',right:'20px',background:'#8B7355',color:'white',padding:'15px 20px',borderRadius:'10px',boxShadow:'0 4px 20px rgba(0,0,0,0.2)'}}>
          🛒 {cartCount} item(s) • <Link to="/cart" style={{color:'white'}}>View</Link>
        </div>
      )}
      
      <div style={{textAlign:'center',marginTop:'30px'}}><Link to="/" style={{color:'#8B7355'}}>← Home</Link></div>
    </div>
  );
}
