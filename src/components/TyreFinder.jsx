import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext';
import { Search, Loader2 } from 'lucide-react';

const VEHICLE_DATA = {
  Car: {
    brands: {
      Honda: ['City', 'Civic', 'Amaze'],
      Hyundai: ['Creta', 'i20', 'Verna'],
      'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza'],
      BMW: ['3 Series', '5 Series', 'X3']
    }
  },
  Motorcycle: {
    brands: {
      KTM: ['390 Adventure', '390 Duke', 'RC 390'],
      'Royal Enfield': ['Himalayan', 'Continental GT', 'Classic 350'],
      Kawasaki: ['Ninja 400', 'Z900', 'Ninja ZX-10R'],
      BMW: ['S1000RR', 'G 310 GS', 'R 1250 GS']
    }
  },
  SUV: {
    brands: {
      Mahindra: ['Thar', 'Scorpio', 'XUV700'],
      Tata: ['Safari', 'Harrier', 'Nexon'],
      Toyota: ['Fortuner', 'Innova Crysta', 'Hilux']
    }
  },
  EV: {
    brands: {
      Tesla: ['Model 3', 'Model Y', 'Model S'],
      Tata: ['Nexon EV', 'Tigor EV', 'Tiago EV'],
      MG: ['ZS EV', 'Comet EV'],
      BYD: ['Atto 3', 'E6']
    }
  }
};

export default function TyreFinder() {
  const [form, setForm] = useState({ vehicleType: '', brand: '', model: '', year: '' });
  const [isSearching, setIsSearching] = useState(false);
  const { setActiveVehicle } = useVehicle();
  const navigate = useNavigate();

  const handleVehicleTypeChange = (e) => {
    setForm({ vehicleType: e.target.value, brand: '', model: '', year: '' });
  };

  const handleBrandChange = (e) => {
    setForm({ ...form, brand: e.target.value, model: '', year: '' });
  };

  const handleModelChange = (e) => {
    setForm({ ...form, model: e.target.value, year: '' });
  };

  const handleYearChange = (e) => {
    setForm({ ...form, year: e.target.value });
  };
  
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
    outline: 'none', width: '100%', fontSize: '14px', cursor: 'pointer'
  };

  return (
    <div className="glass-panel animate-lift tyre-finder-container">
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
        <Search size={20} /> Find Your Perfect Tyres
      </h3>
      <form onSubmit={handleSearch}>
        <div className="tyre-finder-grid">
          <select name="vehicleType" style={inputStyle} value={form.vehicleType} onChange={handleVehicleTypeChange}>
            <option value="">Vehicle Type</option>
            <option value="Car">Car</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="SUV">SUV / 4x4</option>
            <option value="EV">Electric Vehicle</option>
          </select>

          <select 
            name="brand" 
            style={{ ...inputStyle, opacity: !form.vehicleType ? 0.5 : 1, cursor: !form.vehicleType ? 'not-allowed' : 'pointer' }} 
            value={form.brand} 
            onChange={handleBrandChange} 
            disabled={!form.vehicleType}
          >
            <option value="">Select Brand</option>
            {form.vehicleType && VEHICLE_DATA[form.vehicleType] && Object.keys(VEHICLE_DATA[form.vehicleType].brands).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select 
            name="model" 
            style={{ ...inputStyle, opacity: !form.brand ? 0.5 : 1, cursor: !form.brand ? 'not-allowed' : 'pointer' }} 
            value={form.model} 
            onChange={handleModelChange} 
            disabled={!form.brand}
          >
            <option value="">Select Model</option>
            {form.brand && form.vehicleType && VEHICLE_DATA[form.vehicleType]?.brands[form.brand] && VEHICLE_DATA[form.vehicleType].brands[form.brand].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select 
            name="year" 
            style={{ ...inputStyle, opacity: !form.model ? 0.5 : 1, cursor: !form.model ? 'not-allowed' : 'pointer' }} 
            value={form.year} 
            onChange={handleYearChange} 
            disabled={!form.model}
          >
            <option value="">Select Year</option>
            {['2020', '2021', '2022', '2023', '2024', '2025', '2026'].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={!hasInput || isSearching}
          style={{ width: '100%', padding: '14px', fontSize: '16px', opacity: (!hasInput || isSearching) ? 0.5 : 1, cursor: (!hasInput || isSearching) ? 'not-allowed' : 'pointer', marginTop: '16px' }}
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
