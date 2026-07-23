/**
 * AdminRoute.tsx — Route Guard for Admin Panel Access
 *
 * Strict Security Authorization:
 *  - While auth is loading → show crisp loading state
 *  - Only allow user with email msudhanan2007@gmail.com
 *  - Any other user or unauthenticated guest → redirect immediately to Home Page ("/")
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-route-loading" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#94a3b8' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 600 }}>Verifying Admin Authorization…</p>
        </div>
      </div>
    );
  }

  const isSuperAdmin = currentUser?.email?.toLowerCase() === 'msudhanan2007@gmail.com';

  if (!isAuthenticated || !isAdmin || !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
