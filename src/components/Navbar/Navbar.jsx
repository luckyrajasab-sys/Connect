import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import {
  FiSun,
  FiMoon,
  FiUserPlus,
  FiAlertTriangle,
  FiSearch,
  FiMenu,
  FiHome,
  FiUsers,
  FiStar,
  FiGrid,
  FiMapPin,
  FiMaximize2
} from 'react-icons/fi';
import './Navbar.css';

const ConnectLogo = () => (
  <svg className="connect-brand-icon" viewBox="0 0 32 32" width="32" height="32" fill="none">
    <rect width="32" height="32" rx="10" fill="url(#connect-brand-grad)" />
    <path
      d="M21 11C19.5 9.5 17.2 8.8 15 9.2C11.5 9.8 8.8 12.8 8.8 16.3C8.8 20.3 12 23.5 16 23.5C18.5 23.5 20.8 22.2 22 20.2"
      stroke="#FFFFFF"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <circle cx="21" cy="11" r="2.5" fill="#34D399" />
    <circle cx="22" cy="20.2" r="2" fill="#6EE7B7" />
    <defs>
      <linearGradient id="connect-brand-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#064E3B" />
        <stop offset="1" stopColor="#10B981" />
      </linearGradient>
    </defs>
  </svg>
);

export const Navbar = () => {
  const { theme, toggleTheme, setIsMobileMenuOpen, currentUser, stats } = useContacts();
  const navigate = useNavigate();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Left: Hamburger Toggle + Brand */}
        <div className="navbar-left-group">
          <button
            type="button"
            className="nav-action-btn mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <FiMenu />
          </button>

          <NavLink to="/" className="brand-logo" aria-label="Connect Home">
            <div className="brand-flag-badge">
              <ConnectLogo />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">Connect<span className="brand-dot">.</span></span>
              <span className="brand-subtitle">Smart Contact Hub</span>
            </div>
          </NavLink>
        </div>

        {/* Center: Desktop Navigation Hubs */}
        <nav className="desktop-nav-links">
          <NavLink to="/" className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`} end>
            <FiHome />
            <span>Home</span>
          </NavLink>
          <NavLink to="/contacts" className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}>
            <FiUsers />
            <span>Contacts</span>
            {stats.total > 0 && <span className="nav-count-badge">{stats.total}</span>}
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}>
            <FiStar />
            <span>Favorites</span>
            {stats.favorites > 0 && <span className="nav-count-badge badge-amber">{stats.favorites}</span>}
          </NavLink>
          <NavLink to="/groups" className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}>
            <FiGrid />
            <span>Groups</span>
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}>
            <FiMapPin />
            <span>Map</span>
          </NavLink>
          <NavLink to="/qr" className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}>
            <FiMaximize2 />
            <span>QR Hub</span>
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          <button
            type="button"
            className="nav-action-btn search-trigger-btn"
            onClick={() => navigate('/contacts')}
            title="Search Contacts"
            aria-label="Search Contacts"
          >
            <FiSearch />
          </button>

          <NavLink
            to="/emergency"
            className="nav-action-btn emergency-quick-btn"
            title="Emergency SOS (112)"
          >
            <FiAlertTriangle />
            <span className="emergency-pill-text">112 SOS</span>
          </NavLink>

          <NavLink
            to="/add"
            className="nav-action-btn add-contact-btn"
            title="Add New Contact"
          >
            <FiUserPlus />
            <span className="add-btn-text">Add Contact</span>
          </NavLink>

          <button
            type="button"
            className="nav-action-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          {currentUser && (
            <button
              type="button"
              className="nav-action-btn mobile-profile-btn"
              onClick={() => navigate('/profile')}
              title={`Profile - ${currentUser.name}`}
              aria-label="Profile"
            >
              <div
                className="nav-avatar-circle"
                style={{ background: currentUser.avatarBg || 'linear-gradient(135deg, #064E3B, #10B981)' }}
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="nav-avatar-img" />
                ) : (
                  <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
