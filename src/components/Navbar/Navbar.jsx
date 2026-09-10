import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { FiSun, FiMoon, FiUserPlus, FiAlertCircle, FiSearch, FiBook } from 'react-icons/fi';
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
  const { theme, toggleTheme, stats } = useContacts();
  const navigate = useNavigate();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand */}
        <NavLink to="/" className="brand-logo" aria-label="Connect Home">
          <div className="brand-flag-badge">
            <ConnectLogo />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">Connect<span className="brand-dot">.</span></span>
            <span className="brand-subtitle">Smart Contact Hub</span>
          </div>
        </NavLink>

        {/* Header Right Actions */}
        <div className="navbar-actions">
          <button
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
            title="Emergency Services (112)"
          >
            <FiAlertCircle />
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
            className="nav-action-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
        </div>
      </div>
    </header>
  );
};
