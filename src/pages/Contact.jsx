import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import API from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // NEW: Send to backend to store in MongoDB
      await API.post('/feedback', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
    fontFamily: 'inherit', background: 'white',
  };

  const labelStyle = {
    display: 'block', marginBottom: '6px', fontWeight: '600',
    color: '#374151', fontSize: '0.875rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: '#1a2e5a', padding: '60px 20px',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 style={{ color: 'white', fontWeight: '800', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '8px' }}>
            Contact Us
          </h1>
          <p style={{ color: '#94a3b8' }}>We'd love to hear from you</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left — Info */}
          <div>
            <h2 style={{ color: '#1a2e5a', fontWeight: '700', fontSize: '1.5rem', marginBottom: '12px' }}>
              Get in Touch
            </h2>
            <p style={{ color: '#6b7280', lineHeight: '1.7', marginBottom: '32px' }}>
              Have questions about products, orders, or your account? Send us a message and the QCU Cooperative team will get back to you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {[
                {
                  icon: <MapPin size={20} style={{ color: 'white' }} />,
                  bg: '#1a2e5a',
                  title: 'Location',
                  text: 'San Bartolome Novaliches, Quezon City, Philippines',
                },
                {
                  icon: <Mail size={20} style={{ color: 'white' }} />,
                  bg: '#f5c518',
                  title: 'Email',
                  text: 'qcu.coop.admin@gmail.com',
                },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', background: item.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#1a2e5a', marginBottom: '2px' }}>{item.title}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div style={{
              background: '#f8f9fa', borderRadius: '16px', padding: '24px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Clock size={18} style={{ color: '#1a2e5a' }} />
                <h4 style={{ color: '#1a2e5a', fontWeight: '700' }}>Operating Hours</h4>
              </div>
              {[
                { day: 'Monday – Friday', time: '8:00 AM – 5:00 PM' },
                { day: 'Saturday', time: '8:00 AM – 12:00 PM' },
                { day: 'Sunday & Holidays', time: 'Closed' },
              ].map(row => (
                <div key={row.day} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '6px 0', borderBottom: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                }}>
                  <span style={{ color: '#374151' }}>{row.day}</span>
                  <span style={{ color: row.time === 'Closed' ? '#ef4444' : '#1a2e5a', fontWeight: '500' }}>{row.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '36px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0',
          }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle size={56} style={{ color: '#22c55e', margin: '0 auto 16px' }} />
                <h3 style={{ color: '#1a2e5a', fontWeight: '700', fontSize: '1.25rem', marginBottom: '8px' }}>
                  Message Sent!
                </h3>
                <p style={{ color: '#6b7280' }}>Thank you for reaching out. We'll get back to you soon.</p>
                <button onClick={() => setSuccess(false)}
                  style={{
                    marginTop: '24px', padding: '10px 28px', background: '#1a2e5a',
                    color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600',
                  }}>
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ color: '#1a2e5a', fontWeight: '700', fontSize: '1.25rem', marginBottom: '24px' }}>
                  Send a Message
                </h3>
                {error && <p style={{ color: '#ef4444', marginBottom: '12px', fontSize: '0.875rem' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
                    <div>
                      <label style={labelStyle}>Your Name</label>
                      <input style={inputStyle} placeholder="Juan Dela Cruz"
                        value={form.name} required
                        onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input style={inputStyle} type="email" placeholder="your@email.com"
                        value={form.email} required
                        onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Subject</label>
                    <input style={inputStyle} placeholder="What is this about?"
                      value={form.subject} required
                      onChange={e => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Message</label>
                    <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }}
                      placeholder="Tell us how we can help..."
                      value={form.message} required
                      onChange={e => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <button type="submit" disabled={loading}
                    style={{
                      width: '100%', padding: '13px', background: loading ? '#9ca3af' : '#1a2e5a',
                      color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem',
                      fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                    <Send size={17} />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}