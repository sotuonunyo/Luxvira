import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatWhatsAppMessage } from '../utils/whatsapp';
import Toast from '../components/Toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const whatsappURL = formatWhatsAppMessage(formData);
      window.open(whatsappURL, '_blank');
      
      setToast({ 
        type: 'success', 
        message: '✅ WhatsApp opened! Please send the message to complete.' 
      });
      
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', type: '', message: '' });
      }, 3000);

    } catch (error) {
      setToast({ 
        type: 'error', 
        message: '⚠️ Could not open WhatsApp. Please message us at +234 803 799 1435' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <h1 style={{ color: '#8B7355', textAlign: 'center' }}>📬 Contact Us</h1>
      
      <div style={{ padding: '30px', background: '#FFF9F5', borderRadius: '12px', margin: '30px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <p style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>
          <strong>💬 Your message will open directly in WhatsApp</strong>
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Your Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Your Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone (optional)</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="For faster reply"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Inquiry Type</label>
            <select name="type" value={formData.type} onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', background: 'white' }}>
              <option value="">Select Type</option>
              <option value="order">📦 Order Question</option>
              <option value="product">🕯️ Product Info</option>
              <option value="feedback">💬 Feedback</option>
              <option value="newsletter">📰 Join Newsletter</option>
              <option value="complaint">⚠️ Complaint</option>
              <option value="other">✨ Other</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Your Message *</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" 
              placeholder="How can we help you today?"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}></textarea>
          </div>
          
          <button type="submit" disabled={loading}
            style={{ padding: '14px', background: loading ? '#aaa' : '#8B7355', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? 'Opening WhatsApp... 🔄' : '💬 Send via WhatsApp'}
          </button>
          
          <p style={{ fontSize: '0.85rem', color: '#666', textAlign: 'center', marginTop: '10px' }}>
            🔒 Your info is secure • We reply within 24 hours
          </p>
        </form>
      </div>
      
      <div style={{ textAlign: 'center', color: '#666', lineHeight: '2', padding: '25px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginTop: '30px' }}>
        <h3 style={{ color: '#8B7355', marginBottom: '15px' }}>🏢 Luxvira Scents</h3>
        <p><strong>📱 WhatsApp:</strong> <a href="https://wa.me/2348037991435" style={{ color: '#25D366', textDecoration: 'none' }}>+234 803 799 1435</a></p>
        <p><strong>📧 Email:</strong> <a href="mailto:luxvirascents@gmail.com" style={{ color: '#8B7355' }}>luxvirascents@gmail.com</a></p>
        <p><strong>🕒 Business Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM (WAT)</p>
        <p><strong>📍 Location:</strong> Nigeria</p>
        <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#888' }}>Handcrafted with love • Premium Home Fragrance & Decor</p>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/" style={{ color: '#8B7355', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Home</Link>
      </div>
    </div>
  );
}
