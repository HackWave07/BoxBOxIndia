import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import TyreFinder from '../components/TyreFinder';
import HeroSlider from '../components/HeroSlider';
import SkeletonCard from '../components/SkeletonCard';
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

const CarTyreCard = ({ cat, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Link
      to={cat.path}
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
        <img 
          src={cat.image} 
          alt={cat.name}
          style={{
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

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/products`);
        
        let productsArray = [];
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data && Array.isArray(data.data)) {
          productsArray = data.data;
        }
        
        setFeatured(productsArray.slice(0, 4));
        setLoading(false);

        // Fetch featured reviews
        const reviewsRes = await axios.get(`${API_URL}/reviews/featured`);
        setReviews(reviewsRes.data);
        setReviewsLoading(false);
      } catch (error) {
        console.error('Error fetching home data', error);
        setLoading(false);
        setReviewsLoading(false);
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
      {/* 1. HERO SLIDER */}
      <HeroSlider />

      {/* 2. TYRE FINDER */}
      <section className="home-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'radial-gradient(ellipse at bottom, var(--bg2), transparent)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="font-condensed" style={{ fontSize: '28px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>Find Tyres For Your Vehicle</h2>
        <TyreFinder />
        </div>
      </section>

      {/* 2. TRUST BADGES */}
      <section className="home-section" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-full" style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Truck size={32} />
          <div>
            <h4 style={{ fontWeight: '700' }}>Free Fast Delivery</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>On all orders across India</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={32} />
          <div>
            <h4 style={{ fontWeight: '700' }}>100% Genuine</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Direct from manufacturers</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Wrench size={32} />
          <div>
            <h4 style={{ fontWeight: '700' }}>Expert Fitment</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Free installation support</p>
          </div>
        </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
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
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : Array.isArray(featured) && featured.length > 0 ? (
            featured.map(product => (
              <ProductCard key={product._id || product.id} product={{...product, id: product._id || product.id}} />
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No products available</p>
          )}
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
                path: '/products?category=sport',
                bgSize: '85%',
                bgPos: 'center 35%'
              },
              { 
                name: 'All Terrain', 
                image: perfAT,
                path: '/products?category=off-road',
                bgSize: '80%',
                bgPos: 'center 35%'
              },
              { 
                name: 'Cruiser', 
                image: perfCruiser,
                path: '/products?category=cruiser',
                bgSize: '85%',
                bgPos: 'center 35%'
              },
              { 
                name: 'Sport / Touring', 
                image: perfTouring,
                path: '/products?category=touring',
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
            <Link to="/products" className="font-condensed brand-link" style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>VIEW ALL &rarr;</Link>
          </div>

          <div className="home-category-grid">
            {[
              { name: 'ADV & Dual Sport', image: motoAdvNew, path: '/products?category=adv' },
              { name: 'Cruisers', image: motoCruiserNew, path: '/products?category=cruiser' },
              { name: 'Motocross', image: motoMotocrossNew, path: '/products?category=motocross' },
              { name: 'Sport Touring', image: motoSportTouringNew, path: '/products?category=touring', baseScale: 1.08 },
              { name: 'Super Sports', image: motoSuperSportsNew, path: '/products?category=sport', baseScale: 1.08 },
              { name: 'Vintage', image: motoVintageNew, path: '/products?category=vintage', baseScale: 1.08 }
            ].map((cat, index) => (
              <MotoCard key={cat.name} cat={cat} delay={index * 0.1} />
            ))}
          </div>

          <div className="home-brands-container">
            <p className="home-brands-title">Authorised Dealer — Premium Brands</p>
            <div className="home-brands-list">
              {['Michelin', 'Pirelli', 'Metzeler', 'Dunlop', 'Shinko', 'BFGoodrich', 'Vredestein', 'Roadcruza', 'Radar', 'Bridgestone', 'Goodyear', 'Continental', 'Yokohama', 'Apollo', 'CEAT', 'MRF', 'Brembo', 'Ohlins', 'Akrapovic', 'Motul', 'K&N', 'RK Chain', 'EBC Brakes'].map(brand => (
                <Link 
                  key={brand} 
                  to={`/products?brand=${brand}`}
                  className="brand-logo" 
                  style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    textTransform: 'uppercase', 
                    fontFamily: "'Barlow Condensed', sans-serif", 
                    letterSpacing: '1px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.textShadow = '0 0 20px rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  {brand}
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
            <Link to="/products" className="font-condensed brand-link" style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>VIEW ALL &rarr;</Link>
          </div>

          <div className="home-category-grid">
            {[
              { name: 'Hatchback / Small Cars', image: carHatchback, path: '/products?category=hatchback', objectFit: 'contain', baseScale: 0.8, objectPosition: 'center 60%' },
              { name: 'Sedan / Premium', image: carSedan, path: '/products?category=sedan', objectFit: 'contain', baseScale: 1.0 },
              { name: 'SUV / MUV', image: carSuv, path: '/products?category=suv', objectFit: 'contain', baseScale: 1.0 },
              { name: 'All-Terrain / Offroad', image: carOffroad, path: '/products?category=off-road', objectFit: 'contain', baseScale: 1.0 },
              { name: 'Performance / Sports', image: carSports, path: '/products?category=sport', objectFit: 'contain', baseScale: 1.0 },
              { name: 'EV / Electric', image: carEv, path: '/products?category=ev', objectFit: 'contain', baseScale: 1.0 }
            ].map((cat, index) => (
              <CarTyreCard key={cat.name} cat={cat} delay={index * 0.1} />
            ))}
          </div>

          <div className="home-brands-container">
            <p className="home-brands-title">Authorised Dealer — Premium Brands</p>
            <div className="home-brands-list">
              {['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli', 'Yokohama', 'Apollo', 'CEAT', 'MRF'].map(brand => (
                <Link 
                  key={brand} 
                  to={`/products?brand=${brand}`}
                  style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    textTransform: 'uppercase', 
                    fontFamily: "'Barlow Condensed', sans-serif", 
                    letterSpacing: '1px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'inline-block',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.textShadow = '0 0 20px rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHAT RIDERS SAY (TESTIMONIALS) */}
      <section className="home-section" style={{ background: 'var(--bg-gradient)' }}>
        <div className="section-full">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>
            <h2 className="font-condensed" style={{ fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1' }}>What Riders Say</h2>
            <p style={{ color: '#777', fontSize: '16px', fontWeight: '600' }}>4.9 / 5 from 200+ reviews</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {reviewsLoading ? (
               [...Array(3)].map((_, i) => (
                <div key={i} className="glass-panel" style={{ padding: '40px', borderRadius: '12px', border: '1px solid var(--border)', minHeight: '200px' }}>
                  <div className="skeleton-loader" style={{ height: '20px', width: '40%', marginBottom: '20px' }} />
                  <div className="skeleton-loader" style={{ height: '60px', width: '100%', marginBottom: '20px' }} />
                  <div className="skeleton-loader" style={{ height: '20px', width: '30%' }} />
                </div>
              ))
            ) : reviews.length > 0 ? (
              reviews.map((rev, i) => (
                <div key={rev._id} className="glass-panel animate-lift" style={{ padding: '40px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                      {[...Array(5)].map((_, j) => <Star key={j} size={20} fill={j < rev.rating ? "var(--text)" : "transparent"} color="var(--text)" />)}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '32px' }}>"{rev.comment}"</p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '700', color: 'var(--text)', fontSize: '15px' }}>{rev.userName}</p>
                      {rev.product && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Verified Buyer — {rev.product.brand} {rev.product.name}</p>
                      )}
                    </div>
                    {rev.product && (
                      <Link to={`/product/${rev.product._id}`} style={{ color: 'var(--text)', opacity: 0.5 }}>
                        <ArrowRight size={18} />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1' }}>No verified reviews yet. Join our community to share your experience!</p>
            )}
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

          <div className="home-brands-container">
            <p className="home-brands-title">Premium Parts Manufacturers</p>
            <div className="home-brands-list">
              {['Brembo', 'Ohlins', 'Akrapovic', 'Motul', 'K&N', 'RK Chain', 'EBC Brakes'].map(brand => (
                <Link 
                  key={brand} 
                  to={`/products?brand=${brand}`}
                  style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    textTransform: 'uppercase', 
                    fontFamily: "'Barlow Condensed', sans-serif", 
                    letterSpacing: '1px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'inline-block',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.textShadow = '0 0 20px rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
