import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// ─── Menu Data ────────────────────────────────────────────────
const TYRES_MENU = {
  columns: [
    {
      heading: 'Categories',
      items: [
        { label: 'ADV & Dual Sport', href: '/products?type=tyre&category=ADV+%26+Dual+Sport' },
        { label: 'Sport', href: '/products?type=tyre&category=Sport' },
        { label: 'Touring', href: '/products?type=tyre&category=Touring' },
        { label: 'Cruiser', href: '/products?type=tyre&category=Cruiser' },
        { label: 'Dirt / Off-road', href: '/products?type=tyre&category=Off-Road' },
        { label: 'Scooter', href: '/products?type=tyre&category=Scooter' },
        { label: 'Vintage', href: '/products?type=tyre&category=Vintage' },
      ],
    },
    {
      heading: 'Popular Brands',
      items: [
        { label: 'Michelin', href: '/products?type=tyre&brand=Michelin' },
        { label: 'Pirelli', href: '/products?type=tyre&brand=Pirelli' },
        { label: 'Bridgestone', href: '/products?type=tyre&brand=Bridgestone' },
        { label: 'Metzeler', href: '/products?type=tyre&brand=Metzeler' },
        { label: 'Dunlop', href: '/products?type=tyre&brand=Dunlop' },
        { label: 'CEAT', href: '/products?type=tyre&brand=CEAT' },
        { label: 'MRF', href: '/products?type=tyre&brand=MRF' },
      ],
    },
    {
      heading: 'Popular Tyres',
      items: [
        { label: 'Road 6', href: '/products?type=tyre&brand=Michelin' },
        { label: 'Diablo Rosso', href: '/products?type=tyre&brand=Pirelli' },
        { label: 'Battlax', href: '/products?type=tyre&brand=Bridgestone' },
        { label: 'Tourance', href: '/products?type=tyre&brand=Metzeler' },
        { label: 'Sportmax', href: '/products?type=tyre&brand=Dunlop' },
      ],
    },
    {
      heading: 'Quick Links',
      items: [
        { label: 'Shop All Tyres', href: '/products?type=tyre', highlight: true },
        { label: 'Tyre Finder', href: '/' },
        { label: 'Best Tyres Guide', href: '/guides/how-to-choose-tyres' },
      ],
    },
  ],
};

const PARTS_MENU = {
  columns: [
    {
      heading: 'Categories',
      items: [
        { label: 'Brakes', href: '/products?type=part&category=Brakes' },
        { label: 'Suspension', href: '/products?type=part&category=Suspension' },
        { label: 'Engine Parts', href: '/products?type=part&category=Engine' },
        { label: 'Electrical', href: '/products?type=part&category=Electrical' },
        { label: 'Accessories', href: '/products?type=part&category=Accessories' },
      ],
    },
    {
      heading: 'Brands',
      items: [
        { label: 'Bosch', href: '/products?type=part&brand=Bosch' },
        { label: 'NGK', href: '/products?type=part&brand=NGK' },
        { label: 'Brembo', href: '/products?type=part&brand=Brembo' },
        { label: 'Castrol', href: '/products?type=part&brand=Castrol' },
      ],
    },
    {
      heading: 'Popular Parts',
      items: [
        { label: 'Brake Pads', href: '/products?type=part&category=Brakes' },
        { label: 'Shock Absorbers', href: '/products?type=part&category=Suspension' },
        { label: 'Air Filters', href: '/products?type=part&category=Engine' },
      ],
    },
    {
      heading: 'Quick Links',
      items: [
        { label: 'Shop All Parts', href: '/products?type=part', highlight: true },
        { label: 'Installation', href: '/guides' },
        { label: 'Maintenance', href: '/guides' },
      ],
    },
  ],
};

const GUIDES_MENU = [
  { label: 'All Guides', href: '/guides' },
  { label: 'Size Guide', href: '/guides/bike-tyre-size-guide' },
  { label: 'Choosing Tyres', href: '/guides/how-to-choose-tyres' },
  { label: 'Performance', href: '/guides/touring-vs-performance' },
];

