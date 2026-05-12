import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Subtle delay for better entry feel
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = "https://wa.me/919022229979?text=Hi%20BOXBOX%20India%2C%20I%20need%20help%20with%20tyres";

  if (!isVisible) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 999,
      animation: 'fadeInUp 0.4s ease-out forwards' 
    }}>
      {/* Tooltip - Desktop Only */}
      <div style={{
        position: 'absolute',
        bottom: '72px',
        right: '0',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '8px 16px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#fff',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        opacity: showTooltip ? 1 : 0,
        transform: showTooltip ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        display: 'none', 
      }} className="desktop-tooltip">
        Chat with tyre expert
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--text)',
          color: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="whatsapp-fab"
      >
        <MessageCircle size={28} />
      </a>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .whatsapp-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
        }
        .whatsapp-fab:active {
          transform: scale(0.95);
        }
        @media (min-width: 1024px) {
          .desktop-tooltip {
            display: block !important;
          }
        }
        @media (max-width: 600px) {
          .whatsapp-fab {
            width: 52px !important;
            height: 52px !important;
          }
        }
      `}</style>
    </div>
  );
}
