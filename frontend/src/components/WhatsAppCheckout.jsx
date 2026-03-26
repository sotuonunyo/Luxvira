// WhatsApp checkout component
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { generateWhatsAppURL } from '../utils/whatsapp';

export default function WhatsAppCheckout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    const whatsappURL = generateWhatsAppURL(cartItems, customerInfo);
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Optional: Clear cart after checkout
    // clearCart();
  };
  
  return (
    <div className="whatsapp-checkout">
      <h3>📱 Checkout via WhatsApp</h3>
      
      <div className="customer-form">
        <input
          type="text"
          placeholder="Your Name *"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
        />
        <input
          type="tel"
          placeholder="Phone *"
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
          required
        />
        <textarea
          placeholder="Delivery Address"
          value={customerInfo.address}
          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
          rows="3"
        />
      </div>
      
      <div className="cart-summary">
        <p><strong>Items:</strong> {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
        <p><strong>Total:</strong> ${cartTotal.toFixed(2)}</p>
      </div>
      
      <button 
        className="btn-whatsapp"
        onClick={handleCheckout}
        disabled={cartItems.length === 0 || !customerInfo.name || !customerInfo.phone}
      >
        💬 Complete Order on WhatsApp
      </button>
      
      <p className="checkout-note">
        <small>You'll be redirected to WhatsApp to finalize your order with Luxvira Scents.</small>
      </p>
    </div>
  );
}