// ─── Column ───────────────────────────────────────────────────
function MenuColumn({ col }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p style={{
        fontSize: '10px', fontWeight: '800', letterSpacing: '1px',
        textTransform: 'uppercase', color: 'var(--text)',
        marginBottom: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '6px',
      }}>
        {col.heading}
      </p>
      {col.items.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          style={{
            fontSize: '13px',
            fontWeight: item.highlight ? '700' : '400',
            color: item.highlight ? 'var(--text)' : 'var(--text-muted)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = item.highlight ? 'var(--text)' : 'var(--text-muted)'}
        >
          {item.highlight && <ChevronRight size={12} />}
          {item.label}
        </Link>
      ))}
    </div>
  );
}

// ─── Absolute mega dropdown ──────────────────────────────
function MegaDropdown({ menu, visible }) {
  return (
    <div
      className="mega-dropdown-container"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        width: '100%',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        zIndex: 998,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-4px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      {menu.columns.map((col) => (
        <MenuColumn key={col.heading} col={col} />
      ))}
    </div>
  );
}

// ─── Simple Guides dropdown (absolute) ──────────────────
function GuidesDropdown({ visible, left }) {
  return (
    <div
      className="guides-dropdown-container"
      style={{
        position: 'absolute',
        top: '100%',
        left: left || 0,
        minWidth: '200px',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '0 0 8px 8px',
        borderTop: 'none',
        padding: '6px 0',
        boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
        zIndex: 998,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-4px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      {GUIDES_MENU.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          style={{
            display: 'block', padding: '8px 20px',
            fontSize: '13px', fontWeight: '400',
            color: 'var(--text-muted)', textDecoration: 'none',
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg2)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

// ─── Main MegaMenu ────────────────────────────────────────────
export default function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [guidesLeft, setGuidesLeft] = useState(0);
  const leaveTimer = useRef(null);
  const guidesRef = useRef(null);

  const open = (name) => {
    clearTimeout(leaveTimer.current);
    setActiveMenu(name);
    if (name === 'GUIDES' && guidesRef.current) {
        setGuidesLeft(guidesRef.current.offsetLeft);
    }
  };

  const close = () => {
    leaveTimer.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const keep = () => clearTimeout(leaveTimer.current);

  const NAV_LABELS = ['TYRES', 'PARTS', 'GUIDES'];

  return (
    <>
      {/* ── Secondary bar ─────────────────────────────── */}
      <div
        className="desktop-only"
        style={{
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
        }}
      >
        <div className="section-full" style={{ display: 'flex', gap: '24px', alignItems: 'center', height: '100%' }}>
          {NAV_LABELS.map((label) => (
            <div
              key={label}
              ref={label === 'GUIDES' ? guidesRef : null}
              onMouseEnter={() => open(label)}
              onMouseLeave={close}
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: activeMenu === label ? 'var(--text)' : 'var(--text-muted)',
                  height: '100%',
                  borderBottom: activeMenu === label ? '2px solid var(--text)' : '2px solid transparent',
                  transition: 'all 0.15s',
                  padding: '0',
                }}
              >
                {label}
              </button>
            </div>
          ))}

          <div style={{ marginLeft: 'auto' }}>
            <Link to="/products" style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'uppercase' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Shop All →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile menu bar ─────────────────────────── */}
      <div
        className="mobile-only"
        style={{
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          padding: '8px 16px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
          {NAV_LABELS.map((label) => (
            <button
              key={label}
              onClick={() => {
                if (activeMenu === label) {
                  setActiveMenu(null);
                } else {
                  open(label);
                }
              }}
              style={{
                background: activeMenu === label ? 'var(--bg2)' : 'none',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: activeMenu === label ? 'var(--text)' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
          <Link
            to="/products"
            style={{
              marginLeft: 'auto',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '1px',
              color: 'var(--text)',
              textTransform: 'uppercase',
              textDecoration: 'none'
            }}
          >
            Shop All →
          </Link>
        </div>
      </div>

      {/* ── Dropdowns ─────────────────────────────────── */}
      {activeMenu && (
        <div
          onMouseEnter={keep}
          onMouseLeave={close}
          style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 997 }}
        >
          {activeMenu === 'TYRES' && <MegaDropdown menu={TYRES_MENU} visible />}
          {activeMenu === 'PARTS' && <MegaDropdown menu={PARTS_MENU} visible />}
          {activeMenu === 'GUIDES' && <GuidesDropdown visible left={guidesLeft} />}
        </div>
      )}
    </>
  );
}
