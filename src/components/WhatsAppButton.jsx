import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact BoxBox on WhatsApp"
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
