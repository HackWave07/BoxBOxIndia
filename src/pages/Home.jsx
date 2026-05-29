import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import TyreFinder from '../components/TyreFinder';
import HeroSlider from '../components/HeroSlider';
import GarageReels from '../components/GarageReels';
import SkeletonCard from '../components/SkeletonCard';
import ProtectedImage, { stopImageAction } from '../components/ProtectedImage';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Truck, Wrench, Gauge, Mountain, Navigation, Map, Zap, Crosshair, MapPin, Clock, Tent, Shield, Car, Gem, Battery, Star, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { getSafeApiUrl } from '../utils/media';

const API_URL = getSafeApiUrl();
import { updateSEO } from '../utils/seo';

import perfTrack from '../assets/performance-track.png';
import perfAT from '../assets/performance-at.png';
import perfCruiser from '../assets/performance-cruiser.png';
import perfTouring from '../assets/performance-touring.png';

import motoAdv from '../assets/moto-adv.png';
import motoAdvNew from '../assets/moto-adv-new.png';
import motoCruiser from '../assets/moto-cruiser.png';
import motoCruiserNew from '../assets/moto-cruiser-new.png';
import motoMotocross from '../assets/moto-motocross.png';
import motoMotocrossNew from '../assets/moto-motocross-new.png';
import motoSportTouring from '../assets/moto-sport-touring.png';
import motoSportTouringNew from '../assets/moto-sport-touring-new.png';
import motoSuperSports from '../assets/moto-super-sports.png';
import motoSuperSportsNew from '../assets/moto-super-sports-new.png';
import motoVintage from '../assets/moto-vintage.png';
import motoVintageNew from '../assets/moto-vintage-new.png';
import carHatchback from '../assets/car-hatchback.png';
import carSedan from '../assets/car-sedan.png';
import carSuv from '../assets/car-suv.png';
import carOffroad from '../assets/car-offroad.png';
import carSports from '../assets/car-sports.png';
import carEv from '../assets/car-ev.png';

import partBrakes from '../assets/part-brakes.png';
import partSuspension from '../assets/part-suspension.png';
import partChain from '../assets/part-chain.png';
import partEngine from '../assets/part-engine.png';
import partExhaust from '../assets/part-exhaust.png';
import partAccessories from '../assets/part-accessories.png';

const homeFeaturedFallbacks = [
  {
    title: 'Performance Motorcycle Tyres',
    eyebrow: 'Best Seller Range',
    copy: 'High-grip options for sport, touring, ADV, and premium street machines.',
    cta: 'Get Recommendation',
    href: 'https://wa.me/919022229979?text=Hi%20BOXBOX%20India%2C%20I%20need%20help%20choosing%20performance%20motorcycle%20tyres.'
  },
  {
    title: 'Premium Car Tyres',
    eyebrow: 'Curated Fitments',
    copy: 'Comfort, control, and wet-weather confidence for daily and performance cars.',
    cta: 'Ask an Expert',
    href: 'https://wa.me/919022229979?text=Hi%20BOXBOX%20India%2C%20I%20need%20help%20choosing%20premium%20car%20tyres.'
  },
  {
    title: 'ADV & Touring Picks',
    eyebrow: 'Road Ready',
    copy: 'Balanced tyre choices for long-distance riding, mixed roads, and Indian conditions.',
    cta: 'Find My Tyre',
    href: 'https://wa.me/919022229979?text=Hi%20BOXBOX%20India%2C%20I%20need%20help%20finding%20ADV%20or%20touring%20tyres.'
  },
  {
    title: 'Track & Street Upgrades',
    eyebrow: 'Performance Focus',
    copy: 'Sharper feedback and stronger cornering confidence from trusted premium brands.',
    cta: 'Chat on WhatsApp',
    href: 'https://wa.me/919022229979?text=Hi%20BOXBOX%20India%2C%20I%20need%20help%20with%20track%20or%20street%20tyres.'
  }
];

const FEATURED_REVIEW_IMAGES = [
  { id: 1,  src: '/assets/reviews/review-1.png',  alt: 'Verified customer review' },
  { id: 15, src: '/assets/reviews/review-15.png', alt: 'Verified customer review' },
  { id: 3,  src: '/assets/reviews/review-3.png',  alt: 'Verified customer review' },
];

