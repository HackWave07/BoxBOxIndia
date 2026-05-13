import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Tag, Layers } from 'lucide-react';
import { resolveMediaUrl } from '../utils/media';

export default function SearchDropdown({ results, loading, query, visible, selectedIndex, onSelect }) {
  const navigate = useNavigate();

  if (!visible || query.length < 2) return null;

  const { products = [], categories = [], brands = [] } = results;
  const hasResults = products.length > 0 || categories.length > 0 || brands.length > 0;

  const handleRowClick = (item) => {
    if (item.type === 'product') navigate(`/product/${item.id}`);
    else if (item.type === 'category') navigate(`/products?category=${item.name}`);
    else if (item.type === 'brand') navigate(`/products?brand=${item.name}`);
    onSelect();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: '8px',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        zIndex: 2000,
        overflow: 'hidden',
        maxHeight: '480px',
        overflowY: 'auto',
      }}
    >
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="skeleton-loader" style={{ height: '40px', marginBottom: '10px' }} />
          <div className="skeleton-loader" style={{ height: '40px', marginBottom: '10px' }} />
          <div className="skeleton-loader" style={{ height: '40px' }} />
          <p style={{ marginTop: '10px', fontSize: '13px' }}>Searching for "{query}"...</p>
        </div>
      ) : !hasResults ? (
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <p style={{ fontWeight: '700', marginBottom: '4px' }}>No results found</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Try searching by brand, size, or category</p>
        </div>
      ) : (
        <>
          {/* Categories */}
          {categories.length > 0 && (
            <div style={{ padding: '12px 0' }}>
              <p style={{ px: '16px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', padding: '0 16px' }}>Categories</p>
              {categories.map((cat, idx) => (
                <div
                  key={`cat-${idx}`}
                  onClick={() => handleRowClick({ type: 'category', name: cat })}
                  style={{
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    background: selectedIndex === idx ? 'var(--bg2)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = selectedIndex === idx ? 'var(--bg2)' : 'transparent'}
                >
                  <Tag size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{cat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Brands */}
          {brands.length > 0 && (
            <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', padding: '0 16px' }}>Brands</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 16px' }}>
                {brands.map((brand, idx) => (
                  <div
                    key={`brand-${idx}`}
                    onClick={() => handleRowClick({ type: 'brand', name: brand })}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text)'; e.currentTarget.style.background = 'var(--bg2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {products.length > 0 && (
            <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', padding: '0 16px' }}>Products</p>
              {products.map((p, idx) => (
                <div
                  key={p._id}
                  onClick={() => handleRowClick({ type: 'product', id: p._id })}
                  style={{
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    background: selectedIndex === (categories.length + idx) ? 'var(--bg2)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = selectedIndex === (categories.length + idx) ? 'var(--bg2)' : 'transparent'}
                >
                  <img src={resolveMediaUrl(p.images?.[0] || p.image)} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', background: '#eee' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', lineHeight: '1.2' }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{p.brand} • ₹{p.price.toLocaleString()}</div>
                  </div>
                  <ChevronRight size={14} color="var(--border)" />
                </div>
              ))}
            </div>
          )}

          {/* View All */}
          <div
            onClick={() => { navigate(`/products?search=${query}`); onSelect(); }}
            style={{
              padding: '14px',
              textAlign: 'center',
              borderTop: '1px solid var(--border)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              background: 'var(--bg2)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
          >
            View all results for "{query}" →
          </div>
        </>
      )}

      <style>{`
        .skeleton-loader {
          background: linear-gradient(90deg, var(--bg2) 25%, var(--border) 50%, var(--bg2) 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

function ChevronRight({ size, color }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    );
}
