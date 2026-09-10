import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import {
  FiHome,
  FiUsers,
  FiStar,
  FiGrid,
  FiMapPin,
  FiBarChart2,
  FiAlertTriangle,
  FiMaximize2,
  FiPlus,
  FiLogIn
} from 'react-icons/fi';
import './Sidebar.css';

export const Sidebar = () => {
  const { stats, currentUser } = useContacts();
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileActive = location.pathname === '/profile';

  return (
    <div className="sidebar-dock-wrapper">
      <aside className="flying-sidebar animate-fade-in" aria-label="Main Navigation">
        {/* Brand Badge */}
        <NavLink to="/" className="sidebar-brand-link" aria-label="Connect Home" title="Connect Home">
          <div className="sidebar-brand-badge">
            <span className="brand-v-letter">C</span>
            <span className="brand-glow-dot"></span>
          </div>
        </NavLink>

        {/* Navigation List - 8 Essential Hubs (Zero Duplicates) */}
        <div className="sidebar-nav-container">
          <nav className="sidebar-nav-list">
            <NavLink
              to="/"
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              end
              title="Home Dashboard"
              aria-label="Home Dashboard"
            >
              <div className="sidebar-icon-wrap">
                <FiHome className="sidebar-icon" />
              </div>
              <span className="sidebar-tooltip">Dashboard</span>
            </NavLink>

            <NavLink
              to="/contacts"
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              title="All Contacts"
              aria-label="All Contacts"
            >
              <div className="sidebar-icon-wrap">
                <FiUsers className="sidebar-icon" />
                {stats.total > 0 && <span className="nav-badge-count">{stats.total}</span>}
              </div>
              <span className="sidebar-tooltip">Contacts</span>
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              title="Favorites"
              aria-label="Favorites"
            >
              <div className="sidebar-icon-wrap">
                <FiStar className="sidebar-icon" />
                {stats.favorites > 0 && <span className="nav-badge-count text-amber">{stats.favorites}</span>}
              </div>
              <span className="sidebar-tooltip">Favorites</span>
            </NavLink>

            <NavLink
              to="/groups"
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              title="Categories & Groups"
              aria-label="Categories & Groups"
            >
              <div className="sidebar-icon-wrap">
                <FiGrid className="sidebar-icon" />
              </div>
              <span className="sidebar-tooltip">Groups</span>
            </NavLink>

            <NavLink
              to="/map"
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              title="Location Map"
              aria-label="Location Map"
            >
              <div className="sidebar-icon-wrap">
                <FiMapPin className="sidebar-icon" />
              </div>
              <span className="sidebar-tooltip">Map</span>
            </NavLink>

            <NavLink
              to="/analytics"
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              title="Analytics"
              aria-label="Analytics"
            >
              <div className="sidebar-icon-wrap">
                <FiBarChart2 className="sidebar-icon" />
              </div>
              <span className="sidebar-tooltip">Analytics</span>
            </NavLink>

            <NavLink
              to="/emergency"
              className={({ isActive }) => `sidebar-nav-item emergency-sidebar-link ${isActive ? 'active' : ''}`}
              title="Emergency SOS (112)"
              aria-label="Emergency SOS (112)"
            >
              <div className="sidebar-icon-wrap">
                <FiAlertTriangle className="sidebar-icon" />
                <span className="emergency-live-dot"></span>
              </div>
              <span className="sidebar-tooltip">Emergency (112)</span>
            </NavLink>

            <NavLink
              to="/qr"
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              title="QR Hub & Scanner"
              aria-label="QR Hub & Scanner"
            >
              <div className="sidebar-icon-wrap">
                <FiMaximize2 className="sidebar-icon" />
              </div>
              <span className="sidebar-tooltip">QR Scanner</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Actions: Add Contact + User Profile / Login */}
        <div className="sidebar-actions-section">
          <button
            className="sidebar-action-icon-btn create-action-btn"
            onClick={() => navigate('/add')}
            title="Add New Contact"
            aria-label="Add New Contact"
          >
            <div className="sidebar-icon-wrap">
              <FiPlus />
            </div>
            <span className="sidebar-tooltip">Add Contact</span>
          </button>

          {currentUser ? (
            <button
              className={`sidebar-user-avatar-btn ${isProfileActive ? 'active-profile-dock' : ''}`}
              onClick={() => navigate('/profile')}
              title={`Logged in as ${currentUser.name} (${currentUser.email}) - View Profile`}
              aria-label={`User Profile - ${currentUser.name}`}
            >
              <div
                className="sidebar-user-avatar-inner"
                style={{ background: currentUser.avatarBg || 'linear-gradient(135deg, #064E3B, #10B981)' }}
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="sidebar-user-img" />
                ) : (
                  <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                )}
                <span className="user-online-indicator"></span>
              </div>
              <span className="sidebar-tooltip">{currentUser.name} (Profile &amp; Settings)</span>
            </button>
          ) : (
            <button
              className="sidebar-action-icon-btn login-action-btn"
              onClick={() => navigate('/login')}
              title="Sign In / Register"
              aria-label="Sign In / Register"
            >
              <div className="sidebar-icon-wrap">
                <FiLogIn />
              </div>
              <span className="sidebar-tooltip">Sign In</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
