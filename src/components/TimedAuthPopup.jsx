import React, { useState, useEffect } from 'react';
import { X, User, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const POPUP_KEY = 'boxbox_popup_dismissed_at';
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DELAY_MS = 5000; // 5 seconds

const TimedAuthPopup = () => {
  const [visible, setVisible] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return;

    const dismissed = localStorage.getItem(POPUP_KEY);
    if (dismissed && Date.now() - parseInt(dismissed, 10) < COOLDOWN_MS) return;

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [loading, user]);

  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible]);

  const dismiss = () => {
    localStorage.setItem(POPUP_KEY, String(Date.now()));
    setVisible(false);
  };

  const goTo = (path) => {
    dismiss();
    navigate(path);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Join BoxBoxIndia"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={dismiss}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'bbpFadeIn 0.3s ease',
        }}
      />

      {/* Modal card */}
      <div
        style={{
          position: 'relative',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-hover)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '420px',
          padding: 'clamp(24px, 6vw, 36px) clamp(20px, 6vw, 32px) 24px',
          animation: 'bbpSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <X size={18} />
        </button>

        {/* Brand badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--input-bg)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '4px 12px',
            marginBottom: '16px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          <User size={11} />
          BoxBoxIndia
        </div>

        {/* Headline */}
        <h2
          style={{
            color: 'var(--text)',
            fontSize: 'clamp(20px, 5vw, 24px)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          Join BoxBoxIndia
        </h2>

        {/* Supporting message */}
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}
        >
          Track orders, save your vehicles, and enjoy faster checkout — all in one place.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => goTo('/register')}
            style={{
              width: '100%',
              padding: '13px 20px',
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity 0.2s',
              fontFamily: "'Barlow', sans-serif",
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <UserPlus size={16} />
            Create Account
          </button>

          <button
            onClick={() => goTo('/login')}
            style={{
              width: '100%',
              padding: '13px 20px',
              background: 'transparent',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s',
              fontFamily: "'Barlow', sans-serif",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--input-bg)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogIn size={16} />
            Log In
          </button>

          <button
            onClick={dismiss}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              color: 'var(--text-muted)',
              border: 'none',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: "'Barlow', sans-serif",
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            Not now
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bbpFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bbpSlideUp {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
};

export default TimedAuthPopup;
