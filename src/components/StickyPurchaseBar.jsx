import React from 'react';
import { ShoppingCart, ArrowRight, MessageSquare } from 'lucide-react';
import { resolveMediaUrl } from '../utils/media';

const StickyPurchaseBar = ({ product, show, onAddToCart, onBuyNow }) => {
  if (!product) return null;
  const stockValue = Number(product.stock);
  const isOutOfStock = Number.isFinite(stockValue) ? stockValue <= 0 : false;
  const whatsappText = encodeURIComponent(`Hi BOXBOX India, I want to enquire about restock availability for ${product.brand} ${product.name}.`);
  const whatsappLink = `https://wa.me/919022229979?text=${whatsappText}`;

  return (
    <div 
      className="sticky-buy-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
        background: 'var(--sticky-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--sticky-border)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'all' : 'none',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
        padding: '12px 0',
        minHeight: '70px',
      }}
    >
      <div className="container sticky-buy-bar__inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '0', paddingBottom: '0' }}>
        
        {/* LEFT: INFO */}
        <div className="sticky-buy-bar__meta" style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          <div className="mobile-hide" style={{ width: '42px', height: '42px', borderRadius: '4px', overflow: 'hidden', background: '#fff', border: '1px solid rgba(0,0,0,0.05)' }}>
            <img 
              src={resolveMediaUrl(product.images?.[0] || product.image)} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
          <div style={{ lineHeight: '1.2' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--sticky-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
              {product.name}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--sticky-subtext)', fontWeight: '600', margin: '2px 0 0 0' }}>
              {product.brand}{(product.tyreSize || product.size) ? ` • ${product.tyreSize || product.size}` : ''}
            </p>
          </div>
        </div>

        {/* RIGHT: CTAs */}
        <div className="sticky-buy-bar__actions" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ textAlign: 'right' }}>
            <p className="mobile-hide" style={{ fontSize: '11px', color: 'var(--sticky-subtext)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{isOutOfStock ? 'Stock' : 'Price'}</p>
            <p style={{ fontSize: '19px', fontWeight: '900', color: 'var(--sticky-text)', margin: 0 }}>₹{product.price.toLocaleString()}</p>
            {isOutOfStock && (
              <p style={{ fontSize: '11px', color: '#ff4444', fontWeight: '900', margin: '2px 0 0 0', textTransform: 'uppercase' }}>Out of Stock</p>
            )}
          </div>
          
          <div className="sticky-buy-bar__buttons" style={{ display: 'flex', gap: '10px' }}>
            {isOutOfStock ? (
              <a
                className="sticky-btn-primary"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '800', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <MessageSquare size={14} />
                WhatsApp
              </a>
            ) : (
              <>
                <button 
                  className="sticky-btn-secondary" 
                  onClick={onAddToCart}
                  style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '700', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                >
                  <ShoppingCart size={14} />
                  <span className="mobile-hide">Add to Cart</span>
                </button>
                <button 
                  className="sticky-btn-primary" 
                  onClick={onBuyNow}
                  style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '800', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Buy Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --sticky-bg: rgba(245,245,245,0.97);
          --sticky-border: rgba(0,0,0,0.10);
          --sticky-text: #000000;
          --sticky-subtext: #555555;
        }

        .sticky-btn-primary { background: #000; color: #fff; border: none; }
        .sticky-btn-primary:hover { transform: scale(1.04); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        
        .sticky-btn-secondary { background: transparent; border: 1px solid rgba(0,0,0,0.18); color: #000; }
        .sticky-btn-secondary:hover { border-color: #000; background: rgba(0,0,0,0.04); }

        .dark .sticky-buy-bar {
          --sticky-bg: rgba(10,10,12,0.97);
          --sticky-border: rgba(255,255,255,0.12);
          --sticky-text: #ffffff;
          --sticky-subtext: #aaaaaa;
        }

        .dark .sticky-btn-primary { background: #fff; color: #000; }
        .dark .sticky-btn-primary:hover { box-shadow: 0 4px 20px rgba(255,255,255,0.15); }
        
        .dark .sticky-btn-secondary { border-color: rgba(255,255,255,0.25); color: #fff; }
        .dark .sticky-btn-secondary:hover { border-color: #fff; background: rgba(255,255,255,0.06); }

        @media (max-width: 768px) {
          .mobile-hide { display: none !important; }
          .sticky-buy-bar { padding: 10px 0 !important; }
          .sticky-buy-bar__inner {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
          .sticky-buy-bar__buttons > button {
            min-height: 44px;
            justify-content: center;
          }
        }
      `}} />
    </div>
  );
};

export default StickyPurchaseBar;
