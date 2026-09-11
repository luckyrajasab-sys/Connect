import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { FiLock, FiUserCheck, FiUserPlus, FiX, FiShield, FiCheck } from 'react-icons/fi';
import './AuthRequiredModal.css';

export const AuthRequiredModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalAction } = useContacts();
  const navigate = useNavigate();

  if (!isAuthModalOpen) return null;

  const handleNavigate = (path) => {
    setIsAuthModalOpen(false);
    navigate(path);
  };

  return (
    <div className="auth-req-modal-overlay animate-fade-in" onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-req-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-req-close-btn"
          onClick={() => setIsAuthModalOpen(false)}
          aria-label="Close modal"
        >
          <FiX />
        </button>

        <div className="auth-req-icon-sphere">
          <FiLock />
        </div>

        <div className="auth-req-badge">
          <FiShield />
          <span>Guest View-Only Mode</span>
        </div>

        <h2 className="auth-req-title">Sign In Required</h2>
        
        <p className="auth-req-description">
          Guest users have <strong>view-only access</strong>. Please sign in or create an account to {authModalAction || 'modify contacts'}.
        </p>

        <div className="auth-req-benefits-list">
          <div className="auth-req-benefit-item">
            <FiCheck className="benefit-check-icon" />
            <span>Add, edit, delete &amp; organize unlimited contacts</span>
          </div>
          <div className="auth-req-benefit-item">
            <FiCheck className="benefit-check-icon" />
            <span>Automatic cloud database backup &amp; multi-device sync</span>
          </div>
          <div className="auth-req-benefit-item">
            <FiCheck className="benefit-check-icon" />
            <span>Private, user-isolated secure encryption (AES-256)</span>
          </div>
        </div>

        <div className="auth-req-buttons-stack">
          <button
            type="button"
            className="auth-req-primary-btn"
            onClick={() => handleNavigate('/login')}
          >
            <FiUserCheck />
            <span>Sign In to Your Account</span>
          </button>

          <button
            type="button"
            className="auth-req-secondary-btn"
            onClick={() => handleNavigate('/signup')}
          >
            <FiUserPlus />
            <span>Create a Free Account</span>
          </button>

          <button
            type="button"
            className="auth-req-cancel-btn"
            onClick={() => setIsAuthModalOpen(false)}
          >
            Continue Browsing as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
