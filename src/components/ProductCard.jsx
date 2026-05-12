import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Truck, BadgeCheck } from 'lucide-react';
import { resolveMediaUrl } from '../utils/media';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="glass-panel animate-lift" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/product/${product.id}`} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0', background: 'var(--bg2)', overflow: 'hidden', height: '300px' }}>
        {product.badge && (
          <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--accent)', color: 'var(--accent-text)', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', zIndex: 1 }}>
            {product.badge}
          </span>
        )}
        <img
          src={resolveMediaUrl(product?.images?.[0] || product?.image) || 'https://via.placeholder.com/500?text=No+Image'}
          alt={product?.name || 'Product Image'}
          className="product-card-img"
          style={{ width: '100%', height: '100%', maxWidth: '95%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', transition: 'transform 0.3s ease', display: 'block', transform: 'scale(1.15)' }}
          onError={e => { e.currentTarget.src = 'https://via.placeholder.com/500?text=No+Image'; }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1.15)'; }}
        />
      </Link>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 style={{ fontSize: '16px', lineHeight: '1.3', fontWeight: '700', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
        </Link>
        
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {Array(5).fill().map((_, i) => (
            <Star key={i} size={13} fill={i < Math.round(product.rating || 4) ? 'var(--text)' : 'transparent'} color="var(--text)" />
          ))}
          <span style={{ fontSize: '13px', fontWeight: '600', marginLeft: '4px' }}>{product.rating || '4.5'}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>({product.reviews || '200'}+ reviews)</span>
        </div>

        {/* Trust Badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <BadgeCheck size={11} /> Genuine
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Truck size={11} /> Fast Delivery
          </span>
        </div>

        {product.tyreSize && (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Size: {product.tyreSize || product.size}</p>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border)', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '20px', fontWeight: '800' }}>₹{product.price?.toLocaleString()}</span>
          <button 
            className="btn-primary" 
            style={{ padding: '8px 16px', minWidth: '88px' }}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={16} /> 
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
