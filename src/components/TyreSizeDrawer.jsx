import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Loader2, Info } from 'lucide-react';
import axios from 'axios';
import { resolveMediaUrl } from '../utils/media';

const TyreSizeDrawer = ({ isOpen, onClose, onSelect, currentProduct }) => {
  const [selectedRim, setSelectedRim] = useState(17);
  const [sizesList, setSizesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const rims = [14, 15, 16, 17, 18, 19, 20, 21, 22];

  useEffect(() => {
    if (isOpen) {
      fetchSizes(selectedRim);
    }
  }, [isOpen, selectedRim, currentProduct]);

  const fetchSizes = async (rim) => {
    setLoading(true);

    // 1. First try local product sizes (preferred — no API needed)
    const localSizes = currentProduct?.sizes || [];
    const localFiltered = localSizes.filter(
      (item) => parseInt(item.rim) === parseInt(rim)
    );

    if (localFiltered.length > 0) {
      setSizesList(localFiltered);
      setLoading(false);
      return;
    }

    // 2. Fallback to global API endpoint
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products/sizes?rim=${rim}`);
      setSizesList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sizes', error);
      setSizesList([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 3000, 
      display: 'flex', 
      justifyContent: 'flex-end',
      pointerEvents: 'all'
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'rgba(0,0,0,0.6)', 
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-out forwards'
        }} 
      />

      {/* Drawer */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '450px', 
        background: 'var(--bg)', 
        height: '100%', 
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        display: 'flex', 
        flexDirection: 'column',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="font-condensed" style={{ fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Tyre Sizes</h2>
          <button onClick={onClose} style={{ background: 'var(--bg2)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        {/* Product Info — replaces old broken image section */}
        <div style={{ padding: '20px 24px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {currentProduct?.images?.[0] && (
            <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={resolveMediaUrl(currentProduct.images[0])}
                alt={currentProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Selected Product</p>
            <h3 style={{ fontSize: '15px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentProduct?.name || 'Tyre'}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{currentProduct?.brand} {currentProduct?.tyreSize ? `• ${currentProduct.tyreSize}` : ''}</p>
          </div>
        </div>

        {/* Rim Selector */}
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '1px' }}>Step 1: Select Rim Size</p>
          <div className="hide-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {rims.map(rim => (
              <button 
                key={rim}
                onClick={() => setSelectedRim(rim)}
                style={{
                  flex: '0 0 56px',
                  height: '56px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: selectedRim === rim ? 'var(--text)' : 'transparent',
                  color: selectedRim === rim ? 'var(--bg)' : 'var(--text)',
                  fontSize: '16px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: selectedRim === rim ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {rim}"
              </button>
            ))}
          </div>
        </div>

        {/* Sizes List */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }} className="hide-scrollbar">
          <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '1px' }}>Step 2: Available Specifications</p>
          
          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} style={{ opacity: 0.5 }} /></div>
          ) : (!sizesList || sizesList.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px 24px', background: 'var(--bg2)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
              <Info size={24} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No specifications found for {selectedRim}" rim.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sizesList?.map((s, idx) => (
                <div 
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'var(--text)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>{s.size}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>Load Index: {s.loadIndex} • SKU: {s.sku}</p>
                    </div>
                    <div style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: s.stock ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: s.stock ? '#4ade80' : '#ef4444',
                      fontSize: '11px',
                      fontWeight: '800',
                      textTransform: 'uppercase'
                    }}>
                      {s.stock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onSelect(s.size)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '8px',
                      background: 'var(--text)',
                      color: 'var(--bg)',
                      border: 'none',
                      fontWeight: '800',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Check Availability <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 600px) {
          .hide-scrollbar {
            padding-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default TyreSizeDrawer;
