import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

// Password strength checker
function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Weak', color: '#ef4444' };
  if (score === 2 || score === 3) return { level: 2, label: 'Medium', color: '#f59e0b' };
  return { level: 3, label: 'Strong', color: '#22c55e' };
}

export default function Register() {
  const [form, setForm] = useState({
    student_id: '', first_name: '', last_name: '', email: '', password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear() % 100; // e.g. 26 for 2026
  const strength = getPasswordStrength(form.password);

  // Auto-format Student ID
  const handleStudentId = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 6) val = val.slice(0, 6);

    // Validate year portion doesn't exceed current year
    if (val.length >= 2) {
      const year = parseInt(val.slice(0, 2));
      if (year > currentYear) val = String(currentYear) + val.slice(2);
    }

    if (val.length > 2) val = val.slice(0, 2) + '-' + val.slice(2);
    setForm({ ...form, student_id: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validations
    const idPattern = /^\d{2}-\d{4}$/;
    if (!idPattern.test(form.student_id)) {
      return setError('Invalid Student ID format. Use YY-NNNN (e.g. 25-0169)');
    }
    const year = parseInt(form.student_id.slice(0, 2));
    if (year > currentYear) {
      return setError(`Year in Student ID cannot exceed ${currentYear} (current year).`);
    }
    if (!form.email.endsWith('@gmail.com')) {
      return setError('Please use a Gmail address (@gmail.com).');
    }
    if (strength.level < 2) {
      return setError('Password is too weak. Add uppercase letters, numbers, or symbols.');
    }

    setLoading(true);
    try {
      await registerUser(form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused) => ({
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: `1.5px solid #e5e7eb`, fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit',
  });

  const labelStyle = {
    display: 'block', fontWeight: '600', color: '#374151',
    fontSize: '0.875rem', marginBottom: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2e5a 60%, #2d4a8a 100%)',
      padding: '20px',
    }}>

      <div style={{
        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '460px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
      }}>
        {/* Top Banner */}
        <div style={{ background: '#1a2e5a', padding: '28px 36px 20px', textAlign: 'center' }}>
          <img src="/qcu_logo.png" alt="QCU Logo"
            style={{height: '64px', width: '64px', border: '3px solid rgba(245,197,24,0.5)'}}
            className="h-10 w-10 rounded-full object-cover"
            onError={e => { e.target.style.display = 'none'; }} />
          <h1 style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', margin: 0 }}>QCU Cooperative Store</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>Quezon City University</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          {['Sign In', 'Register'].map((tab, i) => (
            <button key={tab}
              onClick={() => i === 0 && navigate('/login')}
              style={{
                flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontWeight: '600',
                fontSize: '0.95rem', transition: 'all 0.2s',
                background: i === 1 ? 'white' : '#f8f9fa',
                color: i === 1 ? '#1a2e5a' : '#9ca3af',
                borderBottom: i === 1 ? '2px solid #1a2e5a' : '2px solid transparent',
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding: '28px 36px 32px' }}>
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px',
              padding: '12px 16px', marginBottom: '16px', color: '#dc2626', fontSize: '0.875rem',
            }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px',
              padding: '12px 16px', marginBottom: '16px', color: '#16a34a', fontSize: '0.875rem',
            }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Student ID */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>
                Student ID <span style={{ color: '#9ca3af', fontWeight: '400' }}>(YY-NNNN format)</span>
              </label>
              <input
                placeholder="26-0169"
                value={form.student_id}
                onChange={handleStudentId}
                required
                maxLength={7}
                style={{ ...inputStyle(), fontFamily: 'monospace', letterSpacing: '2px' }}
                onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <p style={{ color: '#9ca3af', fontSize: '0.72rem', marginTop: '3px' }}>
                Example: {currentYear}-0001 • First 2 digits = enrollment year
              </p>
            </div>

            {/* First & Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input placeholder="Juan" value={form.first_name} required
                  onChange={e => setForm({ ...form, first_name: e.target.value })}
                  style={inputStyle()}
                  onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input placeholder="Dela Cruz" value={form.last_name} required
                  onChange={e => setForm({ ...form, last_name: e.target.value })}
                  style={inputStyle()}
                  onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            </div>

            {/* Gmail */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Gmail Address</label>
              <input type="email" placeholder="juandelacruz@gmail.com"
                value={form.email} required
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={inputStyle()}
                onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              <p style={{ color: '#9ca3af', fontSize: '0.72rem', marginTop: '3px' }}>
                Used for order notifications
              </p>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ ...inputStyle(), paddingRight: '44px' }}
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

              {/* Strength Indicator */}
              {form.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        flex: 1, height: '4px', borderRadius: '4px',
                        background: i <= strength.level ? strength.color : '#e5e7eb',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: strength.color, fontWeight: '600' }}>
                    {strength.label} password
                    {strength.level < 3 && (
                      <span style={{ color: '#9ca3af', fontWeight: '400' }}>
                        {' '}— add {strength.level === 1 ? 'uppercase, numbers & symbols' : 'symbols or numbers'}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
                background: loading ? '#9ca3af' : '#1a2e5a', color: 'white', fontWeight: '700',
                fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
              <UserPlus size={18} />
              {loading ? 'Creating Account...' : 'Create Account & Sign In'}
            </button>

            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '4px', paddingTop: '12px', paddingBottom: '8px' }}>
              <button onClick={() => navigate('/login')}
                style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                ← Back to Sign In
              </button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '18px', color: '#6b7280', fontSize: '0.875rem' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#1a2e5a', fontWeight: '700', textDecoration: 'none' }}>
              Sign in here
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', paddingBottom: '16px', color: '#9ca3af', fontSize: '0.75rem' }}>
          © 2026 QCU Cooperative
        </p>
      </div>
    </div>
  );
}