import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ message, visible, onHide }) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 2500);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
      background: '#1a2e5a', color: 'white', borderRadius: '12px',
      padding: '14px 18px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      display: 'flex', alignItems: 'center', gap: '10px',
      transform: visible ? 'translateY(0)' : 'translateY(80px)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease',
      maxWidth: '300px',
      pointerEvents: 'none',
    }}>
      <CheckCircle size={18} style={{ color: '#f5c518', flexShrink: 0 }} />
      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{message}</span>
    </div>
  );
}