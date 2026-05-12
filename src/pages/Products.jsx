import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { SearchX, Car, Filter, X } from 'lucide-react';

// Components
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import FilterSidebar from '../components/FilterSidebar';
import ActiveFilters from '../components/ActiveFilters';
import SortDropdown from '../components/SortDropdown';

// Contexts
import { useFilter } from '../context/FilterContext';
import { useVehicle } from '../context/VehicleContext';

// Utils
import { matchFilter, normalize } from '../utils/filterUtils';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Filter State
  const [filters, setFilters] = useState({
    types: [],
    categories: [],
    brands: [],
    sizes: [],
    priceRange: { min: null, max: null },
    search: ''
  });

  const { searchFilters, clearFilters: clearGlobalContext } = useFilter();
  const { activeVehicle, clearVehicle } = useVehicle();
  const location = useLocation();

  // 1. Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`);
        const productsArray = Array.isArray(data) ? data : (data?.data || []);
        setProducts(productsArray?.map(p => ({ ...p, id: p._id || p.id })) || []);
      } catch (error) {
        console.error('API Error: Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Sync URL params & Global Search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const t = params.get('type');
    const b = params.get('brand');
    const s = params.get('search');
    const sz = params.get('size');

    setFilters(prev => ({
      ...prev,
      categories: cat ? [cat] : prev.categories,
      types: t ? [t] : prev.types,
      brands: b ? [b] : prev.brands,
      sizes: sz ? [sz] : prev.sizes,
      search: s || prev.search
    }));
  }, [location.search]);

  // 3. Derived Options
  const availableOptions = useMemo(() => {
    return {
      types: ['tyre', 'part'],
      categories: [...new Set(products.map(p => p.category).filter(Boolean))],
      brands: [...new Set(products.map(p => p.brand).filter(Boolean))],
      sizes: [...new Set(products.map(p => p.tyreSize).filter(Boolean))],
    };
  }, [products]);

  // 4. Memoized Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // AND logic between groups, OR logic within groups
    
    // Vehicle Compatibility
    if (activeVehicle) {
      result = result.filter(p => {
        if (!p.compatibility || p.compatibility.length === 0) return false;
        return p.compatibility.some(c => {
          const typeMatch = activeVehicle.vehicleType ? c.vehicleType?.toLowerCase() === activeVehicle.vehicleType.toLowerCase() : true;
          const brandMatch = activeVehicle.brand ? c.brand?.toLowerCase() === activeVehicle.brand.toLowerCase() : true;
          const modelMatch = activeVehicle.model ? (activeVehicle.model.toLowerCase().includes(c.model?.toLowerCase()) || c.model?.toLowerCase().includes(activeVehicle.model.toLowerCase())) : true;
          return typeMatch && brandMatch && modelMatch;
        });
      });
    }

    // Search term
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(s) || 
        p.brand?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s)
      );
    }

    // Types (OR)
    if (filters.types.length > 0) {
      result = result.filter(p => filters.types.some(t => matchFilter(p.type || 'tyre', t)));
    }

    // Categories (OR)
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.some(cat => matchFilter(p.category, cat)));
    }

    // Brands (OR)
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.some(brand => matchFilter(p.brand, brand)));
    }

    // Sizes (OR)
    if (filters.sizes.length > 0) {
      result = result.filter(p => {
        const topLevelMatch = filters.sizes.some(sz => matchFilter(p.tyreSize, sz));
        const subSizeMatch = p.sizes && p.sizes.some(s => filters.sizes.some(sz => matchFilter(s.size, sz)));
        return topLevelMatch || subSizeMatch;
      });
    }

    // Price Range (AND)
    if (filters.priceRange.min !== null) {
      result = result.filter(p => p.price >= filters.priceRange.min);
    }
    if (filters.priceRange.max !== null) {
      result = result.filter(p => p.price <= filters.priceRange.max);
    }

    // 5. Sorting
    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [products, filters, activeVehicle, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const removeFilterTag = (key, value) => {
    if (key === 'priceRange') setFilters(prev => ({ ...prev, priceRange: { min: null, max: null } }));
    else if (key === 'search') setFilters(prev => ({ ...prev, search: '' }));
    else setFilters(prev => ({ ...prev, [key]: prev[key].filter(v => v !== value) }));
  };

  const clearAll = () => {
    setFilters({ types: [], categories: [], brands: [], sizes: [], priceRange: { min: null, max: null }, search: '' });
    clearGlobalContext();
  };

  return (
    <div className="section-full" style={{ minHeight: '100vh', paddingTop: '0', paddingBottom: '60px' }}>
      
      {/* MOBILE FILTER TRIGGER */}
      <div className="desktop-hidden" style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
        <button 
          onClick={() => setMobileFiltersOpen(true)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: 'var(--bg2)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            fontWeight: '700',
            color: 'var(--text)',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
        >
          <Filter size={18} stroke="currentColor" /> Filters
        </button>
      </div>

      <div className="responsive-sidebar-layout" style={{ paddingTop: '24px' }}>
        
        {/* DESKTOP SIDEBAR */}
        <div className="mobile-hidden">
          <FilterSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            availableOptions={availableOptions}
            onClearAll={clearAll} 
          />
        </div>

        {/* MAIN AREA */}
        <div style={{ minWidth: 0 }}>
          
          {/* VEHICLE BANNER */}
          {activeVehicle && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div style={{ background: 'var(--text)', color: 'var(--bg)', padding: '10px', borderRadius: '50%' }}><Car size={20} /></div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Compatible with</p>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{activeVehicle.brand} {activeVehicle.model} ({activeVehicle.year})</h3>
                </div>
              </div>
              <button onClick={clearVehicle} style={{ background: 'none', border: '1px solid var(--border)', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Change</button>
            </div>
          )}

          {/* TOP BAR: ACTIVE TAGS & SORT */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Showing <strong>{filteredProducts?.length || 0}</strong> {(filteredProducts?.length || 0) === 1 ? 'product' : 'products'}
              </p>
              <ActiveFilters activeFilters={filters} onRemove={removeFilterTag} onClearAll={clearAll} />
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* GRID */}
          {loading ? (
            <div className="responsive-grid" style={{ gap: '24px' }}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (!filteredProducts || filteredProducts.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <SearchX size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>No products found</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Try adjusting your filters or search term</p>
              <button onClick={clearAll} style={{ background: 'var(--text)', color: 'var(--bg)', border: 'none', padding: '10px 24px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>Clear All Filters</button>
            </div>
          ) : (
            <div className="responsive-grid" style={{ gap: '24px' }}>
              {filteredProducts?.length > 0 ? (
                filteredProducts.map(p => <ProductCard key={p.id || p._id} product={p} />)
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No products found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER (Slide-in) */}
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 2000, 
        display: 'flex',
        visibility: mobileFiltersOpen ? 'visible' : 'hidden',
        pointerEvents: mobileFiltersOpen ? 'all' : 'none',
        transition: 'visibility 0.3s'
      }}>
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            opacity: mobileFiltersOpen ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }} 
          onClick={() => setMobileFiltersOpen(false)} 
        />
        <div style={{ 
          position: 'relative', 
          width: '85%', 
          maxWidth: '340px', 
          background: 'var(--bg)', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          marginLeft: 'auto',
          transform: mobileFiltersOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ 
            padding: '24px', 
            borderBottom: '1px solid var(--border)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <h3 className="font-condensed" style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>FILTERS</h3>
            <button 
              onClick={() => setMobileFiltersOpen(false)} 
              style={{ background: 'var(--bg2)', border: 'none', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>
          </div>
          <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              availableOptions={availableOptions}
              onClearAll={clearAll} 
            />
          </div>
          <div style={{ padding: '24px', borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
            <button 
              onClick={() => setMobileFiltersOpen(false)}
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: 'var(--text)', 
                color: 'var(--bg)', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: '800',
                fontSize: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Apply & Show ({filteredProducts.length})
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}
