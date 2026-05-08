import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllOrders, updateOrder } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import API from '../../api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/admin/login'); return; }
    getAllOrders().then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, [user]);

  const handleUpdate = async (id, status, note) => {
    const res = await updateOrder(id, { status, admin_note: note });
    setOrders(prev => prev.map(o => o._id === id ? res.data : o));
  };

  const handleComplete = async (id) => {
    const res = await API.put(`/orders/${id}/complete`);
    setOrders(prev => prev.map(o => o._id === id ? res.data : o));
  };

  const STATUS = {
  Pending:   { color: '#d97706', bg: '#fef3c7', icon: <Clock size={14} /> },
  Approved:  { color: '#059669', bg: '#d1fae5', icon: <CheckCircle size={14} /> },
  Declined:  { color: '#dc2626', bg: '#fee2e2', icon: <XCircle size={14} /> },
  Accepted:  { color: '#059669', bg: '#d1fae5', icon: <CheckCircle size={14} /> },
  Cancelled: { color: '#6b7280', bg: '#f1f5f9', icon: <XCircle size={14} /> },
  Completed: { color: '#1a2e5a', bg: '#e8edf5', icon: <CheckCircle size={14} /> },
};

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
  <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
    {/* Header */}
    <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <Link to="/admin" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', flexShrink: 0 }}>
        <ArrowLeft size={16} /> Dashboard
      </Link>
      <h1 style={{ color: '#1a2e5a', fontWeight: '800', fontSize: '1.1rem', margin: 0 }}>Order Management</h1>
    </div>

    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px' }}>
      {/* Filter Tabs — scrollable on mobile */}
      <div style={{ overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
        <div style={{ display: 'flex', gap: '6px', background: 'white', padding: '6px', borderRadius: '12px', width: 'max-content', minWidth: '100%', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {['All', 'Pending', 'Approved', 'Declined', 'Accepted', 'Cancelled', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.8rem', transition: 'all 0.2s', whiteSpace: 'nowrap',
                background: filter === f ? '#1a2e5a' : 'transparent',
                color: filter === f ? 'white' : '#64748b',
              }}>
              {f} {f !== 'All' && `(${orders.filter(o => o.status === f).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading orders...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <Package size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8' }}>No {filter !== 'All' ? filter.toLowerCase() : ''} orders found.</p>
        </div>
      ) : filtered.map(order => (
        <div key={order._id} style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          {/* Order Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: '0 0 2px', color: '#1a2e5a', fontWeight: '700', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.student_name}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {order.student_id} · {order.student_email}
              </p>
              <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>
                {new Date(order.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px',
              borderRadius: '20px', fontWeight: '700', fontSize: '0.75rem', flexShrink: 0,
              background: STATUS[order.status]?.bg, color: STATUS[order.status]?.color,
            }}>
              {STATUS[order.status]?.icon} {order.status}
            </span>
          </div>

          {/* Items */}
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < order.items.length - 1 ? '1px solid #e2e8f0' : 'none', fontSize: '0.825rem' }}>
                <span style={{ color: '#374151', marginRight: '8px' }}>{item.product_name} <span style={{ color: '#94a3b8' }}>×{item.quantity}</span></span>
                <span style={{ fontWeight: '600', color: '#1a2e5a', flexShrink: 0 }}>₱{item.subtotal}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '4px', borderTop: '2px solid #e2e8f0', fontWeight: '700', fontSize: '0.875rem' }}>
              <span style={{ color: '#374151' }}>Total</span>
              <span style={{ color: '#1a2e5a' }}>₱{order.total_amount}</span>
            </div>
          </div>

          {order.admin_note && (
            <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '10px', fontStyle: 'italic' }}>
              Note: {order.admin_note}
            </p>
          )}

          {/* Action Buttons */}
          {order.status === 'Pending' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleUpdate(order._id, 'Approved', 'Your order has been approved. Please pick up at the QCU Cooperative.')}
                style={{ flex: 1, padding: '10px 8px', background: '#059669', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <CheckCircle size={14} /> Approve
              </button>
              <button onClick={() => handleUpdate(order._id, 'Declined', 'Sorry, your order has been declined. Please contact the cooperative for more information.')}
                style={{ flex: 1, padding: '10px 8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <XCircle size={14} /> Decline
              </button>
            </div>
          )}

          {order.status === 'Declined' && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1, padding: '8px 12px', background: '#fee2e2', borderRadius: '10px', fontSize: '0.8rem', color: '#dc2626', fontWeight: '600' }}>
                Declined — user notified by email.
              </div>
              <button onClick={() => handleComplete(order._id)}
                style={{ padding: '10px 16px', background: '#1a2e5a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.825rem', whiteSpace: 'nowrap' }}>
                Done
              </button>
            </div>
          )}

          {(order.status === 'Accepted' || order.status === 'Cancelled') && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600',
                background: order.status === 'Accepted' ? '#d1fae5' : '#f1f5f9',
                color: order.status === 'Accepted' ? '#059669' : '#6b7280',
              }}>
                Student {order.status === 'Accepted' ? 'confirmed receipt' : 'cancelled order'}
              </div>
              <button onClick={() => handleComplete(order._id)}
                style={{ padding: '10px 16px', background: '#1a2e5a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.825rem', whiteSpace: 'nowrap' }}>
                Done
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
}