import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, ownerOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="spin" size={48} style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  if (!user) {
    // If it's an owner route, go to admin-login, otherwise go to login
    const target = ownerOnly ? '/admin-login' : '/login';
    return <Navigate to={target} state={{ from: location.pathname }} replace />;
  }

  if (ownerOnly && user.role !== 'owner') {
    return <Navigate to="/" replace />;
  }

  return children;
}
