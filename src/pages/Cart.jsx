import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { resolveMediaUrl } from '../utils/media';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Your Cart is Empty</h2>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="section-full" style={{ minHeight: '80vh', paddingTop: '60px', paddingBottom: '60px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '40px' }}>Shopping Cart</h1>
      
      <div className="mobile-stack" style={{ display: 'flex', gap: '60px', alignItems: 'flex-start' }}>
        {/* CART ITEMS */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {cart.map(item => (
            <div key={item.id} className="glass-panel" style={{ display: 'flex', gap: '20px', padding: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <img src={resolveMediaUrl(item.images?.[0] || item.image)} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Size: {item.size}</p>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><Minus size={14} /></button>
                    <span style={{ fontWeight: '600', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div style={{ fontSize: '20px', fontWeight: '800', marginLeft: 'auto' }}>
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="glass-panel" style={{ flex: 1, padding: '32px', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
            <span>Tax (18% GST)</span>
            <span>₹{(totalPrice * 0.18).toLocaleString()}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', margin: '24px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '24px', fontWeight: '800' }}>
            <span>Total</span>
            <span>₹{(totalPrice * 1.18).toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px', display: 'block', textAlign: 'center' }}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
