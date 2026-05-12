import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import PriceFilter from './PriceFilter';
import { useTheme } from '../context/ThemeContext';
import { normalize } from '../utils/filterUtils';

function FilterSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ 
      borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', 
      paddingBottom: '20px',
      marginBottom: '10px'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          fontSize: '12px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
        onMouseLeave={(e) => e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
      >
        {title}
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <ChevronDown size={14} />
        </span>
      </button>
      <div style={{ 
        maxHeight: isOpen ? '1000px' : '0',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isOpen ? 1 : 0
      }}>
        <div style={{ paddingTop: '8px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FilterSidebar({ 
  filters, 
  onFilterChange, 
  availableOptions,
  onClearAll 
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { types, categories, brands, sizes, priceRange } = filters;
  const { types: allTypes, categories: allCats, brands: allBrands, sizes: allSizes } = availableOptions;

  const handleToggle = (group, value) => {
    const current = filters[group];
    const isAlreadySelected = current.some(v => normalize(v) === normalize(value));
    const next = isAlreadySelected 
      ? current.filter(v => normalize(v) !== normalize(value)) 
      : [...current, value];
    onFilterChange(group, next);
  };

  const containerStyle = {
    background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
    backdropFilter: isDark ? 'blur(12px)' : 'none',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e5e5',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    transition: 'all 0.3s ease',
    boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(0,0,0,0.05)'
  };

  const chipGridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  };

  const getChipStyle = (isActive) => ({
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid',
    borderColor: isActive 
      ? (isDark ? '#fff' : '#000') 
      : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
    background: isActive 
      ? (isDark ? '#fff' : '#000') 
      : 'transparent',
    color: isActive 
      ? (isDark ? '#000' : '#fff') 
      : (isDark ? '#fff' : '#000'),
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  });

  return (
    <aside className="hide-scrollbar" style={{ 
      width: '100%', 
      maxWidth: '300px',
      position: 'sticky', 
      top: '100px', 
      maxHeight: 'calc(100vh - 120px)', 
      overflowY: 'auto',
      paddingBottom: '40px'
    }}>
      <div style={containerStyle} className="fade-in-up">
        
        {/* TOP CONTROLS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button 
            onClick={onClearAll}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: isDark ? 'rgba(255,255,255,0.5)' : '#666', 
              fontSize: '12px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
            onMouseLeave={e => e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.5)' : '#666'}
          >
            Clear All
          </button>
          <div style={{ 
            background: isDark ? '#fff' : '#000', 
            color: isDark ? '#000' : '#fff',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            opacity: 0.9
          }}>
            Apply
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* PRODUCT TYPE */}
          <FilterSection title="Vehicle Type">
            <div style={chipGridStyle}>
              {allTypes.map(t => {
                const isActive = types.some(v => normalize(v) === normalize(t));
                return (
                  <button 
                    key={t} 
                    onClick={() => handleToggle('types', t)}
                    style={getChipStyle(isActive)}
                    className="filter-chip"
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* CATEGORY */}
          <FilterSection title="Category">
            <div style={chipGridStyle}>
              {allCats.map(cat => {
                const isActive = categories.some(v => normalize(v) === normalize(cat));
                return (
                  <button 
                    key={cat} 
                    onClick={() => handleToggle('categories', cat)}
                    style={getChipStyle(isActive)}
                    className="filter-chip"
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* BRANDS */}
          <FilterSection title="Manufacturer">
            <div style={chipGridStyle}>
              {allBrands.map(brand => {
                const isActive = brands.some(v => normalize(v) === normalize(brand));
                return (
                  <button 
                    key={brand} 
                    onClick={() => handleToggle('brands', brand)}
                    style={getChipStyle(isActive)}
                    className="filter-chip"
                  >
                    {brand}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* PRICE RANGE */}
          <FilterSection title="Price Range">
            <PriceFilter 
              min={priceRange.min} 
              max={priceRange.max} 
              onChange={(val) => onFilterChange('priceRange', val)} 
            />
          </FilterSection>

          {/* SIZES */}
          {allSizes.length > 0 && (
            <FilterSection title="Fitment / Size" defaultOpen={false}>
              <div style={chipGridStyle}>
                {allSizes.map(size => {
                  const isActive = sizes.some(v => normalize(v) === normalize(size));
                  return (
                    <button 
                      key={size} 
                      onClick={() => handleToggle('sizes', size)}
                      style={getChipStyle(isActive)}
                      className="filter-chip"
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          )}

        </div>
      </div>

      <style>{`
        .filter-chip:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
        }
        .filter-chip:active {
          transform: scale(0.95);
        }
      `}</style>
    </aside>
  );
}
