/**
 * NotFoundPage.tsx — 404 Page
 * Displayed when no route matches the current URL.
 */

import { Link } from 'react-router-dom';
import '../styles/pages.css';

const NotFoundPage: React.FC = () => {
  return (
    <section className="page" aria-label="Page not found">
      <p className="page__badge">404 — Not Found</p>
      <h1 className="page__title">Lost in the Store?</h1>
      <p className="page__subtitle">
        The page you are looking for does not exist or has been moved.
      </p>
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
        }}
      >
        Back to Home
      </Link>
    </section>
  );
};

export default NotFoundPage;
