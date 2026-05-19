import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Truck, BadgeCheck } from 'lucide-react';
import { resolveMediaUrl } from '../utils/media';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="glass-panel animate-lift" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/product/${product.id}`} className="product-card-image-link" style={{ background: 'var(--bg2)' }}>
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

      <div className="product-card-info-div">
        <p className="product-card-brand">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>
        
        {/* Rating */}
        <div className="product-card-rating">
          {Array(5).fill().map((_, i) => (
            <Star key={i} size={13} fill={i < Math.round(product.rating || 4) ? 'var(--text)' : 'transparent'} color="var(--text)" />
          ))}
          <span style={{ marginLeft: '4px' }}>{product.rating || '4.5'}</span>
          <span className="product-card-rating-reviews">({product.reviews || '200'}+ reviews)</span>
        </div>

        {/* Trust Badges */}
        <div className="product-card-badges mobile-hidden" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <BadgeCheck size={11} /> Genuine
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Truck size={11} /> Fast Delivery
          </span>
        </div>

        {product.tyreSize && (
          <p className="product-card-size">Size: {product.tyreSize || product.size}</p>
        )}
        
        <div className="product-card-footer">
          <span className="product-card-price">₹{product.price?.toLocaleString()}</span>
          <button 
            className="product-card-add-btn btn-primary" 
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
