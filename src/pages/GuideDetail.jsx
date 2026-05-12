import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { guides } from './Guides';
import { Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';

const guideContent = {
  'how-to-choose-tyres': {
    sections: [
      {
        heading: 'Understanding Tyre Size',
        body: `Every tyre has a combination of numbers imprinted on its sidewall — something like 225/45 R17 91W. Understanding what these mean is the first step to buying the right tyre.\n\nThe first number (225) is the tyre width in millimetres. The second (45) is the aspect ratio — the height of the sidewall as a percentage of the tyre's width. R17 means the tyre fits a 17-inch wheel rim. The 91W at the end represents the load index (91 = 615 kg max load) and speed rating (W = 270 km/h).`
      },
      {
        heading: 'Tread Patterns Matter',
        body: `Tread pattern determines how your tyre interacts with the road surface:\n\n• **Symmetrical** — suitable for everyday driving, quiet and long-lasting.\n• **Asymmetrical** — one side for dry grip, the other for wet drainage. Best for performance cars.\n• **Directional** — shaped like a V, they channel water away efficiently. Ideal for monsoon-heavy regions.`
      },
      {
        heading: 'Seasonal Considerations in India',
        body: `India has three broad seasons that affect tyre performance. During monsoons, deep tread depth and wide channels are critical to prevent aquaplaning. In peak summer heat, a higher speed-rated tyre compound withstands road temperatures better. For Himalayan routes during winter, consider M+S rated or dedicated all-terrain tyres.`
      },
      {
        heading: 'Key Checklist Before Buying',
        items: ['Match the size exactly as listed in your vehicle manual.', 'Check the load index — never go lower than OEM spec.', 'Verify the speed rating suits your driving style.', 'Prefer reputed brands for long-term reliability.', 'Look for warranties covering manufacturing defects.']
      }
    ]
  },
  'best-tyres-for-suv': {
    sections: [
      {
        heading: 'What Makes an SUV Tyre Different?',
        body: `SUVs are heavier than sedans and carry more payload. This requires tyres with higher load indices, reinforced sidewalls, and compounds designed to handle both highway cruising and light off-road use.`
      },
      {
        heading: 'Highway vs All-Terrain',
        body: `If you spend 90% of your time on tarmac, a highway-terrain (H/T) tyre gives better fuel efficiency, quieter ride, and longer life. If you venture off-road regularly, an all-terrain (A/T) tyre sacrifices some road manners for mud and gravel performance.`
      },
      {
        heading: 'Top Picks for Indian SUVs',
        items: ['Michelin Primacy SUV — premium highway touring', 'Yokohama Geolandar A/T — best all-terrain balance', 'MRF Wanderer A/T — value pick for Thar, Scorpio', 'Goodyear Wrangler DuraTrac — extreme off-road capable', 'Apollo Tyres Apterra H/T — excellent highway mileage']
      }
    ]
  },
  'bike-tyre-size-guide': {
    sections: [
      {
        heading: 'Reading a Motorcycle Tyre Sidewall',
        body: `A typical bike tyre marking like 150/70 R17 69H breaks down as follows:\n\n• 150 = tyre width in mm\n• 70 = aspect ratio (sidewall height as % of width)\n• R17 = radial, 17-inch rim\n• 69H = load index 69 (325 kg), speed rating H (210 km/h)`
      },
      {
        heading: 'Front vs Rear Tyres',
        body: `Never swap front and rear tyres — they're engineered differently. Front tyres are narrower with a sharper profile for steering precision. Rear tyres are wider and feature a flatter profile to maximize contact patch under acceleration and braking.`
      },
      {
        heading: 'Tyre Recommendations by Segment',
        items: ['ADV/Dual Sport: Pirelli Scorpion Rally STR, Metzeler Karoo 4', 'Street/Naked: Michelin Power 5, Pirelli Diablo Rosso IV', 'Cruiser: Metzeler ME 888 Marathon, Dunlop American Elite', 'Commuter: MRF Revz, Ceat Zoom Rad X1']
      }
    ]
  },
  'touring-vs-performance': {
    sections: [
      {
        heading: 'The Core Difference',
        body: `Touring tyres are built for longevity, comfort, and all-weather capability. Performance tyres sacrifice longevity for sharper handling, higher grip levels, and faster feedback. Neither is universally better — it depends entirely on how and where you ride.`
      },
      {
        heading: 'Touring Tyres — Pros & Cons',
        items: ['✔ 60,000–80,000 km lifespan', '✔ Quieter, more comfortable ride', '✔ Better wet weather safety', '✗ Less precise cornering feel', '✗ Not suited for high-speed track use']
      },
      {
        heading: 'Performance Tyres — Pros & Cons',
        items: ['✔ Maximum dry grip and responsiveness', '✔ Precise steering feedback', '✔ Suited for spirited and track driving', '✗ Shorter lifespan (20,000–40,000 km)', '✗ Higher cost per kilometre']
      },
      {
        heading: 'Our Recommendation',
        body: `For daily commuters logging 10,000+ km annually, a premium touring tyre like the Michelin Primacy 4+ or Pirelli Cinturato P7 will save money while providing excellent safety. If you track your car on weekends, the Michelin Pilot Sport 4S or Bridgestone Potenza Sport are worth every rupee.`
      }
    ]
  }
};

export default function GuideDetail() {
  const { slug } = useParams();
  const guide = guides.find(g => g.slug === slug);
  const content = guideContent[slug];

  if (!guide || !content) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Guide not found</h2>
        <Link to="/guides" className="btn-secondary">Back to Guides</Link>
      </div>
    );
  }

  return (
    <div className="container-narrow" style={{ maxWidth: '800px', paddingTop: '60px', paddingBottom: '60px' }}>
      {/* Back */}
      <Link to="/guides" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '40px', textDecoration: 'none', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} /> Back to Guides
      </Link>

      {/* Hero Image */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '40px', minHeight: '240px', height: 'min(320px, 60vw)', background: '#111', position: 'relative' }}>
        <img
          src={guide.image}
          alt={guide.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop';
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.35))', pointerEvents: 'none' }} />
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {guide.category}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '13px' }}>
          <Clock size={13} /> {guide.readTime}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-condensed" style={{ fontSize: '42px', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.5px' }}>
        {guide.title}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '48px', borderBottom: '1px solid var(--border)', paddingBottom: '40px' }}>
        {guide.excerpt}
      </p>

      {/* Article Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {content.sections.map((section, i) => (
          <div key={i}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>{section.heading}</h2>
            {section.body && (
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px', whiteSpace: 'pre-line' }}>
                {section.body}
              </p>
            )}
            {section.items && (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                {section.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
                    <CheckCircle2 size={16} color="var(--text)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="glass-panel" style={{ marginTop: '64px', padding: '40px', textAlign: 'center', background: 'var(--bg2)' }}>
        <h3 className="font-condensed" style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px' }}>
          Need Help Choosing?
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px', maxWidth: '380px', margin: '10px auto 24px' }}>
          Share your vehicle details and our experts will suggest the right tyre or part.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/919022229979?text=Hi%20BOXBOX%20India%2C%20I%20read%20your%20guide%20and%20need%20help%20choosing."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
          >
            Chat on WhatsApp
          </a>
          <Link to="/products" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
