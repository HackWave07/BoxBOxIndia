import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return addToast('Passwords do not match', 'error');
    }
    
    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password);
      addToast('Account created successfully!', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.response?.data?.message || 'Registration failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-full" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '48px 32px', borderRadius: '24px', boxShadow: 'var(--shadow-hover)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="font-condensed" style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Join BoxBox</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Create an account for personal tracking</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                name="name"
                type="text"
                className="btn-secondary"
                style={{ width: '100%', padding: '14px 14px 14px 44px', textAlign: 'left', cursor: 'text', background: 'var(--input-bg)' }}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                name="email"
                type="email"
                className="btn-secondary"
                style={{ width: '100%', padding: '14px 14px 14px 44px', textAlign: 'left', cursor: 'text', background: 'var(--input-bg)' }}
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                name="password"
                type="password"
                className="btn-secondary"
                style={{ width: '100%', padding: '14px 14px 14px 44px', textAlign: 'left', cursor: 'text', background: 'var(--input-bg)' }}
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                name="confirmPassword"
                type="password"
                className="btn-secondary"
                style={{ width: '100%', padding: '14px 14px 14px 44px', textAlign: 'left', cursor: 'text', background: 'var(--input-bg)' }}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '16px', marginTop: '12px', justifyContent: 'center' }}
          >
            {isSubmitting ? <Loader2 className="spin" size={20} /> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--text)', fontWeight: '700', textDecoration: 'underline' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
