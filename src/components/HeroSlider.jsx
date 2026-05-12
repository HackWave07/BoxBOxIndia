import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&auto=format&fit=crop&q=80',
    label: 'PERFORMANCE TYRES',
    sub: 'Upgrade Your Ride',
    cta: 'SHOP NOW',
    href: '/products?category=Performance',
    position: 'right', // text alignment
  },
  {
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&auto=format&fit=crop&q=80',
    label: 'ALL-TERRAIN TYRES',
    sub: 'Conquer Any Road',
    cta: 'SHOP NOW',
    href: '/products?category=SUV%2F4x4',
    position: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&auto=format&fit=crop&q=80',
    label: 'PREMIUM PARTS',
    sub: 'Enhance Your Vehicle',
    cta: 'SHOP NOW',
    href: '/products?type=part',
    position: 'left',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const navigate = useNavigate();

  const goTo = useCallback((index) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 300);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((prev) => {
        const next = (prev + 1) % slides.length;
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [goTo]);

  // separate state-based interval to avoid stale closure
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        setFading(false);
      }, 300);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const isRight = slide.position === 'right';

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '420px', height: '80vh', maxHeight: '760px', overflow: 'hidden', background: '#0a0a0a' }}>

      {/* Background image layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(85%) brightness(0.65)',
          transition: 'opacity 0.4s ease',
          opacity: fading ? 0 : 1,
        }}
      />

      {/* Gradient overlay — stronger on text side */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isRight
            ? 'linear-gradient(to left, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.1) 100%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.78) 40%, rgba(0,0,0,0.1) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Text content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isRight ? 'flex-end' : 'flex-start',
          padding: '0 clamp(16px, 6vw, 80px)',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        <h1
          className="font-condensed"
          style={{
            fontSize: 'clamp(40px, 7vw, 88px)',
            fontWeight: '900',
            textTransform: 'uppercase',
            color: '#fff',
            letterSpacing: '2px',
            lineHeight: '1',
            marginBottom: '14px',
            textAlign: isRight ? 'right' : 'left',
          }}
        >
          {slide.label}
        </h1>
        <p
          style={{
            fontSize: 'clamp(14px, 1.8vw, 22px)',
            color: 'rgba(255,255,255,0.75)',
            fontWeight: '500',
            marginBottom: '32px',
            textAlign: isRight ? 'right' : 'left',
          }}
        >
          {slide.sub}
        </p>
        <button
          onClick={() => navigate(slide.href)}
          style={{
            background: '#fff',
            color: '#000',
            border: 'none',
            padding: '14px 32px',
            fontSize: '14px',
            fontWeight: '800',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ddd'; e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {slide.cta}
        </button>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setFading(true);
              setTimeout(() => { setCurrent(i); setFading(false); }, 300);
            }}
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.35)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
