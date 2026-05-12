import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext';
import { Search, Loader2 } from 'lucide-react';

export default function TyreFinder() {
  const [form, setForm] = useState({ vehicleType: '', brand: '', model: '', year: '' });
  const [isSearching, setIsSearching] = useState(false);
  const { setActiveVehicle } = useVehicle();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const hasInput = Object.values(form).some(val => val.trim().length > 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!hasInput) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setActiveVehicle(form);
      setIsSearching(false);
      navigate('/products');
    }, 800);
  };

  const inputStyle = {
    padding: '12px 16px', background: 'var(--bg2)', 
    border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', 
    outline: 'none', width: '100%', fontSize: '14px'
  };

  return (
    <div className="glass-panel animate-lift" style={{ padding: '24px', maxWidth: '900px', width: '100%', margin: '0 auto', marginTop: '40px', textAlign: 'left' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
        <Search size={20} /> Find Your Perfect Tyres
      </h3>
      <form onSubmit={handleSearch}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <select name="vehicleType" style={inputStyle} value={form.vehicleType} onChange={handleChange}>
            <option value="">Vehicle Type</option>
            <option value="Car">Car</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="SUV">SUV / 4x4</option>
            <option value="EV">Electric Vehicle</option>
          </select>
          <input type="text" name="brand" placeholder="Brand (e.g. KTM)" style={inputStyle} value={form.brand} onChange={handleChange} />
          <input type="text" name="model" placeholder="Model (e.g. 390 Adventure)" style={inputStyle} value={form.model} onChange={handleChange} />
          <input type="text" name="year" placeholder="Year" style={inputStyle} value={form.year} onChange={handleChange} />
        </div>
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={!hasInput || isSearching}
          style={{ width: '100%', padding: '14px', fontSize: '16px', opacity: (!hasInput || isSearching) ? 0.5 : 1, cursor: (!hasInput || isSearching) ? 'not-allowed' : 'pointer' }}
        >
          {isSearching ? <><Loader2 size={20} className="animate-spin" /> Searching...</> : 'Search Tyres'}
        </button>
      </form>
      <style dangerouslySetInnerHTML={{__html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
