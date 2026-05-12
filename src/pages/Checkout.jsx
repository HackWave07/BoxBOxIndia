import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Loader2, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resolveMediaUrl } from '../utils/media';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const grandTotal = totalPrice * 1.18; // Includes 18% GST
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', address: '', city: '', postalCode: '', phone: ''
  });

  const selectSavedAddress = (addr) => {
    const names = addr.fullName.split(' ');
    setForm({
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      address: addr.addressLine + (addr.landmark ? `, ${addr.landmark}` : ''),
      city: addr.city,
      postalCode: addr.pincode,
      phone: addr.phone
    });
    addToast('Address auto-filled', 'success');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: 'var(--bg2)', 
    border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', 
    outline: 'none', marginBottom: '16px', fontSize: '14px',
    transition: 'border-color 0.2s'
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      return addToast('Your cart is empty!', 'error');
    }
    
    const requiredFields = [form.firstName, form.lastName, form.address, form.phone, form.city, form.postalCode]; 
    if (requiredFields.some(field => !field || field.trim() === '')) {
      addToast("Please fill all shipping details", 'error');
      return;
    }
    
    setSubmitting(true);

    try {
      // 1. Create Razorpay order
      const { data: order } = await axios.post(`${import.meta.env.VITE_API_URL}/payment/create-order`, {
        amount: grandTotal
      });

      // 2. Initialize Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "BOXBOX",
        description: "Premium Tyre Purchase",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                ...response,
                cartItems: cart,
                total: grandTotal,
                customer: form,
                user: user?._id
              })
            });

            const data = await verifyRes.json();

            if (data.success) {
              alert("Payment Successful");

              localStorage.removeItem("cart");
              window.location.href = "/";
            } else {
              alert("Payment verification failed: " + (data.message || "Unknown error"));
            }
          } catch (err) {
            console.error("Verification Request Failed", err);
            alert("Verification Request Failed");
          }
        },
        theme: {
          color: "#000000"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        console.error("Payment Failed:", response.error);
        addToast('Payment Failed. Please try again.', 'error');
      });
      rzp.open();
    } catch (error) {
      console.error('Error initializing payment', error);
      addToast('Failed to initialize payment gateway.', 'error');
    }
    
    setSubmitting(false);
  };

  return (
    <div className="section-full" style={{ minHeight: '80vh', paddingTop: '60px', paddingBottom: '80px' }}>
      <h1 className="font-condensed" style={{ fontSize: '42px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '40px' }}>Checkout</h1>
      
      <div className="mobile-stack" style={{ display: 'flex', gap: '60px', alignItems: 'flex-start' }}>
        {/* CHECKOUT FORM */}
        <div style={{ flex: 2 }}>
          
          {/* Saved Addresses Selector */}
          {user && user.addresses && user.addresses.length > 0 && (
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px', background: 'var(--bg2)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} /> Select a Saved Address
              </h2>
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                {user.addresses.map((addr, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => selectSavedAddress(addr)}
                    className="animate-lift"
                    style={{ 
                      minWidth: '240px', 
                      padding: '16px', 
                      background: 'var(--bg)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '12px', 
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    <p style={{ fontWeight: '800', marginBottom: '4px' }}>{addr.fullName}</p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>{addr.addressLine}, {addr.city}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', textTransform: 'uppercase' }}>Shipping Details</h2>
            <div className="responsive-two-col" style={{ gap: '16px' }}>
              <input type="text" name="firstName" placeholder="First Name" value={form.firstName} style={inputStyle} onChange={handleChange} />
              <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} style={inputStyle} onChange={handleChange} />
            </div>
            <input type="text" name="address" placeholder="Street Address" value={form.address} style={inputStyle} onChange={handleChange} />
            <div className="responsive-two-col" style={{ gap: '16px' }}>
              <input type="text" name="city" placeholder="City" value={form.city} style={inputStyle} onChange={handleChange} />
              <input type="text" name="postalCode" placeholder="Postal Code" value={form.postalCode} style={inputStyle} onChange={handleChange} />
            </div>
            <input type="text" name="phone" placeholder="Phone Number" value={form.phone} style={inputStyle} onChange={handleChange} />
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', textTransform: 'uppercase' }}>Payment Method</h2>
            <div style={{ border: '2px solid var(--accent)', borderRadius: '12px', padding: '24px', background: 'rgba(var(--accent-rgb), 0.05)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', fontSize: '16px' }}>
                <input type="radio" name="payment" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }} /> 
                Secure Online Payment (Razorpay)
              </label>
              <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-muted)', marginLeft: '32px' }}>
                Pay securely via Credit/Debit Cards, UPI, NetBanking or Wallets.
              </p>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="glass-panel" style={{ flex: 1, padding: '32px', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Order Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '24px', marginBottom: '24px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
                  <img src={resolveMediaUrl(item.images?.[0] || item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
            <span>Total</span>
            <span style={{ color: 'var(--text)', fontWeight: '800', fontSize: '24px' }}>₹{grandTotal.toLocaleString()}</span>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '20px' }}
            onClick={handlePayment}
            disabled={submitting}
          >
            {submitting ? ( <Loader2 className="animate-spin" /> ) : ( `Pay Now ₹${grandTotal.toLocaleString()}` )}
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
