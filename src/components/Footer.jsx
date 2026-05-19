import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

export default function Footer() {
  return (
    <footer style={{ padding: '80px 0 40px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="section-full">
        <div className="footer-grid">
        
        {/* COL 1 - BRAND + SOCIAL */}
        <div className="footer-brand-col">
          <img src={logo} alt="BOXBOX" style={{ height: '45px', width: 'auto', marginBottom: '20px', display: 'block', objectFit: 'contain' }} />
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px', fontSize: '15px' }}>
            India’s trusted destination for premium motorcycle and car tyres. Genuine products from authorised dealers, delivered pan-India.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="https://www.instagram.com/boxboxindia/?hl=en" target="_blank" rel="noopener noreferrer" className="btn-social">Instagram</a>
            <a href="https://www.facebook.com/p/BOX-BOX-61556176625024/" target="_blank" rel="noopener noreferrer" className="btn-social">Facebook</a>
            <a href="https://www.youtube.com/@BoxBoxindia/shorts?app=desktop" target="_blank" rel="noopener noreferrer" className="btn-social">YouTube</a>
          </div>
        </div>

        {/* COL 2 - MOTORCYCLE */}
        <div>
          <h4 className="font-condensed footer-col-title">MOTORCYCLE</h4>
          <ul className="footer-link-list">
            {['ADV & Dual Sport', 'Cruisers', 'Motocross', 'Sport Touring', 'Super Sports', 'Vintage'].map(link => (
              <li key={link}><Link to={`/products?category=${encodeURIComponent(link)}`} className="footer-link">{link}</Link></li>
            ))}
          </ul>
        </div>

        {/* COL 3 - CAR TYRES */}
        <div>
          <h4 className="font-condensed footer-col-title">CAR TYRES</h4>
          <ul className="footer-link-list">
            {['All Terrain', 'ATV', 'Mud Terrain', 'Sedan', 'Sports', 'SUV 4x4'].map(link => (
              <li key={link}><Link to={`/products?category=${encodeURIComponent(link)}`} className="footer-link">{link}</Link></li>
            ))}
          </ul>
        </div>

        {/* COL 4 - HELP */}
        <div className="footer-help-col">
          <h4 className="font-condensed footer-col-title">HELP</h4>
          <ul className="footer-link-list" style={{ marginBottom: '24px' }}>
            {['Shipping Policy', 'Returns Policy', 'Terms & Conditions', 'Privacy Policy', 'Contact Us'].map(link => (
               <li key={link}><Link to="#" className="footer-link">{link}</Link></li>
            ))}
          </ul>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '8px' }}>
              Phone: <a href="https://wa.me/919022229979?text=Hi%20BOXBOX%20India%2C%20I%20need%20help%20with%20tyres" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>+91 9022229979</a>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Email: support@boxboxindia.com</p>
          </div>
        </div>

        </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '80px', color: '#666', fontSize: '13px', borderTop: '1px solid var(--border)', paddingTop: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <span>© 2026 BoxBox India. All Rights Reserved.</span>
        <span>Miraroad, Mumbai — 401105</span>
      </div>
      </div>
    </footer>
  );
}
