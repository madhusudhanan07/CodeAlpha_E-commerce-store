/**
 * ProfilePage.tsx — Authenticated User Profile
 *
 * Protected page displaying the current user's information.
 * Accessible only to authenticated users (enforced via ProtectedRoute).
 */

import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';
import '../styles/pages.css';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

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