const MOTO_BRAND_LOGOS = {
  'Michelin':    '/assets/logo/motorcycle_tyre/michelin.png',
  'Pirelli':     '/assets/logo/motorcycle_tyre/pirelli.png',
  'Metzeler':    '/assets/logo/motorcycle_tyre/metzeler.png',
  'Dunlop':      '/assets/logo/motorcycle_tyre/dunlop.png',
  'Shinko':      '/assets/logo/motorcycle_tyre/shinko.png',
  'BFGoodrich':  '/assets/logo/motorcycle_tyre/bfgoodrich.png',
  'Vredestein':  '/assets/logo/motorcycle_tyre/vredstein.png',
  'Roadcruza':   '/assets/logo/motorcycle_tyre/roadcruza.png',
  'Radar':       '/assets/logo/motorcycle_tyre/radar.png',
  'Bridgestone': '/assets/logo/motorcycle_tyre/bridgestone.png',
  'Goodyear':    '/assets/logo/motorcycle_tyre/goodyear.png',
  'Continental': '/assets/logo/motorcycle_tyre/continental.png',
  'Yokohama':    '/assets/logo/motorcycle_tyre/yokohama.png',
  'Apollo':      '/assets/logo/motorcycle_tyre/apollo.png',
  'CEAT':        '/assets/logo/motorcycle_tyre/ceat.png',
  'MRF':         '/assets/logo/motorcycle_tyre/mrf.png',
};

const CAR_BRAND_LOGOS = {
  'Michelin':    '/assets/logo/car_tyre/michelin.png',
  'Bridgestone': '/assets/logo/car_tyre/bridgestone.png',
  'Goodyear':    '/assets/logo/car_tyre/goodyear.png',
  'Continental': '/assets/logo/car_tyre/continental.png',
  'Pirelli':     '/assets/logo/car_tyre/pirelli.png',
  'Yokohama':    '/assets/logo/car_tyre/yokohama.png',
  'Apollo':      '/assets/logo/car_tyre/apollo.png',
  'CEAT':        '/assets/logo/car_tyre/ceat.png',
  'MRF':         '/assets/logo/car_tyre/mrf.png',
};

const PERF_BRAND_LOGOS = {
  'Brembo':     '/assets/logo/performance_part/brembo.png',
  'Ohlins':     '/assets/logo/performance_part/ohlins.png',
  'Akrapovic':  '/assets/logo/performance_part/Akrapovic.png',
  'Motul':      '/assets/logo/performance_part/motul.png',
  'K&N':        '/assets/logo/performance_part/k&n.png',
  'RK Chain':   '/assets/logo/performance_part/rk.png',
  'EBC Brakes': '/assets/logo/performance_part/ebcbrakes.png',
};

const PERF_LOGO_SIZES = {
  'Brembo':    { maxHeight: '44px', maxWidth: '140px' },
  'Ohlins':    { maxHeight: '44px', maxWidth: '130px' },
  'Akrapovic': { maxHeight: '44px', maxWidth: '155px' },
};

const HomeFeaturedFallbackCard = ({ item }) => (
  <div className="home-featured-fallback-card">
    <div>
      <p className="home-featured-fallback-eyebrow">{item.eyebrow}</p>
      <h3 className="font-condensed">{item.title}</h3>
      <p>{item.copy}</p>
    </div>
    <a href={item.href} target="_blank" rel="noopener noreferrer">
      {item.cta}
      <ArrowRight size={16} strokeWidth={2.4} />
    </a>
  </div>
);

const CarTyreCard = ({ cat, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Link
      to={cat.path}
      onContextMenu={stopImageAction}
      onDragStart={stopImageAction}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="category-card-premium"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
        textDecoration: 'none',
        background: '#000000',
        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isHovered
          ? (isDark ? '0 20px 50px rgba(0,0,0,0.7)' : '0 20px 50px rgba(0,0,0,0.25)')
          : (isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.1)'),
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: `fadeUp 0.6s ease-out forwards ${delay}s`,
        opacity: 0,
        zIndex: isHovered ? 10 : 1,
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background Image Layer - independent hover scaling */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        backgroundImage: `url(${cat.image})`,
        backgroundSize: cat.bgSize || 'cover',
        backgroundPosition: cat.bgPos || 'center center',
        backgroundRepeat: 'no-repeat',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }} />

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: isHovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6), transparent)'
          : 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3), transparent)',
        transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }} />
      {/* Content Layer */}
      <div className="category-card-premium-content" style={{ color: '#FFFFFF' }}>
        <h3 className="font-condensed category-card-premium-title" style={{
          fontWeight: '800',
          textTransform: 'uppercase',
          lineHeight: '1.1',
          letterSpacing: '1px',
          margin: 0,
          textShadow: '0 2px 12px rgba(0,0,0,0.8)'
        }}>
          {cat.name}
        </h3>
        <p style={{
          fontSize: '11px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginTop: '6px',
          color: 'rgba(255,255,255,0.7)',
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Explore Catalog <span style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', transform: isHovered ? 'translateX(4px)' : 'none' }}>&rarr;</span>
        </p>
      </div>
    </Link>
  );
};

