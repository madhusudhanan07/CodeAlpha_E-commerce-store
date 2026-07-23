/**
 * ProfilePage.tsx — Authenticated User Profile
 *
 * Protected page displaying the current user's information.
 * Accessible only to authenticated users (enforced via ProtectedRoute).
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';
import '../styles/auth.css';
import '../styles/pages.css';

const ProfilePage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();

  const memberSince = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'Unknown';

  return (
    <section className="page" aria-label="Profile page">
      <p className="page__badge">My Account</p>
      <h1 className="page__title">
        {currentUser?.displayName ?? 'Your Profile'}
      </h1>

      <div className="auth-card" style={{ marginTop: '2rem', textAlign: 'left' }}>
        {isAdmin && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.1))', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield className="w-4 h-4 text-blue-600" /> Admin Access Granted
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Manage products, orders, inventory, customers and revenue stats.
              </div>
            </div>

            <Link
              to="/admin"
              className="auth-btn"
              style={{ padding: '0.5rem 1.25rem', width: 'auto', textDecoration: 'none', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: '999px', fontSize: '0.85rem' }}
            >
              Open Admin Panel &rarr;
            </Link>
          </div>
        )}

        <div className="auth-form" style={{ gap: '1rem' }}>

          <div className="auth-field">
            <span className="auth-field__label">Display name</span>
            <p style={{ color: 'var(--color-text)', padding: '0.25rem 0' }}>
              {currentUser?.displayName ?? '—'}
            </p>
          </div>

          <div className="auth-field">
            <span className="auth-field__label">Email address</span>
            <p style={{ color: 'var(--color-text)', padding: '0.25rem 0' }}>
              {currentUser?.email ?? '—'}
            </p>
          </div>

          <div className="auth-field">
            <span className="auth-field__label">Email verified</span>
            <p style={{ color: currentUser?.emailVerified ? 'var(--color-success)' : 'var(--color-warning)', padding: '0.25rem 0' }}>
              {currentUser?.emailVerified ? '✓ Verified' : '⚠ Not verified'}
            </p>
          </div>

          <div className="auth-field">
            <span className="auth-field__label">Member since</span>
            <p style={{ color: 'var(--color-text-muted)', padding: '0.25rem 0' }}>
              {memberSince}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
