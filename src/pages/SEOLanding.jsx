import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Products from './Products';
import { updateSEO } from '../utils/seo';

const LANDING_METADATA = {
  'motorcycle-tyres': {
    title: 'Buy Premium Motorcycle Tyres Online in India | BoxBox India',
    description: 'Shop the best premium motorcycle tyres online in India. Explore top superbike tyres, tubeless bike tyres, and high-grip motorcycle tyres from Pirelli, Metzeler, and Michelin at BoxBox India.',
    h1: 'Premium Motorcycle Tyres & Performance Tyres India',
    intro: 'Welcome to BoxBox India, the ultimate destination for premium motorcycle tyres online in India. Whether you are searching for high-performance track day rubbers, long-lasting tubeless motorcycle tyres for touring, or dual-sport ADV tyres, we stock the world\'s best brands. Choose from Metzeler, Pirelli, and Michelin, and experience peak control and grip.',
    preFilter: 'sport', // Matches category 'sport' for bikes
    categoryLabel: 'Sport / Motorcycle',
    schema: (origin) => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${origin}/motorcycle-tyres`,
          "url": `${origin}/motorcycle-tyres`,
          "name": "Buy Premium Motorcycle Tyres Online in India | BoxBox India",
          "description": "Shop the best premium motorcycle tyres online in India. Explore top superbike tyres, tubeless bike tyres, and high-grip motorcycle tyres from Pirelli, Metzeler, and Michelin at BoxBox India."
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": origin
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Motorcycle Tyres",
              "item": `${origin}/motorcycle-tyres`
            }
          ]
        }
      ]
    })
  },
  'bike-tyres': {
    title: 'Buy Premium Bike Tyres Online at Best Prices | BoxBox India',
    description: 'Shop premium tubeless bike tyres and superbike tyres online in India. Choose from high-performance motorcycle tyres from top brands like Michelin, Pirelli, and Metzeler at BoxBox India.',
    h1: 'High Performance Premium Bike Tyres Online',
    intro: 'Upgrade your ride with premium bike tyres selected for maximum safety, handling, and cornering performance. BoxBox India provides a curated selection of tubeless motorcycle tyres and high-grip compounds that elevate your daily commute or weekend twisties. Find your perfect fit direct from global manufacturers.',
    preFilter: 'touring', // Matches category 'touring'
    categoryLabel: 'Touring / Bike',
    schema: (origin) => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${origin}/bike-tyres`,
          "url": `${origin}/bike-tyres`,
          "name": "Buy Premium Bike Tyres Online at Best Prices | BoxBox India",
          "description": "Shop premium tubeless bike tyres and superbike tyres online in India. Choose from high-performance motorcycle tyres from top brands like Michelin, Pirelli, and Metzeler at BoxBox India."
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": origin
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Bike Tyres",
              "item": `${origin}/bike-tyres`
            }
          ]
        }
      ]
    })
  },
  'superbike-tyres': {
    title: 'Premium Superbike Tyres India - Track & Street | BoxBox India',
    description: 'Explore high-performance superbike tyres in India. High grip tubeless motorcycle tyres for track day and street riders. Buy premium tyres from Pirelli, Michelin, and Metzeler.',
    h1: 'Authorised Premium Superbike Tyres in India',
    intro: 'Unleash the full potential of your machine with our specialized range of superbike tyres in India. Built for extreme lean angles, track-ready speeds, and superior braking response, our premium tyres from Metzeler Racetec, Pirelli Diablo Rosso, and Michelin Power series guarantee maximum confidence in every corner.',
    preFilter: 'sport',
    categoryLabel: 'Superbike / Sport',
    schema: (origin) => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${origin}/superbike-tyres`,
          "url": `${origin}/superbike-tyres`,
          "name": "Premium Superbike Tyres India - Track & Street | BoxBox India",
          "description": "Explore high-performance superbike tyres in India. High grip tubeless motorcycle tyres for track day and street riders. Buy premium tyres from Pirelli, Michelin, and Metzeler."
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": origin
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Superbike Tyres",
              "item": `${origin}/superbike-tyres`
            }
          ]
        }
      ]
    })
  },
  'premium-tyres': {
    title: 'Buy Premium Tyres Online - Cars & Motorcycles | BoxBox India',
    description: 'Get premium tyres online in India for cars, bikes, and superbikes. Experience maximum grip, performance, and durability from top global brands at BoxBox India.',
    h1: 'Explore Our Complete Premium Tyres Collection',
    intro: 'At BoxBox India, we source only the absolute best. Our premium tyres collection spans across elite hyper-sports motorcycle tyres and ultra-high-performance car tyres. Designed for drivers and riders who demand zero compromises in traction, luxury, and wet-weather safety.',
    preFilter: '',
    categoryLabel: 'Premium Collection',
    schema: (origin) => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${origin}/premium-tyres`,
          "url": `${origin}/premium-tyres`,
          "name": "Buy Premium Tyres Online - Cars & Motorcycles | BoxBox India",
          "description": "Get premium tyres online in India for cars, bikes, and superbikes. Experience maximum grip, performance, and durability from top global brands at BoxBox India."
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": origin
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Premium Tyres",
              "item": `${origin}/premium-tyres`
            }
          ]
        }
      ]
    })
  }
};

export default function SEOLanding({ type }) {
  const meta = LANDING_METADATA[type];
  const origin = window.location.origin;

  useEffect(() => {
    if (meta) {
      updateSEO({
        title: meta.title,
        description: meta.description,
        canonical: `${origin}/${type}`,
        schema: meta.schema(origin)
      });
    }
  }, [type, meta, origin]);

  if (!meta) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Landing page not found.</div>;
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Premium Hero Section */}
      <section style={{
        padding: '60px 24px 40px',
        background: 'linear-gradient(to bottom, var(--bg2), transparent)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Breadcrumb Navigation for SEO */}
          <nav style={{ marginBottom: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>&rsaquo;</span>
            <span style={{ color: 'var(--text)' }}>{meta.categoryLabel}</span>
          </nav>
          
          <h1 className="font-condensed" style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '16px',
            lineHeight: '1.1',
            color: 'var(--text)'
          }}>{meta.h1}</h1>
          
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: 'var(--text-muted)',
            marginBottom: '24px'
          }}>{meta.intro}</p>

          {/* Core internal linking */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {type !== 'motorcycle-tyres' && <Link to="/motorcycle-tyres" style={{ color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>Motorcycle Tyres</Link>}
            {type !== 'bike-tyres' && <Link to="/bike-tyres" style={{ color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>Bike Tyres</Link>}
            {type !== 'superbike-tyres' && <Link to="/superbike-tyres" style={{ color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>Superbike Tyres</Link>}
            {type !== 'premium-tyres' && <Link to="/premium-tyres" style={{ color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>Premium Tyres</Link>}
          </div>
        </div>
      </section>

      {/* Embed Products List with Pre-Filter Category */}
      <Products preFilterCategory={meta.preFilter} />
    </div>
  );
}
