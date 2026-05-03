import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [form, setForm] = useState({ student_id: 'admin', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Admin logs in with email — we send email as student_id workaround
      // Actually call a dedicated admin login endpoint
      const res = await fetch('https://qcu-coop-api.onrender.com/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      login(data.token, data.user);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2e5a 100%)', padding: '20px',
    }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ background: '#1a2e5a', padding: '32px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(245,197,24,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Shield size={28} style={{ color: '#f5c518' }} />
          </div>
          <h1 style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', margin: 0 }}>Administration</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '6px' }}>QCU Cooperative Staff Only</p>
        </div>

        <div style={{ padding: '32px' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '0.875rem' }}>
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '6px' }}>Email Address</label>
              <input type="email" placeholder="admin@email.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter password" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: loading ? '#9ca3af' : '#1a2e5a', color: 'white', fontWeight: '700', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>
          <button onClick={() => navigate('/')}
            style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', color: '#6b7280', fontWeight: '600' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}