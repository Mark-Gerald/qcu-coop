import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, Eye, Package } from 'lucide-react';

export default function Shop({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    getProducts(category)
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [category]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product, qty = 1) => {
    if (!user) { navigate('/login'); return; }
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      const updated = exists
        ? prev.map(i => i._id === product._id
            ? { ...i, quantity: Math.min(i.quantity + qty, product.stock) }
            : i)
        : [...prev, { ...product, quantity: qty }];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
    setSelectedProduct(null);
    setQuantity(1);
  };

  const categories = [
    { value: '', label: 'All' },
    { value: 'Uniforms', label: 'Uniforms' },
    { value: 'School Supplies', label: 'School Supplies' },
    { value: 'ID & Lanyards', label: 'ID & Lanyards' },
  ];

  const categoryBadgeColor = {
    'Uniforms': { bg: '#1a2e5a', text: 'white' },
    'School Supplies': { bg: '#166534', text: 'white' },
    'ID & Lanyards': { bg: '#92400e', text: 'white' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar cartCount={cartCount} />

      {/* Hero Banner */}
      <section style={{ background: '#1a2e5a', padding: '40px 20px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 style={{ color: 'white', fontWeight: '800', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '6px' }}>
            QCU Coop Store
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Browse all available products</p>
        </div>
      </section>

      {/* Search + Filter Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 20px', position: 'sticky', top: '64px', zIndex: 40 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px',
                  border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat.value} onClick={() => setCategory(cat.value)}
                  style={{
                    padding: '8px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                    fontWeight: '600', fontSize: '0.875rem', transition: 'all 0.2s',
                    background: category === cat.value ? '#1a2e5a' : '#f3f4f6',
                    color: category === cat.value ? 'white' : '#374151',
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <main style={{ flex: 1, background: '#f8f9fa', padding: '32px 20px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTopColor: '#1a2e5a', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: '#6b7280' }}>Loading products...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : filtered.length === 0 ? (
            /* Empty State */
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <Package size={64} style={{ color: '#d1d5db', margin: '0 auto 20px' }} />
              <h3 style={{ color: '#374151', fontWeight: '700', fontSize: '1.25rem', marginBottom: '8px' }}>
                {search || category ? 'No products found' : 'There are no products at the moment'}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '24px' }}>
                {search ? `No results for "${search}"` : category ? `No products in ${category} yet` : 'Check back soon — new items are being added!'}
              </p>
              {(search || category) && (
                <button onClick={() => { setSearch(''); setCategory(''); }}
                  style={{ padding: '10px 24px', background: '#1a2e5a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
                  View All Products
                </button>
              )}
            </div>
          ) : (
            <>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 500 }}>
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map(product => {
                  const badge = categoryBadgeColor[product.category] || { bg: '#6b7280', text: 'white' };
                  const outOfStock = product.stock <= 0;
                  return (
                    <div key={product._id} style={{
                      background: 'white', borderRadius: '16px', overflow: 'hidden',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                      opacity: outOfStock ? 0.7 : 1,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                      onMouseEnter={e => { if (!outOfStock) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}>

                      {/* Image */}
                      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#f3f4f6' }}>
                        <img src={product.image_url || 'https://placehold.co/300x200?text=No+Image'}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: outOfStock ? 'grayscale(60%)' : 'none' }} />
                        {/* Category Badge */}
                        <span style={{
                          position: 'absolute', top: '12px', left: '12px',
                          background: badge.bg, color: badge.text,
                          padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600',
                        }}>
                          {product.category}
                        </span>
                        {/* Out of Stock Overlay */}
                        {outOfStock && (
                          <div style={{
                            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(0,0,0,0.4)',
                          }}>
                            <span style={{ background: '#ef4444', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '0.875rem' }}>
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ color: '#1a2e5a', fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px', lineHeight: 1.3 }}>
                          {product.name}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '10px', lineHeight: 1.5 }}>
                          {product.description?.slice(0, 60)}{product.description?.length > 60 ? '...' : ''}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ color: '#1a2e5a', fontWeight: '800', fontSize: '1.1rem' }}>₱{product.price}</span>
                          <span style={{ fontSize: '0.75rem', color: outOfStock ? '#ef4444' : '#16a34a', fontWeight: '500' }}>
                            {outOfStock ? 'Out of stock' : `${product.stock} left in stock`}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setSelectedProduct(product); setQuantity(1); }}
                            style={{
                              flex: 1, padding: '9px', borderRadius: '8px', border: '1.5px solid #e5e7eb',
                              background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                              color: '#374151', fontSize: '0.85rem', fontWeight: '600',
                            }}>
                            <Eye size={15} /> View
                          </button>
                          <button onClick={() => addToCart(product)} disabled={outOfStock}
                            style={{
                              flex: 1, padding: '9px', borderRadius: '8px', border: 'none',
                              background: outOfStock ? '#e5e7eb' : '#f5c518',
                              color: outOfStock ? '#9ca3af' : '#1a2e5a',
                              cursor: outOfStock ? 'not-allowed' : 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                              fontWeight: '700', fontSize: '0.85rem',
                            }}>
                            <ShoppingCart size={15} /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={() => setSelectedProduct(null)}>
          <div style={{
            background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%',
            maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>
            <img src={selectedProduct.image_url || 'https://placehold.co/500x280?text=No+Image'}
              alt={selectedProduct.name}
              style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
            <div style={{ padding: '24px' }}>
              <span style={{ fontSize: '0.75rem', background: '#e8eaf0', padding: '3px 10px', borderRadius: '20px', color: '#555' }}>
                {selectedProduct.category}
              </span>
              <h2 style={{ color: '#1a2e5a', fontWeight: '800', margin: '12px 0 8px', fontSize: '1.3rem' }}>{selectedProduct.name}</h2>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '16px', fontSize: '0.9rem' }}>{selectedProduct.description}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ color: '#1a2e5a', fontWeight: '800', fontSize: '1.5rem' }}>₱{selectedProduct.price}</span>
                <span style={{ color: '#6b7280', fontSize: '0.875rem', alignSelf: 'center' }}>
                  {selectedProduct.stock} left in stock
                </span>
              </div>

              {/* Quantity Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem', display: 'block', marginBottom: '8px' }}>Quantity</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    −
                  </button>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(selectedProduct.stock, q + 1))}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    +
                  </button>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Total: <strong style={{ color: '#1a2e5a' }}>₱{(selectedProduct.price * quantity).toFixed(2)}</strong>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setSelectedProduct(null)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#374151' }}>
                  Cancel
                </button>
                <button onClick={() => addToCart(selectedProduct, quantity)} disabled={selectedProduct.stock === 0}
                  style={{
                    flex: 2, padding: '12px', borderRadius: '10px', border: 'none',
                    background: '#f5c518', color: '#1a2e5a', fontWeight: '700', cursor: 'pointer', fontSize: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}