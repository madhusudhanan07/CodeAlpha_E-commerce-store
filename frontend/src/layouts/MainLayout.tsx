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

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Layout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__content" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
