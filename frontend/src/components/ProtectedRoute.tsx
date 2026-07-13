/**
 * ProtectedRoute.tsx — Route Guard for Authenticated Users
 *
 * Wraps any route that requires authentication.
 * - While auth state is resolving → renders a loading spinner
 * - If not authenticated          → redirects to /login
 * - If authenticated              → renders the child route
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading" aria-label="Checking authentication">
        <span className="auth-loading__spinner" aria-hidden="true" />
        <p>Verifying session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
