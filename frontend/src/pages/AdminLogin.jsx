import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../utils/admin';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = loginAdmin(password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      fontFamily: 'Arial'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img 
            src="/logo.png" 
            alt="Luxvira Scents" 
            style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '15px' }}
          />
          <h2 style={{ color: '#8B7355', margin: 0 }}>🛠️ Admin Login</h2>
          <p style={{ color: '#666', margin: '10px 0 0' }}>Manage your products</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '12px', 
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              background: loading ? '#aaa' : '#8B7355',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Logging in...' : '🔐 Login to Admin Panel'}
          </button>
        </form>

        <p style={{ 
          textAlign: 'center', 
          color: '#888', 
          fontSize: '0.85rem', 
          marginTop: '25px' 
        }}>
          🔒 Secure admin access • Change password in code
        </p>
      </div>
    </div>
  );
}
