import { useEffect } from 'react';
import { X, AlertCircle, Info, CheckCircle } from 'lucide-react';

export default function Toast({ visible, message, type = 'info', onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const config = {
    info: { bg: '#f0f4ff', border: '#bfdbfe', icon: <Info size={18} />, color: '#1a2e5a' },
    success: { bg: '#d1fae5', border: '#6ee7b7', icon: <CheckCircle size={18} />, color: '#059669' },
    warning: { bg: '#fef3c7', border: '#fcd34d', icon: <AlertCircle size={18} />, color: '#d97706' },
    error: { bg: '#fee2e2', border: '#fecaca', icon: <AlertCircle size={18} />, color: '#dc2626' },
  };

  const c = config[type] || config.info;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: c.bg,
      border: `1.5px solid ${c.border}`,
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxWidth: '380px',
      animation: 'slideIn 0.3s ease',
    }}>
      <div style={{ color: c.color }}>{c.icon}</div>
      <span style={{ color: c.color, fontWeight: '500', fontSize: '0.9rem', flex: 1 }}>{message}</span>
      <button 
        onClick={onClose}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: c.color,
          display: 'flex',
          alignItems: 'center',
          padding: '4px'
        }}>
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}