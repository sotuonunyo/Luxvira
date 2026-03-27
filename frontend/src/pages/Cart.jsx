import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCartForWhatsApp } from '../utils/whatsapp';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!customerName.trim()) {
      alert('Please enter your name to proceed');
      return;
    }
    
    const whatsappURL = formatCartForWhatsApp(cartItems, customerName);
    window.open(whatsappURL, '_blank');
    
    // Optional: Clear cart after checkout
    // clearCart();
    
    alert('✅ WhatsApp opened! Please send the message to complete your order.');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Arial' }}>
        <h1 style={{ color: '#8B7355' }}>🛒 Your Cart</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', margin: '20px 0' }}>
          Your cart is empty
        </p>
        <Link 
          to="/products" 
          style={{ 
            display: 'inline-block',
            padding: '12px 30px',
            background: '#8B7355',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#8B7355', textAlign: 'center' }}>🛒 Your Cart</h1>
      
      {/* Cart Items */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {cartItems.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            gap: '15px',
            padding: '15px 0',
            borderBottom: '1px solid #eee',
            alignItems: 'center'
          }}>
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '8px',
                background: '#f9f9f9'
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px', fontSize: '1.1rem' }}>{item.name}</h3>
              <p style={{ margin: '0 0 10px', color: '#8B7355', fontWeight: 'bold' }}>
                ₦{item.price.toLocaleString()}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    border: '1px solid #ddd',
                    background: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  −
                </button>
                <span style={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    border: '1px solid #ddd',
                    background: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    marginLeft: 'auto',
                    padding: '6px 12px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontWeight: 'bold', minWidth: '100px' }}>
              ₦{(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div style={{ background: '#FFF9F5', borderRadius: '12px', padding: '25px', marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>Subtotal:</span>
          <span>₦{cartTotal.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem', color: '#666' }}>
          <span>Delivery:</span>
          <span>Calculated on WhatsApp</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          paddingTop: '15px', 
          borderTop: '2px solid #8B7355',
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: '#8B7355'
        }}>
          <span>Total:</span>
          <span>₦{cartTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Customer Info & Checkout */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Your Name (for order confirmation) *
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter your full name"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            marginBottom: '20px',
            boxSizing: 'border-box'
          }}
        />
        
        <button
          onClick={handleCheckout}
          disabled={!customerName.trim()}
          style={{
            width: '100%',
            padding: '16px',
            background: customerName.trim() ? '#25D366' : '#aaa',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: customerName.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'background 0.2s'
          }}
        >
          💬 Complete Order on WhatsApp
        </button>
        
        <p style={{ 
          fontSize: '0.85rem', 
          color: '#666', 
          textAlign: 'center', 
          marginTop: '15px' 
        }}>
          🔒 Your order details will be sent securely to Luxvira Scents via WhatsApp
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/products" style={{ color: '#8B7355', textDecoration: 'none' }}>
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
