import React from 'react';
import { NavLink } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import {
  FiHome,
  FiUsers,
  FiPlus,
  FiStar,
  FiMenu
} from 'react-icons/fi';
import './BottomNavigation.css';

export const BottomNavigation = () => {
  const { stats, setIsMobileMenuOpen } = useContacts();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <NavLink
        to="/"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        end
      >
        <div className="mobile-nav-icon-wrap">
          <FiHome className="mobile-nav-icon" />
        </div>
        <span className="mobile-nav-label">Home</span>
      </NavLink>

      <NavLink
        to="/contacts"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="mobile-nav-icon-wrap">
          <FiUsers className="mobile-nav-icon" />
          {stats.total > 0 && <span className="mobile-nav-badge">{stats.total}</span>}
        </div>
        <span className="mobile-nav-label">Contacts</span>
      </NavLink>

      <NavLink
        to="/add"
        className={({ isActive }) => `mobile-nav-item mobile-nav-fab ${isActive ? 'active' : ''}`}
        aria-label="Add Contact"
      >
        <div className="mobile-fab-circle">
          <FiPlus />
        </div>
        <span className="mobile-nav-label">Add</span>
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="mobile-nav-icon-wrap">
          <FiStar className="mobile-nav-icon" />
          {stats.favorites > 0 && <span className="mobile-nav-badge badge-amber">{stats.favorites}</span>}
        </div>
        <span className="mobile-nav-label">Starred</span>
      </NavLink>

      <button
        type="button"
        className="mobile-nav-item mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open Full Menu"
      >
        <div className="mobile-nav-icon-wrap">
          <FiMenu className="mobile-nav-icon" />
        </div>
        <span className="mobile-nav-label">Menu</span>
      </button>
    </nav>
  );
};
