import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ActiveFilters({ activeFilters, onRemove, onClearAll }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { types, categories, brands, sizes, priceRange, search } = activeFilters;

  const hasFilters = 
    types.length > 0 || 
    categories.length > 0 || 
    brands.length > 0 || 
    sizes.length > 0 || 
    priceRange.min !== null || 
    priceRange.max !== null ||
    search;

  if (!hasFilters) return null;

  const tagStyle = {
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textTransform: 'capitalize',
    color: 'var(--text)',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'default',
    animation: 'fadeInUp 0.3s ease-out forwards'
  };

  const closeBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    borderRadius: '50%',
    padding: '3px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
      {search && (
        <span style={tagStyle}>
          <span style={{ opacity: 0.6 }}>Search:</span> {search}
          <div style={closeBtnStyle} onClick={() => onRemove('search', search)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}>
            <X size={12} />
          </div>
        </span>
      )}
      
      {types.map(t => (
        <span key={t} style={tagStyle}>
          <span style={{ opacity: 0.6 }}>Type:</span> {t}
          <div style={closeBtnStyle} onClick={() => onRemove('types', t)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}>
            <X size={12} />
          </div>
        </span>
      ))}

      {categories.map(c => (
        <span key={c} style={tagStyle}>
          {c}
          <div style={closeBtnStyle} onClick={() => onRemove('categories', c)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}>
            <X size={12} />
          </div>
        </span>
      ))}

      {brands.map(b => (
        <span key={b} style={tagStyle}>
          {b}
          <div style={closeBtnStyle} onClick={() => onRemove('brands', b)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}>
            <X size={12} />
          </div>
        </span>
      ))}

      {sizes.map(s => (
        <span key={s} style={tagStyle}>
          {s}
          <div style={closeBtnStyle} onClick={() => onRemove('sizes', s)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}>
            <X size={12} />
          </div>
        </span>
      ))}

      {(priceRange.min !== null || priceRange.max !== null) && (
        <span style={tagStyle}>
          <span style={{ opacity: 0.6 }}>Price:</span> ₹{priceRange.min || 0} - ₹{priceRange.max || '∞'}
          <div style={closeBtnStyle} onClick={() => onRemove('priceRange', null)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}>
            <X size={12} />
          </div>
        </span>
      )}

      <button 
        onClick={onClearAll}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#ff4444', 
          fontSize: '13px', 
          fontWeight: '700', 
          cursor: 'pointer',
          padding: '8px 16px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          opacity: 0.8,
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.textDecoration = 'underline'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.textDecoration = 'none'; }}
      >
        Clear All
      </button>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