const MotoCard = ({ cat, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Link 
      to={cat.path} 
      onContextMenu={stopImageAction}
      onDragStart={stopImageAction}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="category-card-premium"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
        textDecoration: 'none',
        background: isDark ? '#0a0a0a' : '#111111',
        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isHovered 
          ? (isDark ? '0 20px 50px rgba(0,0,0,0.7)' : '0 20px 50px rgba(0,0,0,0.25)')
          : (isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.1)'),
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: `fadeUp 0.6s ease-out forwards ${delay}s`,
        opacity: 0,
        zIndex: isHovered ? 10 : 1
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Image Layer - Full controlled scaling */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ProtectedImage
          src={cat.image} 
          alt={cat.name}
          style={{ width: '100%', height: '100%' }}
          imgStyle={{
            height: '100%',
            width: '100%',
            objectFit: cat.objectFit || 'contain', // Guarantee no cutting of the tyre visual unless specified
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered 
              ? `scale(${cat.baseScale ? cat.baseScale + 0.05 : 1.05})` 
              : `scale(${cat.baseScale || 1.0})`,
          }}
        />
      </div>

      {/* Gradient Overlay - ALWAYS DARK for premium contrast */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: isHovered 
              ? 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6), transparent)'
              : 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3), transparent)',
        transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }} />

      {/* Content Layer */}
      <div className="category-card-premium-content" style={{ color: '#FFFFFF' }}>
        <h3 className="font-condensed category-card-premium-title" style={{ 
          fontWeight: '800', 
          textTransform: 'uppercase', 
          lineHeight: '1.1',
          letterSpacing: '1px',
          margin: 0,
          textShadow: '0 2px 12px rgba(0,0,0,0.8)'
        }}>
          {cat.name}
        </h3>
        <p style={{ 
          fontSize: '11px', // Scaled down
          fontWeight: '800', 
          textTransform: 'uppercase', 
          letterSpacing: '2px', 
          marginTop: '6px',
          color: 'rgba(255,255,255,0.7)',
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Explore Catalog <span style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', transform: isHovered ? 'translateX(4px)' : 'none' }}>&rarr;</span>
        </p>
      </div>
    </Link>
  );
};

const PerformanceCard = ({ cat, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Link 
      to={cat.path} 
      onContextMenu={stopImageAction}
      onDragStart={stopImageAction}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="performance-card-premium"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
        textDecoration: 'none',
        background: '#000000',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: isHovered 
          ? (isDark ? '0 20px 50px rgba(0,0,0,0.7)' : '0 20px 50px rgba(0,0,0,0.25)')
          : (isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)'),
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: isHovered ? 10 : 1,
        animation: `fadeUp 0.6s ease-out forwards ${delay}s`,
        opacity: 0,
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background Image Layer — independent scaling */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: 0,
        backgroundImage: `url(${cat.image})`,
        backgroundSize: cat.bgSize || 'contain',
        backgroundPosition: cat.bgPos || 'center center',
        backgroundRepeat: 'no-repeat',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }} />
      {/* Premium Overlay Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: isHovered 
              ? 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent)'
              : 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)',
        transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }} />

      {/* Content Layer */}
      <div className="performance-card-premium-content" style={{ color: '#FFFFFF' }}>
        <h3 className="font-condensed performance-card-premium-title" style={{ 
          fontWeight: '900', 
          textTransform: 'uppercase', 
          lineHeight: '1',
          margin: 0,
          letterSpacing: '0.5px'
        }}>
          {cat.name}
        </h3>
        <p style={{ 
          fontSize: '12px', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          letterSpacing: '2px', 
          marginTop: '8px',
          color: 'rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Explore Range <span style={{ transition: 'transform 0.3s ease', transform: isHovered ? 'translateX(4px)' : 'none' }}>&rarr;</span>
        </p>
      </div>
    </Link>
  );
};

