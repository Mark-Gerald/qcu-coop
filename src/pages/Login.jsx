import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ student_id: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Auto-format Student ID: insert hyphen after 2 digits
  const handleStudentId = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, ''); // digits only
    if (val.length > 6) val = val.slice(0, 6);
    if (val.length > 2) val = val.slice(0, 2) + '-' + val.slice(2);
    setForm({ ...form, student_id: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/shop');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2e5a 60%, #2d4a8a 100%)',
      padding: '20px'
    }}>

      <div style={{
        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '460px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
      }}>
        {/* Top Banner */}
        <div style={{ background: '#1a2e5a', padding: '32px 36px 24px', textAlign: 'center' }}>
          <img src="/qcu_logo.png" alt="QCU Logo"
            style={{height: '64px', width: '64px', border: '3px solid rgba(245,197,24,0.5)'}}
            className="h-10 w-10 rounded-full object-cover"
            onError={e => { e.target.style.display = 'none'; }} />
          <h1 style={{ color: 'white', fontWeight: '800', fontSize: '1.4rem', margin: 0 }}>QCU Cooperative Store</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>Quezon City University</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          {['Sign In', 'Register'].map((tab, i) => (
            <button key={tab}
              onClick={() => i === 1 && navigate('/register')}
              style={{
                flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontWeight: '600',
                fontSize: '0.95rem', transition: 'all 0.2s',
                background: i === 0 ? 'white' : '#f8f9fa',
                color: i === 0 ? '#1a2e5a' : '#9ca3af',
                borderBottom: i === 0 ? '2px solid #1a2e5a' : '2px solid transparent',
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding: '32px 36px' }}>
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px',
              padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '0.875rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Student ID */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '6px' }}>
                Student ID
              </label>
              <input
                placeholder="25-0169"
                value={form.student_id}
                onChange={handleStudentId}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: '1.5px solid #e5e7eb', fontSize: '1rem', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'monospace', letterSpacing: '2px',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '4px' }}>
                Format: YY-NNNN (e.g. 25-0169)
              </p>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '12px 44px 12px 16px', borderRadius: '10px',
                    border: '1.5px solid #e5e7eb', fontSize: '1rem', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0,
                  }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
                background: loading ? '#9ca3af' : '#1a2e5a', color: 'white', fontWeight: '700',
                fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background 0.2s',
              }}>
              <LogIn size={18} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '4px', paddingTop: '12px', paddingBottom: '8px' }}>
              <button onClick={() => navigate('/')}
                style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                  ← Back to Home
              </button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1a2e5a', fontWeight: '700', textDecoration: 'none' }}>
              Register here
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', paddingBottom: '20px', color: '#9ca3af', fontSize: '0.75rem' }}>
          © 2026 QCU Cooperative
        </p>
      </div>
    </div>
  );
}