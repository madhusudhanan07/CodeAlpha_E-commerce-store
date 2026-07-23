/**
 * AdminLayout.tsx — SaaS Admin Panel Master Shell Layout
 *
 * Features:
 *  - Interactive Collapsible Responsive Sidebar (Dashboard, Products, Categories, Orders, Customers, Reviews, Analytics, Settings, Logout)
 *  - Global Command Search (Ctrl + K) with Instant Navigation Dropdown
 *  - Top Navbar with Theme Toggle, Notifications, & Profile Avatar
 *  - Responsive Mobile Menu Drawer & Desktop Sidebar Collapse Toggle
 */

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import '../styles/admin.css';

interface QuickLink {
  title: string;
  path: string;
  category: string;
  icon: React.FC<{ className?: string }>;
}

export const AdminLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Initial theme sync
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  // Global Ctrl + K Keyboard Shortcut listener for search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowSearchDropdown(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('admin_theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      // Ignore
    }
  };

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser?.email?.[0]?.toUpperCase() ?? 'AD';

  const NAV_ITEMS = [
    { path: '/admin', title: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/admin/products', title: 'Products', icon: Package },
    { path: '/admin/categories', title: 'Categories', icon: FolderTree },
    { path: '/admin/orders', title: 'Orders', icon: ShoppingBag },
    { path: '/admin/customers', title: 'Customers', icon: Users },
    { path: '/admin/reviews', title: 'Reviews', icon: Star },
    { path: '/admin/analytics', title: 'Analytics', icon: BarChart3 },
    { path: '/admin/settings', title: 'Settings', icon: Settings },
  ];

  // Quick Navigation Search Database
  const QUICK_SEARCH_ITEMS: QuickLink[] = [
    { title: 'Executive Dashboard Overview', path: '/admin', category: 'Navigation', icon: LayoutDashboard },
    { title: 'Manage Product Catalog', path: '/admin/products', category: 'Products', icon: Package },
    { title: 'Add New Product', path: '/admin/products?action=new', category: 'Products', icon: Package },
    { title: 'Product Categories & Taxonomy', path: '/admin/categories', category: 'Categories', icon: FolderTree },
    { title: 'Customer Orders & Fulfillment', path: '/admin/orders', category: 'Orders', icon: ShoppingBag },
    { title: 'Pending Orders Processing', path: '/admin/orders?status=Pending', category: 'Orders', icon: ShoppingBag },
    { title: 'Customer Directory & Accounts', path: '/admin/customers', category: 'Customers', icon: Users },
    { title: 'Product Reviews & Ratings', path: '/admin/reviews', category: 'Reviews', icon: Star },
    { title: 'Financial Revenue & Sales Analytics', path: '/admin/analytics', category: 'Analytics', icon: BarChart3 },
    { title: 'Admin Store Settings', path: '/admin/settings', category: 'Settings', icon: Settings },
  ];

  const searchResults = searchQuery.trim()
    ? QUICK_SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchResult = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0].path);
    }
  };

  return (
    <div className={`admin-layout ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── Collapsible Sidebar ────────────────────────────────────── */}
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <NavLink to="/admin" className="admin-logo-group">
            <div className="admin-logo-badge">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="admin-logo-title-group">
                <div className="admin-logo-title">NEWONE SHOP</div>
                <div className="admin-logo-subtitle">Admin Workspace</div>
              </div>
            )}
          </NavLink>

          <button
            type="button"
            className="admin-icon-btn hidden-mobile"
            style={{ width: '32px', height: '32px', border: 'none', background: 'transparent' }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="admin-sidebar-nav">
          <div className="admin-nav-heading">{!isCollapsed ? 'Main Menu' : '•••'}</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
                title={item.title}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="admin-sidebar-footer">
          <button type="button" className="admin-nav-item text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={handleLogout} title="Logout">
            <LogOut className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Workspace ────────────────────────────────────────── */}
      <div className={`admin-main-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        
        {/* Topbar Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            {/* Menu Sidebar Toggle Button */}
            <button
              type="button"
              className="admin-icon-btn"
              onClick={() => {
                if (window.innerWidth <= 1024) {
                  setIsMobileOpen(!isMobileOpen);
                } else {
                  setIsCollapsed(!isCollapsed);
                }
              }}
              aria-label="Toggle Sidebar"
              title={isCollapsed ? 'Expand Menu Sidebar' : 'Collapse Menu Sidebar'}
              style={{ cursor: 'pointer' }}
            >
              {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>

            {/* Quick Search Bar with Instant Results Dropdown */}
            <div className="admin-topbar-search" style={{ position: 'relative' }}>
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                className="admin-search-input"
                placeholder="Search orders, products, customers... (Ctrl + K)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                onKeyDown={handleSearchKeyDown}
                style={{ paddingLeft: '2.4rem', width: '100%' }}
              />

              {/* Quick Search Results Dropdown */}
              {showSearchDropdown && searchQuery.trim().length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '46px',
                    left: 0,
                    right: 0,
                    minWidth: '320px',
                    background: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '14px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--admin-text-muted)', borderBottom: '1px solid var(--admin-border)' }}>
                    SEARCH RESULTS ({searchResults.length})
                  </div>

                  <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '0.35rem' }}>
                    {searchResults.length === 0 ? (
                      <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.84rem', color: 'var(--admin-text-muted)' }}>
                        No quick links found matching "{searchQuery}".
                      </div>
                    ) : (
                      searchResults.map((item, idx) => {
                        const ItemIcon = item.icon;
                        return (
                          <div
                            key={idx}
                            style={{
                              padding: '0.65rem 0.85rem',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: 'var(--admin-text-main)',
                              transition: 'background 0.2s ease',
                            }}
                            className="hover:bg-blue-500/10 hover:text-blue-500"
                            onClick={() => handleSelectSearchResult(item.path)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <ItemIcon className="w-4 h-4 text-blue-500" />
                              <span>{item.title}</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="admin-topbar-right">
            
            {/* Theme Toggle Button */}
            <button
              type="button"
              className="admin-icon-btn"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Notifications Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="notification-badge">3</span>
              </button>

              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '320px',
                    background: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '16px',
                    padding: '1rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Notifications</span>
                    <span style={{ fontSize: '0.7rem', color: '#3b82f6', cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>
                      Dismiss all
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                    <div
                      style={{ padding: '0.5rem', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => { navigate('/admin/orders'); setShowNotifications(false); }}
                    >
                      <ShoppingBag className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div>New order #1048 received ($549.00)</div>
                    </div>
                    <div
                      style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => { navigate('/admin/products'); setShowNotifications(false); }}
                    >
                      <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <div>Low stock alert: "Smart Headphones" (2 left)</div>
                    </div>
                    <div
                      style={{ padding: '0.5rem', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => { navigate('/admin/customers'); setShowNotifications(false); }}
                    >
                      <Users className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <div>New customer registered: Sarah Connor</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar Pill */}
            <div className="admin-user-pill" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
              <div className="admin-avatar">{initials}</div>
              <div style={{ lineHeight: 1.2, paddingRight: '0.25rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>
                  {currentUser?.displayName?.split(' ')[0] ?? 'Madhusudhanan'}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>
                  Super Administrator
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Page Content Body */}
        <main className="admin-content-body" onClick={() => setShowSearchDropdown(false)}>
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
