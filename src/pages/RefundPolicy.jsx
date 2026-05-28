import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="container-narrow" style={{ maxWidth: '800px', paddingTop: '60px', paddingBottom: '60px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
      {/* Back */}
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '40px', textDecoration: 'none', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      {/* Title */}
      <h1 className="font-condensed" style={{ fontSize: '42px', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
        Returns & Refund Policy
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '48px', borderBottom: '1px solid var(--border)', paddingBottom: '40px' }}>
        At BoxBox India, customer satisfaction is our top priority. We want you to be completely happy with your tyre purchase. If for any reason you need to return an item, please read our policy details below.
      </p>

      {/* Policy Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>1. Return Eligibility Window</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px' }}>
            We accept returns of unused, unmounted, and undamaged tyres or parts within 14 days from the date of delivery. If 14 days have gone by since your delivery, unfortunately, we cannot offer you a refund or exchange.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>2. Condition of Returned Items</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px', marginBottom: '12px' }}>
            To be eligible for a return, the item must be:
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Completely brand new, unused, and never mounted on a wheel or vehicle.', 'In the original packaging with all labels, barcodes, and stickers intact.', 'Clean and free from dirt, dust, or grease.'].map((item, j) => (
              <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
                <CheckCircle2 size={16} color="var(--text)" style={{ marginTop: '3px', flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>3. How to Initiate a Return</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px' }}>
            To initiate a return, please contact our support team on WhatsApp at +91 90222 29979 or email us at support@boxboxindia.com with your order details and photos showing the condition of the tyres/parts. Once approved, we will arrange for a pickup or provide you with return shipment instructions.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>4. Refund Processing</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px' }}>
            Once your return is received and inspected by our warehouse team, we will send you a notification. If approved, your refund will be processed, and the amount will be credited back to your original payment method (or bank account) within 5–7 business days.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="glass-panel" style={{ marginTop: '64px', padding: '40px', textAlign: 'center', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h3 className="font-condensed" style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px' }}>
          Have Questions?
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px', maxWidth: '380px', margin: '10px auto 24px' }}>
          Our customer support team is available to assist you with returns, size exchanges, or refunds.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/919022229979?text=Hi%20BOXBOX%20India%2C%20I%20have%20a%20question%20about%20returns."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
          >
            Contact on WhatsApp
          </a>
          <Link to="/products" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
