import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { formatIndianPhone } from '../../utils/validation';
import {
  FiPhone,
  FiPhoneCall,
  FiX,
  FiUserPlus,
  FiMessageSquare,
  FiDelete,
  FiUserCheck
} from 'react-icons/fi';
import './FloatingDialer.css';

const DIALPAD_KEYS = [
  { key: '1', sub: ' ' },
  { key: '2', sub: 'ABC' },
  { key: '3', sub: 'DEF' },
  { key: '4', sub: 'GHI' },
  { key: '5', sub: 'JKL' },
  { key: '6', sub: 'MNO' },
  { key: '7', sub: 'PQRS' },
  { key: '8', sub: 'TUV' },
  { key: '9', sub: 'WXYZ' },
  { key: '*', sub: ' ' },
  { key: '0', sub: '+' },
  { key: '#', sub: ' ' }
];

export const FloatingDialer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialedNumber, setDialedNumber] = useState('');
  const { contacts, showToast } = useContacts();
  const navigate = useNavigate();
  const location = useLocation();

  const isFormPage = location.pathname === '/add' || location.pathname.startsWith('/edit');

  if (isFormPage) return null;

  // Find if matching any saved contact
  const cleanDigits = dialedNumber.replace(/\D/g, '');
  const matchedContact = cleanDigits.length >= 4
    ? contacts.find(c => (c.phone || '').replace(/\D/g, '').includes(cleanDigits))
    : null;

  // Handle typing via physical keyboard when modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (/^[0-9*#]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'Enter') {
        handleDirectCall();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dialedNumber]);

  const handleKeyPress = (char) => {
    if (dialedNumber.length >= 15) return;
    setDialedNumber(prev => prev + char);
  };

  const handleBackspace = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDialedNumber('');
  };

  const handleDirectCall = () => {
    const rawNumber = dialedNumber.replace(/\D/g, '');
    if (!rawNumber) {
      showToast('Please dial a phone number first', 'warning');
      return;
    }
    window.location.href = `tel:+91${rawNumber}`;
  };

  const handleWhatsApp = () => {
    const rawNumber = dialedNumber.replace(/\D/g, '');
    if (!rawNumber) {
      showToast('Please dial a phone number first', 'warning');
      return;
    }
    window.open(`https://wa.me/91${rawNumber}`, '_blank');
  };

  const handleSaveContact = () => {
    const rawNumber = dialedNumber.replace(/\D/g, '');
    setIsOpen(false);
    navigate('/add', { state: { initialPhone: rawNumber } });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className={`flying-dialer-fab ${isOpen ? 'active-open' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        title="Quick Dial Unknown Number"
        aria-label="Quick Dial Unknown Number"
      >
        <div className="fab-icon-wrap">
          {isOpen ? <FiX /> : <FiPhoneCall />}
        </div>
        <span className="fab-pulse-ring"></span>
      </button>

      {/* Dialpad Modal Overlay */}
      {isOpen && (
        <div className="dialer-modal-backdrop animate-fade-in" onClick={() => setIsOpen(false)}>
          <div className="dialer-sheet-card animate-slide-up" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="dialer-header">
              <div className="dialer-title-box">
                <FiPhoneCall className="dialer-title-icon" />
                <span className="dialer-title-text">Quick Phone Dialer</span>
              </div>
              <button
                className="dialer-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Dialer"
              >
                <FiX />
              </button>
            </div>

            {/* Display Screen */}
            <div className="dialer-screen">
              <span className="dialer-country-tag">+91</span>
              <div className="dialer-number-wrapper">
                <input
                  type="text"
                  readOnly
                  value={dialedNumber ? formatIndianPhone(dialedNumber).replace('+91 ', '') : ''}
                  placeholder="Enter number..."
                  className="dialer-number-input"
                />
              </div>
              {dialedNumber && (
                <button
                  className="dialer-backspace-btn"
                  onClick={handleBackspace}
                  onDoubleClick={handleClear}
                  title="Backspace (Double tap to clear)"
                  aria-label="Backspace"
                >
                  <FiDelete />
                </button>
              )}
            </div>

            {/* Match Preview Badge */}
            {matchedContact ? (
              <div
                className="dialer-matched-banner"
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/contacts/${matchedContact.id}`);
                }}
              >
                <FiUserCheck className="matched-icon" />
                <span className="matched-text">
                  Saved Contact: <strong>{matchedContact.fullName}</strong>
                </span>
              </div>
            ) : (
              <div className="dialer-unknown-banner">
                <span>Unknown / Direct Indian Number</span>
              </div>
            )}

            {/* Keypad Grid */}
            <div className="dialer-keypad-grid">
              {DIALPAD_KEYS.map((item) => (
                <button
                  key={item.key}
                  className="dialpad-key-btn"
                  onClick={() => handleKeyPress(item.key)}
                >
                  <span className="key-main">{item.key}</span>
                  <span className="key-sub">{item.sub}</span>
                </button>
              ))}
            </div>

            {/* Bottom Actions Bar */}
            <div className="dialer-actions-row">
              <button
                className="dialer-action-sub-btn"
                onClick={handleWhatsApp}
                title="Message on WhatsApp"
                disabled={!dialedNumber}
              >
                <FiMessageSquare />
                <span>WhatsApp</span>
              </button>

              <button
                className="dialer-call-primary-btn"
                onClick={handleDirectCall}
                title="Call Number"
              >
                <FiPhone className="call-btn-svg" />
                <span>Call</span>
              </button>

              <button
                className="dialer-action-sub-btn"
                onClick={handleSaveContact}
                title="Save to Contacts"
                disabled={!dialedNumber}
              >
                <FiUserPlus />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
