import React, { useState, useEffect } from 'react';

export default function PriceFilter({ min, max, onChange }) {
  const [localMin, setLocalMin] = useState(min || '');
  const [localMax, setLocalMax] = useState(max || '');

  // Synchronize with external changes (e.g. Clear All)
  useEffect(() => {
    setLocalMin(min === null ? '' : min);
    setLocalMax(max === null ? '' : max);
  }, [min, max]);

  const handleApply = () => {
    onChange({
      min: localMin === '' ? null : Number(localMin),
      max: localMax === '' ? null : Number(localMax)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="number"
          placeholder="Min"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          style={inputStyle}
        />
        <span style={{ color: 'var(--text-muted)' }}>—</span>
        <input
          type="number"
          placeholder="Max"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          style={inputStyle}
        />
      </div>
      <button 
        onClick={handleApply}
        style={{
          width: '100%',
          padding: '8px',
          background: 'var(--text)',
          color: 'var(--bg)',
          border: 'none',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Apply Price
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  borderRadius: '4px',
  fontSize: '14px',
  outline: 'none'
};
