import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFading(true), 1200);
    const timer2 = setTimeout(() => setVisible(false), 1700);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#1a2e5a',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.5s ease',
      pointerEvents: fading ? 'none' : 'all',
    }}>
      <img src="/qcu_logo.png" alt="QCU"
        style={{ width: '120px', height: '80px', borderRadius: '50%', marginBottom: '20px', animation: 'pulse 1s ease infinite' }}
        onError={e => { e.target.style.display = 'none'; }} />
      <h2 style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', margin: '0 0 8px' }}>QCU Cooperative</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 24px' }}>Loading your store...</p>
      <div style={{ width: '120px', height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#f5c518', borderRadius: '3px', animation: 'load 1.2s ease forwards' }} />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes load {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}