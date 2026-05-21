import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Package, MapPin, CheckCircle2, Circle, Truck } from 'lucide-react';
import { resolveMediaUrl } from '../utils/media';

const ORDER_STEPS = [
  ['pending', 'Pending'],
  ['confirmed', 'Confirmed'],
  ['packed', 'Packed'],
  ['shipped', 'Shipped'],
  ['out_for_delivery', 'Out for Delivery'],
  ['delivered', 'Delivered']
];

const STATUS_LABELS = {
  paid: 'Confirmed',
  cancelled: 'Cancelled',
  returned: 'Returned',
  ready: 'Ready',
  in_transit: 'In Transit'
};

const getNormalizedStatus = (status) => status === 'paid' ? 'confirmed' : status || 'pending';
const getStatusLabel = (status) => STATUS_LABELS[status] || ORDER_STEPS.find(([value]) => value === status)?.[1] || status || 'Pending';

export default function TrackOrder() {
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchOrders = async (e, phoneOverride) => {
    e?.preventDefault();
    const lookupPhone = phoneOverride || phone;
    if (!lookupPhone) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/user/${lookupPhone}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryPhone = new URLSearchParams(location.search).get('phone');
    if (queryPhone) {
      setPhone(queryPhone);
      fetchOrders(null, queryPhone);
    }
  }, [location.search]);

  const renderTimeline = (status) => {
    const normalizedStatus = getNormalizedStatus(status);
    const currentIndex = ORDER_STEPS.findIndex(([value]) => value === normalizedStatus);
    const terminalStatus = ['cancelled', 'returned'].includes(normalizedStatus);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {ORDER_STEPS.map(([value, label], index) => {
          const complete = !terminalStatus && currentIndex >= index;
          return (
            <div key={value} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: complete ? 'var(--text)' : 'var(--text-muted)' }}>
              {complete ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              <span style={{ fontSize: '13px', fontWeight: '800' }}>{label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="section-full" style={{ minHeight: '80vh', paddingTop: '60px', paddingBottom: '60px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '40px' }}>Track Your Order</h1>
      
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <form onSubmit={fetchOrders} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0 16px' }}>
            <MapPin size={20} color="var(--text-muted)" style={{ marginRight: '12px' }} />
            <input 
              type="tel" 
              placeholder="Enter your registered Phone Number..." 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '16px 0', background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', fontSize: '16px' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ padding: '16px 32px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            disabled={loading}
          >
             <Search size={20} /> {loading ? "Searching..." : "Track Orders"}
          </button>
        </form>
      </div>

      {searched && !loading && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>No orders found</h3>
          <p>We couldn't find any orders linked to {phone}.</p>
        </div>
      )}

      {orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => {
            const items = order.items || order.products || [];
            const total = order.total ?? order.totalPrice ?? 0;

            return (
              <div key={order._id || order.orderId} className="glass-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Order ID: {order.orderId || order._id}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                      Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`tag status-${order.status}`}>{getStatusLabel(order.status)}</span>
                    {order.paymentId && (
                       <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>Payment ID: {order.paymentId}</p>
                    )}
                  </div>
                </div>

                {renderTimeline(order.status)}

                <div style={{ marginBottom: '24px', background: 'var(--bg2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={16} /> Delivery Progress
                  </h4>
                  <div className="responsive-two-col" style={{ gap: '12px' }}>
                    <p style={{ fontSize: '14px' }}><strong>Courier:</strong> {order.courierName || 'To be assigned'}</p>
                    <p style={{ fontSize: '14px' }}><strong>Tracking ID:</strong> {order.trackingId || 'Not available yet'}</p>
                    <p style={{ fontSize: '14px' }}><strong>Shipping:</strong> {getStatusLabel(order.shippingStatus)}</p>
                    <p style={{ fontSize: '14px' }}><strong>Delivery Date:</strong> {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN') : 'Pending'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: 'var(--text)', overflow: 'hidden' }}>
                             <img src={resolveMediaUrl(item.images?.[0] || item.image) || 'https://via.placeholder.com/100?text=Tyre'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=Tyre'; }} />
                        </div>
                        <div>
                          <p style={{ fontWeight: '700' }}>{item.name}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div style={{ fontWeight: '800' }}>Rs. {(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Includes GST & Shipping</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: '800' }}>
                    Total: <span style={{ color: 'var(--text)' }}>Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
