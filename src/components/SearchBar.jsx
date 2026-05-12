import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import SearchDropdown from './SearchDropdown';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ products: [], categories: [], brands: [] });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounce logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ products: [], categories: [], brands: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchResults = async (q) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/products?search=${q}`, {
        signal: abortControllerRef.current.signal
      });

      // Grouping logic (since backend might just return a flat array)
      const products = data.slice(0, 6);
      const brands = [...new Set(data.map(p => p.brand))].slice(0, 4);
      const categories = [...new Set(data.map(p => p.type))].map(t => t === 'tyre' ? 'All Tyres' : 'Parts').slice(0, 3);

      setResults({ products, categories, brands });
    } catch (err) {
      if (err.name !== 'CanceledError') {
        console.error('Search error:', err);
        setResults({ products: [], categories: [], brands: [] });
      }
    } finally {
      setLoading(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!focused || results.products.length === 0) return;

    const totalItems = results.categories.length + results.products.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      // Logic handled in dropdown click but we can trigger it here
    } else if (e.key === 'Escape') {
      setFocused(false);
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1); }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tyres, brands, parts..."
          style={{
            width: '100%',
            padding: '10px 40px 10px 42px',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: 'var(--text)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s',
            borderWidth: focused ? '1px' : '1px',
            borderColor: focused ? 'var(--text)' : 'var(--border)',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults({ products: [], categories: [], brands: [] }); }}
            style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <SearchDropdown
        results={results}
        loading={loading}
        query={query}
        visible={focused && query.length >= 2}
        selectedIndex={selectedIndex}
        onSelect={() => setFocused(false)}
      />
    </div>
  );
}
