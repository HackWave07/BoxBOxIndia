import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const guides = [
  {
    slug: 'how-to-choose-tyres',
    title: 'How to Choose the Right Tyres',
    excerpt: 'Selecting the right tyre can be overwhelming. We break down load index, speed ratings, tread patterns, and seasonal choices so you can buy with confidence.',
    readTime: '6 min read',
    category: 'Buying Guide',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop',
  },
  {
    slug: 'best-tyres-for-suv',
    title: 'Best Tyres for SUV & 4x4 Vehicles',
    excerpt: 'From city commutes to weekend off-road runs — discover which tyre compounds and tread designs keep your SUV gripped in every condition.',
    readTime: '5 min read',
    category: 'SUV Guide',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop',
  },
  {
    slug: 'bike-tyre-size-guide',
    title: 'Motorcycle Tyre Size Guide Explained',
    excerpt: 'Those cryptic numbers on the sidewall — 150/70 R17 — actually tell you everything. Learn how to read tyre dimensions and pick the correct size for your bike.',
    readTime: '4 min read',
    category: 'Motorcycle',
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6b3?w=1200&auto=format&fit=crop',
  },
  {
    slug: 'touring-vs-performance',
    title: 'Touring vs Performance Tyres: Which Is Right for You?',
    excerpt: 'Touring tyres promise comfort and longevity. Performance tyres deliver grip and response. We compare both side-by-side so you pick the right match for your riding style.',
    readTime: '7 min read',
    category: 'Comparison',
    image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=1200&auto=format&fit=crop',
  },
];

export default function Guides() {
  return (
    <div className="section-full" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'var(--text)', color: 'var(--bg)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
        </div>
        <h1 className="font-condensed" style={{ fontSize: '52px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1' }}>
          Tyre & Parts Guides
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginTop: '16px', maxWidth: '560px', margin: '16px auto 0' }}>
          Expert advice to help you make the right choice for your vehicle.
        </p>
      </div>

      {/* Guide Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
        {guides.map((g) => (
          <Link
            key={g.slug}
            to={`/guides/${g.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <article
              className="glass-panel animate-lift"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              {/* Image with dark overlay */}
              <div className="card-media-frame" style={{ position: 'relative', overflow: 'hidden', background: '#111' }}>
                <img
                  src={g.image}
                  alt={g.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.35s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop'; }}
                />
                {/* Dark overlay for readability */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.45))', pointerEvents: 'none' }} />
                {/* Category tag floated over image */}
                <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {g.category}
                </span>
              </div>

              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '14px' }}>
                  <Clock size={13} />
                  {g.readTime}
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1.3', marginBottom: '12px' }}>{g.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', flexGrow: 1 }}>{g.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', fontWeight: '700', fontSize: '14px' }}>
                  Read Article <ArrowRight size={16} />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Help CTA */}
      <div className="glass-panel" style={{ marginTop: '80px', padding: '48px', textAlign: 'center', background: 'var(--bg2)' }}>
        <h3 className="font-condensed" style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>
          Need Help Choosing?
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '28px', maxWidth: '480px', margin: '12px auto 28px' }}>
          Our tyre experts are available on WhatsApp. Share your vehicle and we'll recommend the best fit.
        </p>
        <a
          href="https://wa.me/919022229979?text=Hi%20BOXBOX%20India%2C%20I%20need%20help%20choosing%20tyres%20for%20my%20vehicle."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', fontSize: '16px', textDecoration: 'none' }}
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
