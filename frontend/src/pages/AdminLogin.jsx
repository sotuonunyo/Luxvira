import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, subscribeToAuth } from '../utils/admin';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const unsubscribe = subscribeToAuth((authState) => {
      setCheckingAuth(false);
      if (authState.loggedIn) {
        navigate('/admin/dashboard');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    const result = await loginAdmin();
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  if (checkingAuth) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center', 
        fontFamily: 'Arial',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #8B7355', 
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666' }}>Checking authentication...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center'
      }}>
        <img 
          src="/logo.png" 
          alt="Luxvira Scents" 
          style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '20px' }}
        />
        
        <h2 style={{ color: '#8B7355', margin: '0 0 10px' }}>🔐 Admin Access</h2>
        <p style={{ color: '#666', margin: '0 0 25px', fontSize: '0.95rem' }}>
          Sign in with your authorized Google account to manage products
        </p>

        {error && (
          <div style={{ 
            background: '#ffebee', 
            color: '#c62828', 
            padding: '12px 15px', 
            borderRadius: '8px',
            fontSize: '0.9rem',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            padding: '14px 20px',
            background: loading ? '#f5f5f5' : 'white',
            color: loading ? '#999' : '#333',
            border: '2px solid #ddd',
            borderRadius: '10px',
            fontWeight: '500',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.borderColor = '#8B7355';
              e.target.style.boxShadow = '0 4px 12px rgba(139,115,85,0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.borderColor = '#ddd';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {loading ? (
            <>
              <span style={{ 
                width: '20px', 
                height: '20px', 
                border: '2px solid #8B7355', 
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
              Signing in...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <div style={{ 
          marginTop: '25px', 
          padding: '15px', 
          background: '#FFF9F5', 
          borderRadius: '10px',
          fontSize: '0.85rem',
          color: '#666',
          textAlign: 'left'
        }}>
          <strong>🔒 Authorized accounts only:</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
            <li>luxvirascents@gmail.com</li>
            <li>s.otuonunyo@gmail.com</li>
          </ul>
        </div>

        <p style={{ 
          color: '#999', 
          fontSize: '0.8rem', 
          marginTop: '20px' 
        }}>
          Powered by Firebase Authentication • Secure & encrypted
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
