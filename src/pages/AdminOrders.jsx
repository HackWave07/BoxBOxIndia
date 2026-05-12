import React, { useState, useEffect } from 'react';
import { Package, MapPin, IndianRupee, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { resolveMediaUrl } from '../utils/media';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(prev =>
        prev.map(o => (o._id === id ? { ...o, status } : o))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="section-full" style={{ minHeight: '80vh', paddingTop: '60px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800' }}>Order Management</h1>
        <button 
          onClick={fetchOrders}
          className="btn-primary" 
          style={{ padding: '10px 20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {loading && orders.length === 0 ? (
         <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>No orders found</h3>
          <p>You don't have any placed orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => (
            <div key={order._id || order.orderId} className="glass-panel" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Order ID: {order.orderId || order._id}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </p>
                  {order.paymentId && (
                     <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>Payment ID: {order.paymentId}</p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label htmlFor={`status-${order._id}`} style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>Status:</label>
                  <span className={`tag status-${order.status}`} style={{ marginRight: '8px' }}>{order.status}</span>
                  <select
                    id={`status-${order._id}`}
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    style={{
                      background: 'var(--bg2)',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      outline: 'none',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Customer Details */}
              <div style={{ marginBottom: '20px', background: 'var(--bg2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                 <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>Customer Details</h4>
                 <div className="responsive-two-col" style={{ gap: '16px' }}>
                    <div>
                        <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold' }}>{order.customer?.firstName} {order.customer?.lastName} {order.customer?.name}</p>
                        <p style={{ margin: '4px 0', fontSize: '14px', color: 'var(--text-muted)' }}><span style={{ fontWeight: '600', color: 'var(--text)' }}>Phone:</span> {order.customer?.phone}</p>
                    </div>
                    <div>
                        <p style={{ margin: '4px 0', fontSize: '14px', color: 'var(--text-muted)' }}><span style={{ fontWeight: '600', color: 'var(--text)' }}>Address:</span> {order.customer?.address}</p>
                        <p style={{ margin: '4px 0', fontSize: '14px', color: 'var(--text-muted)' }}>{order.customer?.city} {order.customer?.postalCode ? `- ${order.customer.postalCode}` : ''}</p>
                    </div>
                 </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>Items</h4>
                {order.items?.map((item, index) => (
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
                    <div style={{ fontWeight: '800' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: '800' }}>
                  Total: <span style={{ color: 'var(--text)' }}>₹{order.total?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
