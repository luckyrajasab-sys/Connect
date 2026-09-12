import React, { useState, useRef, useEffect } from 'react';
import { FiMail, FiChevronDown } from 'react-icons/fi';
import { openMailProvider } from '../../utils/mailProviders';
import './EmailButton.css';

export const EmailButton = ({ email, name, variant = 'tile' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!email) return null;

  const handleProviderSelect = (e, provider) => {
    e.stopPropagation();
    openMailProvider(provider, email, name);
    setIsOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Determine button classes based on variant
  let btnClass = '';
  let content = null;

  if (variant === 'tile') {
    btnClass = 'action-tile-btn email-tile';
    content = (
      <>
        <FiMail />
        <span className="email-btn-label">
          Email <FiChevronDown className="email-chevron" />
        </span>
      </>
    );
  } else if (variant === 'd-btn') {
    btnClass = 'd-btn email-d-btn';
    content = (
      <>
        <FiMail />
        <span className="email-btn-label">
          Email <FiChevronDown className="email-chevron" />
        </span>
      </>
    );
  } else if (variant === 'quick-card') {
    btnClass = 'quick-card-btn email';
    content = (
      <>
        <FiMail />
      </>
    );
  }

  return (
    <div className="email-button-wrapper" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className={btnClass}
        onClick={toggleDropdown}
        title="Compose Email"
      >
        {content}
      </button>

      {isOpen && (
        <div className="email-dropdown-menu animate-fade-in-up">
          <button 
            type="button"
            className="email-dropdown-item"
            onClick={(e) => handleProviderSelect(e, 'gmail')}
          >
            Gmail
          </button>
          <button 
            type="button"
            className="email-dropdown-item"
            onClick={(e) => handleProviderSelect(e, 'outlook')}
          >
            Outlook
          </button>
          <div className="email-dropdown-divider"></div>
          <button 
            type="button"
            className="email-dropdown-item"
            onClick={(e) => handleProviderSelect(e, 'default')}
          >
            Default Mail App
          </button>
        </div>
      )}
    </div>
  );
};
