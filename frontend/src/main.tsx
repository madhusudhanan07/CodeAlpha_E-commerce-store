/**
 * main.tsx — Application Entry Point
 *
 * Mounts the React application to the DOM.
 * Wraps the app in:
 *  - React.StrictMode — highlights potential issues in development
 *  - AuthProvider     — provides global authentication context
 *
 * The global CSS design system is imported here so it applies universally.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRouter from './routes/AppRouter';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in the DOM.');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