const ReviewImageCard = ({ src, alt }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        boxShadow: isHovered ? 'var(--shadow-hover)' : 'var(--shadow)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ minHeight: '220px', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={src}
          alt={alt}
          loading="eager"
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
      <div style={{
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} fill="var(--text)" color="var(--text)" />
          ))}
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: 'var(--text-muted)',
        }}>
          Verified Review
        </span>
      </div>
    </div>
  );
};

export default function Home() {
  const [featured, setFeatured] = useState([]);

  const featuredFallbackSlots = homeFeaturedFallbacks.slice(featured.length, 4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products`);
        const productsArray = Array.isArray(data) ? data : (data?.data || []);
        setFeatured(productsArray.filter(product => product?.featuredOnHome).slice(0, 4));
      } catch (error) {
        console.error('Error fetching home data', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const origin = window.location.origin;
    updateSEO({
      title: "Buy Premium Motorcycle Tyres Online in India | BoxBox India",
      description: "Shop the best premium motorcycle tyres online in India. Explore top superbike tyres, tubeless bike tyres, and high-grip motorcycle tyres from Pirelli, Metzeler, and Michelin at BoxBox India.",
      canonical: origin,
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${origin}/#organization`,
            "name": "BoxBox India",
            "url": origin,
            "logo": {
              "@type": "ImageObject",
              "url": `${origin}/favicon.png`
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-9999999999",
              "contactType": "customer service"
            }
          },
          {
            "@type": "WebSite",
            "@id": `${origin}/#website`,
            "url": origin,
            "name": "BoxBox India",
            "publisher": {
              "@id": `${origin}/#organization`
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${origin}/products?search={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          }
        ]
      }
    });
  }, []);

  return (
    <div>
      {/* 1. HERO */}
      <HeroSlider />

      {/* 2. TRUST STRIP */}
      <section className="home-trust-strip" aria-label="BoxBox India service promises">
        <div className="section-full home-trust-strip-inner">
          {[
            { icon: ShieldCheck, label: 'Genuine Products' },
            { icon: Truck, label: 'Fast Delivery' },
            { icon: Wrench, label: 'Expert Support' },
            { icon: MapPin, label: 'Installation Help' },
            { icon: Gem, label: 'Premium Brands' }
          ].map(({ icon: Icon, label }) => (
            <div className="home-trust-item" key={label}>
              <Icon size={18} strokeWidth={2.2} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. GARAGE REELS */}
      <GarageReels />

      {/* 3. TYRE FINDER */}
      <section className="home-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'radial-gradient(ellipse at bottom, var(--bg2), transparent)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="font-condensed" style={{ fontSize: '28px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>Find Tyres For Your Vehicle</h2>
        <TyreFinder />
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="home-section">
        <div className="section-full">
        <div className="section-heading-row" style={{ marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Featured Collection</h2>
            <p style={{ color: 'var(--text-muted)' }}>The best in class performance tyres</p>
          </div>
          <Link to="/products" className="btn-secondary">View All</Link>
        </div>
        
        <div className="responsive-grid" style={{ gap: '24px' }}>
          {featured.map(product => (
            <ProductCard key={product._id || product.id} product={{...product, id: product._id || product.id}} />
          ))}
          {featuredFallbackSlots.map(item => (
            <HomeFeaturedFallbackCard key={item.title} item={item} />
          ))}
        </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY (Explore by Performance) */}
      <section className="home-section" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="section-full">
          <h2 className="font-condensed" style={{ fontSize: '40px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '48px', letterSpacing: '1px', textAlign: 'center' }}>Explore by Performance</h2>
          
          <div className="home-category-grid">
            {[
              { 
                name: 'Track / Street', 
                image: perfTrack,
                path: '/products?type=tyre&vehicle=motorcycle&category=sport',
                bgSize: '85%',
                bgPos: 'center 35%'
              },
              { 
                name: 'All Terrain', 
                image: perfAT,
                path: '/products?type=tyre&vehicle=motorcycle&category=off-road',
                bgSize: '80%',
                bgPos: 'center 35%'
              },
              { 
                name: 'Cruiser', 
                image: perfCruiser,
                path: '/products?type=tyre&vehicle=motorcycle&category=cruiser',
                bgSize: '85%',
                bgPos: 'center 35%'
              },
              { 
                name: 'Sport / Touring', 
                image: perfTouring,
                path: '/products?type=tyre&vehicle=motorcycle&category=touring',
                bgSize: '85%',
                bgPos: 'center 35%'
              }
            ].map((cat, index) => (
              <PerformanceCard key={cat.name} cat={cat} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. MOTORCYCLE TYRES & BRAND BAR */}
      <section className="home-section" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="section-full">
          
          <div className="section-heading-row" style={{ marginBottom: '40px' }}>
            <h2 className="font-condensed" style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Motorcycle Tyres</h2>
            <Link to="/products?type=tyre" className="font-condensed brand-link" style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>VIEW ALL →</Link>
          </div>

          <div className="home-category-grid">
            {[
              { name: 'ADV & Dual Sport', image: motoAdvNew, path: '/products?type=tyre&vehicle=motorcycle&category=adv' },
              { name: 'Cruisers', image: motoCruiserNew, path: '/products?type=tyre&vehicle=motorcycle&category=cruiser' },
              { name: 'Motocross', image: motoMotocrossNew, path: '/products?type=tyre&vehicle=motorcycle&category=motocross' },
              { name: 'Sport Touring', image: motoSportTouringNew, path: '/products?type=tyre&vehicle=motorcycle&category=touring', baseScale: 1.08 },
              { name: 'Super Sports', image: motoSuperSportsNew, path: '/products?type=tyre&vehicle=motorcycle&category=sport', baseScale: 1.08 },
              { name: 'Vintage', image: motoVintageNew, path: '/products?type=tyre&vehicle=motorcycle&category=vintage', baseScale: 1.08 }
            ].map((cat, index) => (
              <MotoCard key={cat.name} cat={cat} delay={index * 0.1} />
            ))}
          </div>

          <div className="home-brands-container" style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginTop: '40px' }}>
            <p className="home-brands-title" style={{ fontSize: '12px', fontWeight: '700', color: '#777', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' }}>Authorised Dealer — Premium Brands</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px 16px', flexWrap: 'wrap' }}>
              {['Michelin', 'Pirelli', 'Metzeler', 'Dunlop', 'Shinko', 'BFGoodrich', 'Vredestein', 'Roadcruza', 'Radar', 'Bridgestone', 'Goodyear', 'Continental', 'Yokohama', 'Apollo', 'CEAT', 'MRF'].map(brand => (
                <Link
                  key={brand}
                  to={`/products?type=tyre&vehicle=motorcycle&brand=${brand}`}
                  style={{
                    textDecoration: 'none',
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    padding: '10px 22px',
                    borderRadius: '12px',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '120px',
                    height: '76px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={MOTO_BRAND_LOGOS[brand]}
                    alt={brand}
                    style={{ maxHeight: '50px', maxWidth: '148px', width: 'auto', height: 'auto', objectFit: 'contain' }}
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CAR TYRES & BRAND BAR */}
      <section className="home-section" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="section-full">
          
          <div className="section-heading-row" style={{ marginBottom: '40px' }}>
            <h2 className="font-condensed" style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Car Tyres</h2>
            <Link to="/products?type=tyre" className="font-condensed brand-link" style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>VIEW ALL →</Link>
          </div>

          <div className="home-category-grid">
            {[
              { name: 'Hatchback / Small Cars', image: carHatchback, path: '/products?type=tyre&vehicle=car&category=hatchback', objectFit: 'contain', baseScale: 0.8, objectPosition: 'center 60%' },
              { name: 'Sedan / Premium', image: carSedan, path: '/products?type=tyre&vehicle=car&category=sedan', objectFit: 'contain', baseScale: 1.0 },
              { name: 'SUV / MUV', image: carSuv, path: '/products?type=tyre&vehicle=car&category=suv', objectFit: 'contain', baseScale: 1.0 },
              { name: 'All-Terrain / Offroad', image: carOffroad, path: '/products?type=tyre&vehicle=car&category=off-road', objectFit: 'contain', baseScale: 1.0 },
              { name: 'Performance / Sports', image: carSports, path: '/products?type=tyre&vehicle=car&category=sport', objectFit: 'contain', baseScale: 1.0 },
              { name: 'EV / Electric', image: carEv, path: '/products?type=tyre&vehicle=car&category=ev', objectFit: 'contain', baseScale: 1.0 }
            ].map((cat, index) => (
              <CarTyreCard key={cat.name} cat={cat} delay={index * 0.1} />
            ))}
          </div>

          <div className="home-brands-container" style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginTop: '40px' }}>
            <p className="home-brands-title" style={{ fontSize: '12px', fontWeight: '700', color: '#777', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' }}>Authorised Dealer — Premium Brands</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px 16px', flexWrap: 'wrap' }}>
              {['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli', 'Yokohama', 'Apollo', 'CEAT', 'MRF'].map(brand => (
                <Link
                  key={brand}
                  to={`/products?type=tyre&vehicle=car&brand=${brand}`}
                  style={{
                    textDecoration: 'none',
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    padding: '10px 22px',
                    borderRadius: '12px',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '120px',
                    height: '76px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={CAR_BRAND_LOGOS[brand]}
                    alt={brand}
                    style={{ maxHeight: '50px', maxWidth: '148px', width: 'auto', height: 'auto', objectFit: 'contain' }}
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHAT RIDERS SAY (TESTIMONIALS) */}
      <section className="home-section" style={{ background: 'var(--bg-gradient)', borderTop: '1px solid var(--border)' }}>
        <div className="section-full">

          <div className="section-heading-row" style={{ marginBottom: '48px' }}>
            <div>
              <h2 className="font-condensed" style={{ fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1', marginBottom: '10px' }}>What Riders Say</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>Real experiences from the BoxBoxIndia community</p>
            </div>
            <Link to="/reviews" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Show All Reviews <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {FEATURED_REVIEW_IMAGES.map((review) => (
              <ReviewImageCard key={review.id} src={review.src} alt={review.alt} />
            ))}
          </div>

        </div>
      </section>

      {/* 8. PERFORMANCE PARTS (Vertical Expansion) */}
      <section className="home-section" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="section-full">
          
          <div className="section-heading-row" style={{ marginBottom: '40px' }}>
            <h2 className="font-condensed" style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Performance Parts</h2>
            <Link to="/products?type=part" className="font-condensed brand-link" style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>EXPLORE CATALOG &rarr;</Link>
          </div>

          <div className="home-category-grid">
            {[
              { name: 'Brakes', image: partBrakes, path: '/products?category=brakes', bgSize: '80%', bgPos: 'center 40%' },
              { name: 'Suspension', image: partSuspension, path: '/products?category=suspension', bgSize: '65%', bgPos: 'center 30%' },
              { name: 'Chain & Sprockets', image: partChain, path: '/products?category=chain-sprockets', bgSize: '85%', bgPos: 'center 40%' },
              { name: 'Engine Upgrades', image: partEngine, path: '/products?category=engine', bgSize: '80%', bgPos: 'center 40%' },
              { name: 'Exhaust Systems', image: partExhaust, path: '/products?category=exhaust', bgSize: '85%', bgPos: 'center 45%' },
              { name: 'Accessories', image: partAccessories, path: '/products?category=accessories', bgSize: '75%', bgPos: 'center 35%' }
            ].map((cat, index) => (
              <CarTyreCard key={cat.name} cat={cat} delay={index * 0.1} />
            ))}
          </div>

          <div className="home-brands-container" style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginTop: '40px' }}>
            <p className="home-brands-title" style={{ fontSize: '12px', fontWeight: '700', color: '#777', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' }}>Premium Parts Manufacturers</p>
            <div className="home-brands-list" style={{ display: 'flex', justifyContent: 'center', gap: '12px 16px', flexWrap: 'wrap' }}>
              {['Brembo', 'Ohlins', 'Akrapovic', 'Motul', 'K&N', 'RK Chain', 'EBC Brakes'].map(brand => (
                <Link
                  key={brand}
                  to={`/products?brand=${brand}`}
                  className="brand-chip"
                  style={{
                    textDecoration: 'none',
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '120px',
                    height: '64px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={PERF_BRAND_LOGOS[brand]}
                    alt={brand}
                    style={{ maxHeight: PERF_LOGO_SIZES[brand]?.maxHeight || '40px', maxWidth: PERF_LOGO_SIZES[brand]?.maxWidth || '120px', width: 'auto', height: 'auto', objectFit: 'contain' }}
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
