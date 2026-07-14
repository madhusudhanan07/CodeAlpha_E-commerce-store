/**
 * ErrorPage.tsx — 500 Error Boundary UI
 * Displayed when an unexpected error occurs during rendering or routing.
 */

import { useRouteError, Link } from 'react-router-dom';
import '../styles/pages.css';

const ErrorPage: React.FC = () => {
  const error: any = useRouteError();
  console.error('Global ErrorBoundary caught:', error);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main className="page" aria-label="System Error" style={{ flex: 1 }}>
        <p className="page__badge" style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.12)' }}>500 — System Error</p>
        <h1 className="page__title">Oops! Something went wrong</h1>
        <p className="page__subtitle">
          We're sorry, but an unexpected error occurred. Our team has been notified.
        </p>
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontFamily: 'monospace', maxWidth: '600px', width: '100%', overflowX: 'auto', textAlign: 'left' }}>
          {error?.message || 'An unknown error occurred.'}
        </div>
        <Link
          to="/"
          style={{
            marginTop: '2rem',
            padding: '0.75rem 2rem',
            background: 'var(--color-primary)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: 'var(--font-size-sm)',
            transition: 'background var(--transition-fast)',
            display: 'inline-block',
            textDecoration: 'none'
          }}
        >
          Return to Dashboard
        </Link>
      </main>
    </div>
  );
};

export default ErrorPage;
