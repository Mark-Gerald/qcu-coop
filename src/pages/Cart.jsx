import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder, loginUser } from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingCart, Minus, Plus, Trash2, Eye, EyeOff, CheckCircle, ShoppingBag } from 'lucide-react';

export default function Cart({ cart, setCart }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmForm, setConfirmForm] = useState({ student_id: '', password: '' });
  const [confirmError, setConfirmError] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const updateQty = (id, qty) => {
    const updated = qty < 1
      ? cart.filter(i => i._id !== id)
      : cart.map(i => i._id === id ? { ...i, quantity: qty } : i);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter(i => i._id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Step 1: Click Place Order → show confirmation modal
  const handlePlaceOrderClick = () => {
    if (!user) { navigate('/login'); return; }
    setConfirmForm({ student_id: '', password: '' });
    setConfirmError('');
    setModalStep(1); // always start at step 1
    setShowConfirmModal(true);
  };

  // Step 2: User re-enters credentials to confirm identity
  const handleConfirmOrder = async () => {
    setConfirmError('');
    setConfirmLoading(true);

    // Validate credentials match the logged-in user
    if (confirmForm.student_id !== user.student_id) {
      setConfirmError('Student ID does not match your logged-in account.');
      setConfirmLoading(false);
      return;
    }

    try {
      // Re-authenticate to verify password
      await loginUser({ student_id: confirmForm.student_id, password: confirmForm.password });

      // Credentials verified — place the order
      await placeOrder({
        student_id: user.student_id,
        student_name: `${user.first_name} ${user.last_name}`,
        student_email: user.email,
        items: cart.map(i => ({
          product_id: i._id,
          product_name: i.name,
          price: i.price,
          quantity: i.quantity,
          subtotal: i.price * i.quantity,
        })),
        total_amount: total,
      });

      setCart([]);
      localStorage.removeItem('cart');
      setShowConfirmModal(false);
      setSuccess(true);
    } catch (err) {
      setConfirmError('Incorrect password. Please try again.');
    } finally {
      setConfirmLoading(false);
    }
  };

  // Add this handler inside the Cart component (near the top with other handlers):
  const handleVerifyStudentId = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, ''); // digits only
    if (val.length > 6) val = val.slice(0, 6);
    if (val.length > 2) val = val.slice(0, 2) + '-' + val.slice(2);
    setConfirmForm({ ...confirmForm, student_id: val });
  };

  // Success screen
  if (success) return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '80px', height: '80px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={40} style={{ color: '#059669' }} />
          </div>
          <h2 style={{ color: '#1a2e5a', fontWeight: '800', fontSize: '1.5rem', marginBottom: '8px' }}>Order Placed!</h2>
          <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '28px' }}>
            Your order is now pending admin approval. You'll receive an email notification once it's reviewed.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/orders')}
              style={{ flex: 1, padding: '12px', background: '#1a2e5a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>
              View My Orders
            </button>
            <button onClick={() => navigate('/shop')}
              style={{ flex: 1, padding: '12px', background: 'white', color: '#1a2e5a', border: '1.5px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar cartCount={cartCount} />

      {/* Header */}
      <div style={{ background: '#1a2e5a', padding: '32px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ color: 'white', fontWeight: '800', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', margin: 0 }}>
            Your Cart{' '}
            <span style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: '400' }}>
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>
      </div>

      <main style={{ flex: 1, maxWidth: '1000px', margin: '32px auto', padding: '0 20px', width: '100%', boxSizing: 'border-box' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ShoppingCart size={36} style={{ color: '#94a3b8' }} />
            </div>
            <h3 style={{ color: '#1a2e5a', fontWeight: '700', marginBottom: '8px' }}>Your cart is empty</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Browse our products and add items to your cart</p>
            <button onClick={() => navigate('/shop')}
              style={{ padding: '12px 32px', background: '#1a2e5a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem' }}>
              Go to Shop
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-3">

              {/* Cart Items */}
              <div style={{ gridColumn: 'span 2' }}>
                {cart.map(item => (
                  <div key={item._id} style={{
                    display: 'flex', gap: '16px', alignItems: 'center', padding: '20px',
                    background: 'white', borderRadius: '16px', marginBottom: '12px',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                  }}>
                    {/* Image */}
                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: '#f1f5f9' }}>
                      <img src={item.image_url || 'https://placehold.co/80x80?text=?'}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://placehold.co/80x80?text=?'; }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 4px', color: '#1a2e5a', fontWeight: '700', fontSize: '0.95rem' }}>{item.name}</h3>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>₱{item.price} each</p>
                    </div>

                    {/* Qty Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => updateQty(item._id, item.quantity - 1)}
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={14} />
                      </button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '700', fontSize: '0.95rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, item.quantity + 1)}
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Subtotal + Delete */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: '0 0 8px', fontWeight: '800', color: '#1a2e5a', fontSize: '1rem' }}>
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button onClick={() => removeItem(item._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', height: 'fit-content', position: 'sticky', top: '80px', }}>
                <h3 style={{ color: '#1a2e5a', fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>Order Summary</h3>

                <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '12px', paddingRight: '4px' }}>
                  {cart.map(item => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.875rem' }}>
                      <span style={{ color: '#374151', marginRight: '8px' }}>{item.name} ×{item.quantity}</span>
                      <span style={{ color: '#1a2e5a', fontWeight: '600', flexShrink: 0 }}>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>Total</span>
                  <span style={{ fontWeight: '800', color: '#1a2e5a', fontSize: '1.2rem' }}>₱{total.toFixed(2)}</span>
                </div>

                <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '12px', margin: '16px 0', fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5' }}>
                  📋 Admin will review and approve your order. You'll be notified via email.
                </div>

                <button onClick={handlePlaceOrderClick}
                  style={{
                    width: '100%', padding: '14px', background: '#f5c518', color: '#1a2e5a',
                    border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '1rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}>
                  <ShoppingBag size={18} /> Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order Confirmation Modal */}
      {showConfirmModal && (
  <>
    {/* Backdrop */}
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 998 }}
      onClick={() => setShowConfirmModal(false)} />

    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      zIndex: 999, width: '100%', maxWidth: '460px', padding: '0 20px',
    }}>

      {/* STEP 1 — Order Summary */}
      {modalStep === 1 && (
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ background: '#1a2e5a', padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: 'white', fontWeight: '800', margin: '0 0 4px', fontSize: '1.2rem' }}>Order Summary</h2>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Review your order before placing</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5c518', fontWeight: '800', fontSize: '0.9rem' }}>
                1/2
              </div>
            </div>
          </div>

          <div style={{ padding: '24px 28px' }}>
            {/* Items */}
            <div style={{ marginBottom: '16px' }}>
              {cart.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                      <img src={item.image_url || 'https://placehold.co/44x44?text=?'} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://placehold.co/44x44?text=?'; }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1a2e5a', fontSize: '0.875rem' }}>{item.name}</p>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.78rem' }}>×{item.quantity} @ ₱{item.price}</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: '700', color: '#1a2e5a', fontSize: '0.9rem' }}>
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #e5e7eb', marginBottom: '20px' }}>
              <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>Total</span>
              <span style={{ fontWeight: '800', color: '#1a2e5a', fontSize: '1.2rem' }}>₱{total.toFixed(2)}</span>
            </div>

            {/* Info note */}
            <div style={{ background: '#f0f4ff', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.8rem', color: '#374151', lineHeight: '1.5' }}>
              Your order will be sent to the admin for approval. You'll receive an email notification once reviewed.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowConfirmModal(false)}
                style={{ flex: 1, padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>
                Cancel
              </button>
              <button onClick={() => { setConfirmError(''); setModalStep(2); }}
                style={{ flex: 2, padding: '12px', background: '#f5c518', color: '#1a2e5a', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '0.95rem' }}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — Identity Verification */}
      {modalStep === 2 && (
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ background: '#1a2e5a', padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: 'white', fontWeight: '800', margin: '0 0 4px', fontSize: '1.2rem' }}>Verify Identity</h2>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Confirm your credentials to place the order</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5c518', fontWeight: '800', fontSize: '0.9rem' }}>
                2/2
              </div>
            </div>
          </div>

          <div style={{ padding: '24px 28px' }}>
            {confirmError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '0.8rem' }}>
                {confirmError}
              </div>
            )}

            <p style={{ color: '#374151', fontSize: '0.875rem', marginBottom: '20px', lineHeight: '1.5' }}>
              For your security, please re-enter your login credentials to confirm this order.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '6px' }}>
                Student ID
              </label>
              <input
                placeholder="25-0169"
                value={confirmForm.student_id}
                onChange={handleVerifyStudentId}
                maxLength={7}
                style={{
                        width: '100%', padding: '12px 14px', borderRadius: '10px',
                        border: '1.5px solid #e5e7eb', fontSize: '1rem', outline: 'none',
                        boxSizing: 'border-box', fontFamily: 'monospace', letterSpacing: '2px',
                }}
                onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <p style={{ color: '#9ca3af', fontSize: '0.72rem', marginTop: '3px' }}>
                Format: YY-NNNN (e.g. 25-0169)
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={confirmForm.password}
                  onChange={e => setConfirmForm({ ...confirmForm, password: e.target.value })}
                  style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  onKeyDown={e => e.key === 'Enter' && handleConfirmOrder()}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setModalStep(1)}
                style={{ flex: 1, padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>
                Back
              </button>
              <button onClick={handleConfirmOrder}
                disabled={confirmLoading || !confirmForm.student_id || !confirmForm.password}
                style={{
                  flex: 2, padding: '12px',
                  background: confirmLoading || !confirmForm.student_id || !confirmForm.password ? '#9ca3af' : '#1a2e5a',
                  color: 'white', border: 'none', borderRadius: '10px',
                  cursor: confirmLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '700', fontSize: '0.95rem',
                }}>
                {confirmLoading ? 'Verifying...' : 'Confirm & Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
)}

      <Footer />
    </div>
  );
}