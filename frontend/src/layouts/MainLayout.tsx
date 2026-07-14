/**
 * MainLayout.tsx — Primary Application Layout
 *
 * Wraps all authenticated/public pages with:
 *  - Fixed Navbar at the top
 *  - <main> content area (Outlet renders child routes here)
 *  - Footer at the bottom
 *
 * The `layout` and `layout__content` classes ensure the footer
 * is always pushed to the bottom of the viewport (flex-column, flex:1).
 */

import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Layout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__content" id="main-content">
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '60vh' }}>
            <span className="auth-loading__spinner" style={{ width: 40, height: 40, border: '3px solid rgba(108, 99, 255, 0.2)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: 'var(--color-surface-2)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
        }
      }} />
    </div>
  );
};

export default MainLayout;
