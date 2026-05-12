import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Moon, Sun, ShoppingCart, Search, User, LogOut, Package, Layout } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav style={{ 
      borderBottom: '1px solid var(--border)', 
      backgroundColor: 'var(--bg)', 
      transition: 'background-color 0.3s ease' 
    }}>
      <div className="section-full" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
            <Link 
              to="/" 
              onClick={handleLogoClick}
              style={{ display: 'flex', alignItems: 'center', minWidth: 0, textDecoration: 'none' }}
            >
              <img src={logo} alt="BOXBOX" style={{ height: '35px', width: 'auto', objectFit: 'contain' }} />
            </Link>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <div className="mobile-hidden">
              <SearchBar />
            </div>

            <Link to="/track-order" className="mobile-hidden" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Track Order
            </Link>

            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', transition: 'background 0.3s' }} className="nav-icon-btn">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Menu */}
            <div style={{ position: 'relative' }}>
              {user ? (
                <div 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 8px', borderRadius: '20px', background: 'var(--bg2)', border: '1px solid var(--border)' }}
                >
                  <User size={18} />
                  <span style={{ fontSize: '13px', fontWeight: '800', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="mobile-hidden">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
              ) : (
                <Link to="/login" style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text)', textDecoration: 'none', letterSpacing: '1px', background: 'var(--bg2)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                  Login
                </Link>
              )}

              {showDropdown && user && (
                <>
                  <div onClick={() => setShowDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 1200 }} />
                  <div className="glass-panel" style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    right: 0, 
                    marginTop: '12px', 
                    minWidth: '220px', 
                    width: 'max-content',
                    zIndex: 1201, 
                    padding: '8px', 
                    boxShadow: '0 15px 35px rgba(0,0,0,0.4)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '16px' 
                  }}>
                    <Link to="/profile" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', color: 'var(--text)', textDecoration: 'none', fontSize: '14px', fontWeight: '700', borderRadius: '10px', whiteSpace: 'nowrap' }} className="nav-dropdown-item">
                      <User size={16} /> Profile Settings
                    </Link>
                    <Link to="/my-orders" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', color: 'var(--text)', textDecoration: 'none', fontSize: '14px', fontWeight: '700', borderRadius: '10px', whiteSpace: 'nowrap' }} className="nav-dropdown-item">
                      <Package size={16} /> My Orders
                    </Link>
                    {user.role === 'owner' && (
                      <Link to="/admin" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', color: 'var(--text)', textDecoration: 'none', fontSize: '14px', fontWeight: '700', borderRadius: '10px', borderTop: '1px solid var(--border)', marginTop: '6px', whiteSpace: 'nowrap' }} className="nav-dropdown-item">
                        <Layout size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => { logout(); setShowDropdown(false); }} 
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700', borderTop: '1px solid var(--border)', marginTop: '6px', whiteSpace: 'nowrap' }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', color: 'var(--text)', position: 'relative' }}>
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--accent)', color: 'var(--accent-text)', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="nav-search-mobile">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
