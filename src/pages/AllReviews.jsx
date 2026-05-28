import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ALL_REVIEW_IMAGES = Array.from({ length: 41 }, (_, i) => ({
  id: i + 1,
  src: `/assets/reviews/review-${i + 1}.png`,
  alt: `Verified customer review ${i + 1}`,
}));

export default function AllReviews() {
  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg-gradient)', paddingTop: '56px', paddingBottom: '80px' }}>
      <style>{`
        @media (max-width: 600px) {
          .all-reviews-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .all-reviews-heading {
            font-size: clamp(32px, 10vw, 56px) !important;
          }
        }
      `}</style>

      <div style={{ width: '100%', padding: '0 clamp(16px, 4vw, 48px)' }}>

        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '13px',
            letterSpacing: '0.5px',
            marginBottom: '48px',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>

        <div style={{ marginBottom: '52px' }}>
          <h1
            className="font-condensed all-reviews-heading"
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: '1',
              marginBottom: '16px',
              color: 'var(--text)',
            }}
          >
            What Riders Say
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500', maxWidth: '520px' }}>
            {ALL_REVIEW_IMAGES.length} verified customer experiences — real stories from the BoxBoxIndia community.
          </p>
        </div>

        <div
          className="all-reviews-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {ALL_REVIEW_IMAGES.map((review) => (
            <div
              key={review.id}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                background: 'var(--card)',
                transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <img
                src={review.src}
                alt={review.alt}
                loading="lazy"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
