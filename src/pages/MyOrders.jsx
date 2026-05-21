import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, Truck, ArrowRight, Loader2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const getStatusLabel = (status) => {
  const labels = {
    paid: 'CONFIRMED',
    confirmed: 'CONFIRMED',
    out_for_delivery: 'OUT FOR DELIVERY'
  };
  return labels[status] || (status || 'pending').replace(/_/g, ' ').toUpperCase();
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (error) {
        console.error('Error fetching my orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
      case 'confirmed': return <CheckCircle size={16} className="status-confirmed" />;
      case 'packed': return <Package size={16} className="status-packed" />;
      case 'shipped': return <Truck size={16} className="status-shipped" />;
      case 'out_for_delivery': return <Truck size={16} className="status-out_for_delivery" />;
      case 'delivered': return <CheckCircle size={16} className="status-delivered" />;
      default: return <Clock size={16} className="status-pending" />;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="spin" size={48} style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  return (
    <div className="section-full" style={{ padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 className="font-condensed" style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Order History</h1>
          <p style={{ color: 'var(--text-muted)' }}>Tracking your performance tyre upgrades</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state glass-panel">
            <Package size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <h3>No orders yet</h3>
            <p>You haven't placed any orders with this account yet.</p>
            <Link to="/products" className="btn-primary" style={{ marginTop: '24px' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => {
              const items = order.items || order.products || [];
              const customer = order.customer || order.userDetails || {};
              const total = order.total ?? order.totalPrice ?? 0;

              return (
                <div key={order._id} className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</p>
                      <h3 style={{ fontSize: '15px', fontWeight: '800' }}>#{order._id.slice(-8).toUpperCase()}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div className={`tag status-${order.status}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </div>
                      <p style={{ fontSize: '20px', fontWeight: '900', marginTop: '12px' }}>Rs. {total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg2)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                    {items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: idx !== items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '32px', height: '32px', background: 'var(--bg)', borderRadius: '4px', textAlign: 'center', lineHeight: '32px', fontSize: '11px', fontWeight: '800' }}>
                            {item.quantity}x
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</span>
                        </div>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Rs. {item.price?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span className="tag" style={{ borderStyle: 'dashed' }}>
                        <Info size={12} /> {customer.phone}
                      </span>
                    </div>
                    <Link to={`/track-order?phone=${customer.phone || ''}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                      Full Tracking <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
