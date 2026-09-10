import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import {
  FiX,
  FiHome,
  FiUsers,
  FiStar,
  FiGrid,
  FiMapPin,
  FiBarChart2,
  FiAlertTriangle,
  FiMaximize2,
  FiPlus,
  FiMail,
  FiUser,
  FiSun,
  FiMoon,
  FiLogOut,
  FiChevronRight
} from 'react-icons/fi';
import './MobileDrawer.css';

export const MobileDrawer = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    stats,
    currentUser,
    logoutUser,
    theme,
    toggleTheme,
    setActiveEmailContact
  } = useContacts();

  const navigate = useNavigate();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  if (!isMobileMenuOpen) return null;

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleComposeQuickEmail = () => {
    setIsMobileMenuOpen(false);
    setActiveEmailContact({
      fullName: 'New Email Draft',
      email: '',
      id: 'draft'
    });
  };

  return (
    <div className="mobile-drawer-backdrop animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
      <aside className="mobile-drawer-container animate-slide-right" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header & User Identity */}
        <div className="drawer-header">
          <div className="drawer-brand-row">
            <div className="drawer-brand-logo">
              <span className="brand-badge-c">C</span>
              <div className="brand-text">
                <strong>Connect<span className="text-emerald">.</span></strong>
                <span>Smart Contact Hub</span>
              </div>
            </div>
            <button
              className="drawer-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <FiX />
            </button>
          </div>

          {currentUser ? (
            <div className="drawer-user-card" onClick={() => handleNavClick('/profile')}>
              <div
                className="drawer-user-avatar"
                style={{ background: currentUser.avatarBg || 'linear-gradient(135deg, #064E3B, #10B981)' }}
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="drawer-user-img" />
                ) : (
                  <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
              <div className="drawer-user-meta">
                <strong className="drawer-user-name">{currentUser.name || 'User'}</strong>
                <span className="drawer-user-email">{currentUser.email}</span>
                <span className="drawer-cloud-pill">Cloud Database Synced</span>
              </div>
              <FiChevronRight className="drawer-arrow" />
            </div>
          ) : (
            <button className="drawer-signin-banner" onClick={() => handleNavClick('/login')}>
              <FiUser />
              <span>Sign In / Create Account</span>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="drawer-nav-scroll">
          <div className="drawer-section-label">Navigation Hubs</div>
          <nav className="drawer-nav-list">
            <NavLink
              to="/"
              className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
              end
            >
              <div className="drawer-nav-icon bg-emerald-light text-emerald">
                <FiHome />
              </div>
              <span className="drawer-nav-text">Home Dashboard</span>
            </NavLink>

            <NavLink
              to="/contacts"
              className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="drawer-nav-icon bg-blue-light text-blue">
                <FiUsers />
              </div>
              <span className="drawer-nav-text">All Contacts</span>
              {stats.total > 0 && <span className="drawer-badge">{stats.total}</span>}
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="drawer-nav-icon bg-amber-light text-amber">
                <FiStar />
              </div>
              <span className="drawer-nav-text">Starred Favorites</span>
              {stats.favorites > 0 && <span className="drawer-badge badge-amber">{stats.favorites}</span>}
            </NavLink>

            <NavLink
              to="/groups"
              className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="drawer-nav-icon bg-purple-light text-purple">
                <FiGrid />
              </div>
              <span className="drawer-nav-text">Categories &amp; Groups</span>
            </NavLink>

            <NavLink
              to="/map"
              className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="drawer-nav-icon bg-cyan-light text-cyan">
                <FiMapPin />
              </div>
              <span className="drawer-nav-text">Interactive Map View</span>
            </NavLink>

            <NavLink
              to="/analytics"
              className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="drawer-nav-icon bg-emerald-light text-emerald">
                <FiBarChart2 />
              </div>
              <span className="drawer-nav-text">Directory Analytics</span>
            </NavLink>

            <NavLink
              to="/emergency"
              className={({ isActive }) => `drawer-nav-link drawer-emergency-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="drawer-nav-icon bg-red-light text-red">
                <FiAlertTriangle />
              </div>
              <span className="drawer-nav-text">Emergency SOS (112)</span>
              <span className="drawer-sos-badge">SOS</span>
            </NavLink>

            <NavLink
              to="/qr"
              className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="drawer-nav-icon bg-purple-light text-purple">
                <FiMaximize2 />
              </div>
              <span className="drawer-nav-text">QR Hub &amp; Scanner</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="drawer-nav-icon bg-blue-light text-blue">
                <FiUser />
              </div>
              <span className="drawer-nav-text">Profile &amp; Settings</span>
            </NavLink>
          </nav>

          {/* Quick Action Matrix */}
          <div className="drawer-section-label">Quick Actions</div>
          <div className="drawer-quick-actions">
            <button
              type="button"
              className="drawer-action-card bg-emerald-cta"
              onClick={() => handleNavClick('/add')}
            >
              <FiPlus />
              <span>Add New Contact</span>
            </button>

            <button
              type="button"
              className="drawer-action-card bg-surface-cta"
              onClick={handleComposeQuickEmail}
            >
              <FiMail />
              <span>Compose Email</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="drawer-footer-btn theme-btn"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {currentUser && (
            <button
              type="button"
              className="drawer-footer-btn logout-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                logoutUser();
              }}
            >
              <FiLogOut />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
