import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiStar,
  FiMapPin,
  FiAlertTriangle,
  FiSettings,
  FiUser
} from 'react-icons/fi';
import './BottomNavigation.css';

export const BottomNavigation = () => {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <NavLink
        to="/"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        end
      >
        <FiHome className="mobile-nav-icon" />
        <span className="mobile-nav-label">Home</span>
      </NavLink>

      <NavLink
        to="/contacts"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <FiUsers className="mobile-nav-icon" />
        <span className="mobile-nav-label">Contacts</span>
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <FiStar className="mobile-nav-icon" />
        <span className="mobile-nav-label">Favorites</span>
      </NavLink>

      <NavLink
        to="/map"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <FiMapPin className="mobile-nav-icon" />
        <span className="mobile-nav-label">Map</span>
      </NavLink>

      <NavLink
        to="/emergency"
        className={({ isActive }) => `mobile-nav-item emergency-mobile-item ${isActive ? 'active' : ''}`}
      >
        <FiAlertTriangle className="mobile-nav-icon" />
        <span className="mobile-nav-label">SOS</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <FiUser className="mobile-nav-icon" />
        <span className="mobile-nav-label">Profile</span>
      </NavLink>
    </nav>
  );
};
