import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function SortDropdown({ value, onChange }) {
  const options = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Popularity', value: 'popular' },
  ];

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '240px' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: 'none',
          padding: '10px 40px 10px 16px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text)',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.2s',
          minWidth: '200px',
          width: '100%',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            Sort by: {opt.label}
          </option>
        ))}
      </select>
      <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
        <ChevronDown size={14} />
      </div>
    </div>
  );
}
