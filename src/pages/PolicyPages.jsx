import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

function PolicyPage({ title, intro, sections, whatsappText }) {
  const whatsappLink = `https://wa.me/919022229979?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="container-narrow" style={{ maxWidth: '800px', paddingTop: '60px', paddingBottom: '60px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '40px', textDecoration: 'none', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <h1 className="font-condensed" style={{ fontSize: '42px', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
        {title}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '48px', borderBottom: '1px solid var(--border)', paddingBottom: '40px' }}>
        {intro}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {sections.map((section, index) => (
          <div key={section.heading}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>{index + 1}. {section.heading}</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px', marginBottom: section.points ? '12px' : 0 }}>
              {section.body}
            </p>
            {section.points && (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.points.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
                    <CheckCircle2 size={16} color="var(--text)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ marginTop: '64px', padding: '40px', textAlign: 'center', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h3 className="font-condensed" style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px' }}>
          Need Help?
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px', maxWidth: '380px', margin: '10px auto 24px' }}>
          Contact BoxBox India support for order, delivery, return, and product questions.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
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

export function ShippingPolicy() {
  return (
    <PolicyPage
      title="Shipping Policy"
      intro="BoxBox India ships premium tyres and performance parts across India with tracked delivery and careful handling."
      whatsappText="Hi BOXBOX India, I have a question about shipping."
      sections={[
        { heading: 'Serviceable Locations', body: 'We deliver to serviceable pin codes across India. If a location requires special freight handling, our team will confirm the best available delivery option before dispatch.' },
        { heading: 'Dispatch Timelines', body: 'In-stock products are usually prepared for dispatch after order confirmation and payment verification. Custom or special-order items may require additional handling time.' },
        { heading: 'Delivery Tracking', body: 'Once shipped, tracking details are shared through the order communication channel so you can follow the shipment status.' },
        { heading: 'Delivery Inspection', body: 'Please inspect packaging at delivery and contact support promptly if you notice transit damage or missing items.' }
      ]}
    />
  );
}

export function TermsPolicy() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro="These terms cover use of the BoxBox India website, product listings, orders, payments, and customer support."
      whatsappText="Hi BOXBOX India, I have a question about the terms and conditions."
      sections={[
        { heading: 'Product Information', body: 'We aim to keep product details, prices, stock, and fitment information accurate. Availability and pricing may change before an order is confirmed.' },
        { heading: 'Orders & Payments', body: 'Orders are processed after successful payment or confirmed payment instructions. BoxBox India may contact you to verify fitment or delivery details before dispatch.' },
        { heading: 'Fitment Responsibility', body: 'Customers should verify tyre size, vehicle compatibility, and intended use before purchase. Our support team can help review fitment where needed.' },
        { heading: 'Support', body: 'For order, product, or policy questions, contact support through WhatsApp or email at support@boxboxindia.com.' }
      ]}
    />
  );
}

export function PrivacyPolicy() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="BoxBox India uses customer information only to operate the store, process orders, provide support, and improve the shopping experience."
      whatsappText="Hi BOXBOX India, I have a question about privacy."
      sections={[
        { heading: 'Information We Collect', body: 'We collect information needed for account access, order fulfilment, payment coordination, delivery, and customer support.' },
        { heading: 'How We Use Information', body: 'Customer data is used to process orders, provide delivery updates, respond to support requests, and maintain secure website operations.' },
        { heading: 'Sharing Information', body: 'We share relevant order and delivery details only with service providers needed to complete purchases, shipments, payment workflows, or support.' },
        { heading: 'Contact', body: 'For privacy questions or account data requests, contact support@boxboxindia.com or reach us on WhatsApp.' }
      ]}
    />
  );
}
