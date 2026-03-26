import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const styles = {
    container: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '14px 20px',
      borderRadius: '10px',
      color: 'white',
      fontWeight: '500',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      zIndex: 1000,
      maxWidth: '350px',
      animation: 'slideIn 0.3s ease-out',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    success: { background: '#4CAF50' },
    error: { background: '#f44336' }
  };

  const icons = { success: '✅', error: '❌' };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div style={{ ...styles.container, ...styles[type] }}>
        <span style={{ fontSize: '1.2rem' }}>{icons[type]}</span>
        <span>{message}</span>
      </div>
    </>
  );
}
