import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api';
import { ArrowLeft, Search, Plus, Pencil, Trash2, X, Package } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

const empty = { name: '', price: '', description: '', image_url: '', category: 'Uniforms', stock: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedMobileHeader, setExpandedMobileHeader] = useState(false);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) return alert('Please fill in all required fields.');
    setLoading(true);
    try {
      if (editing) {
        const res = await updateProduct(editing, form);
        setProducts(prev => prev.map(p => p._id === editing ? res.data : p));
      } else {
        const res = await createProduct(form);
        setProducts(prev => [...prev, res.data]);
      }
      setForm(empty); setEditing(null); setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => { setForm(p); setEditing(p._id); setShowForm(true); };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p._id !== id));
    setDeleteConfirm(null);
  };

  const filtered = products.filter(p => {
  const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase());
  const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
  return matchSearch && matchCategory;
});

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const labelStyle = { display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '5px' };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/admin" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <h1 style={{ color: '#1a2e5a', fontWeight: '800', fontSize: '1.25rem', margin: 0 }}>Product Management</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#1a2e5a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
  {/* Search */}
  <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: 'clamp(12px, 3vw, 24px)' }}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {/* Mobile: Responsive Header */}
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      gap: '12px',
      flexWrap: 'wrap'
    }}>
      <Link to="/admin" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
        <ArrowLeft size={16} /> Dashboard
      </Link>
      <h1 style={{ 
        color: '#1a2e5a', 
        fontWeight: '800', 
        fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
        margin: 0,
        flex: 1
      }}>
        Product Management
      </h1>
      <button 
        onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}
        style={{
          padding: 'clamp(8px, 2vw, 12px) clamp(12px, 2vw, 16px)',
          background: '#1a2e5a',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
          whiteSpace: 'nowrap'
        }}>
        + Add Product
      </button>
    </div>

    {/* Search & Filter - Stack on mobile, row on desktop */}
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }} className="md:flex-row md:gap-4">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          flex: 1,
          minWidth: '0',
          padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2vw, 16px)',
          borderRadius: '8px',
          border: '1.5px solid #e2e8f0',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
        }}
      />
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        style={{
          padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2vw, 16px)',
          borderRadius: '8px',
          border: '1.5px solid #e2e8f0',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
          minWidth: 'clamp(120px, 25%, 150px)',
        }}>
        <option value="All">All Categories</option>
        <option value="Uniforms">Uniforms</option>
        <option value="School Supplies">School Supplies</option>
        <option value="ID & Lanyards">ID & Lanyards</option>
      </select>
    </div>
  </div>
</div>
</div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', borderRadius: '16px' }}>
            <Package size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
            <p style={{ color: '#94a3b8' }}>No products found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {filtered.map(p => (
              <div key={p._id} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ position: 'relative', height: '160px', background: '#f1f5f9' }}>
                  <img src={p.image_url || 'https://placehold.co/240x160?text=No+Image'} alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute', top: '8px', left: '8px', background: '#1a2e5a', color: 'white',
                    padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600',
                  }}>
                    {p.category}
                  </span>
                  {p.stock <= 0 && (
                    <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600' }}>
                      Out of Stock
                    </span>
                  )}
                </div>
                <div style={{ padding: '14px' }}>
                  <h4 style={{ margin: '0 0 4px', color: '#1a2e5a', fontWeight: '700', fontSize: '0.95rem' }}>{p.name}</h4>
                  <p style={{ margin: '0 0 10px', color: '#64748b', fontSize: '0.8rem' }}>₱{p.price} · Stock: {p.stock}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(p)}
                      style={{ flex: 1, padding: '7px', background: '#e8edf5', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#1a2e5a', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(p._id)}
                      style={{ flex: 1, padding: '7px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#dc2626', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflow: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#1a2e5a', fontWeight: '800' }}>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => { setShowForm(false); setForm(empty); setEditing(null); }}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
                <X size={18} style={{ color: '#64748b' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { key: 'name', label: 'Product Name *', placeholder: 'e.g. QCU PE Uniform' },
                { key: 'price', label: 'Price (₱) *', placeholder: 'e.g. 250' },
                { key: 'stock', label: 'Stock Quantity *', placeholder: 'e.g. 50' },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#1a2e5a'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                ))}
              <div>
                <label style={labelStyle}>Product Image</label>
                <ImageUploader
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                />
              </div>

              <div>
                <label style={labelStyle}>Category *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                  <option>Uniforms</option>
                  <option>School Supplies</option>
                  <option>ID & Lanyards</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea placeholder="Product description..." value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => { setShowForm(false); setForm(empty); setEditing(null); }}
                style={{ flex: 1, padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={loading}
                style={{ flex: 2, padding: '12px', background: '#1a2e5a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>
                {loading ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
            <Trash2 size={40} style={{ color: '#dc2626', margin: '0 auto 16px' }} />
            <h3 style={{ color: '#1a2e5a', marginBottom: '8px' }}>Delete Product?</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '24px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: 'white', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}