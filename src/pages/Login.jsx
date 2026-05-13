import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { getSafeApiUrl } from '../utils/media';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, setAuthToken } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setAuthToken(token);
      addToast('Successfully logged in with Google', 'success');
      navigate(redirectPath);
    }
  }, [location, navigate, setAuthToken, addToast, redirectPath]);

  const handleGoogleLogin = () => {
    window.location.href = `${getSafeApiUrl()}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-full" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '48px 32px', borderRadius: '24px', boxShadow: 'var(--shadow-hover)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="font-condensed" style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Login</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Welcome back to BoxBox India</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="btn-secondary"
                style={{ width: '100%', padding: '14px 14px 14px 44px', textAlign: 'left', cursor: 'text', background: 'var(--input-bg)' }}
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="btn-secondary"
                style={{ width: '100%', padding: '14px 14px 14px 44px', textAlign: 'left', cursor: 'text', background: 'var(--input-bg)' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {isSubmitting ? <Loader2 className="spin" size={20} /> : <>Continue <ArrowRight size={18} /></>}
          </button>
        </form>

          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="btn-secondary" 
            style={{ width: '100%', padding: '16px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: '700' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0' }}>
            <div style={{ height: '1px', background: 'var(--border)', flex: 1 }}></div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>OR</span>
            <div style={{ height: '1px', background: 'var(--border)', flex: 1 }}></div>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--text)', fontWeight: '700', textDecoration: 'underline' }}>Create one</Link>
          </p>
          <div style={{ height: '1px', background: 'var(--border)', width: '100%' }}></div>
          <Link to="/" style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Continue as Guest</Link>
        </div>
      </div>
  );
}
