import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { getInitials } from '../../utils/avatarHelper';
import { formatIndianPhone, cleanPhoneDigits } from '../../utils/validation';
import { getCategoryTheme } from '../../data/categories';
import {
  FiX,
  FiMaximize2,
  FiPhone,
  FiMessageSquare,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiStar,
  FiShare2,
  FiEdit2,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import './PopCard.css';

export const PopCard = () => {
  const {
    activePreviewContact,
    setActivePreviewContact,
    toggleFavorite,
    setActiveEmailContact,
    setActiveQRContact,
    setActiveShareContact,
    logInteraction
  } = useContacts();

  const navigate = useNavigate();

  if (!activePreviewContact) return null;

  const contact = activePreviewContact;
  const categoryTheme = getCategoryTheme(contact.group);
  const rawPhone = cleanPhoneDigits(contact.phone);

  const handleCall = (e) => {
    e.stopPropagation();
    logInteraction(contact.id, 'call');
    window.location.href = `tel:+91${rawPhone}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    logInteraction(contact.id, 'whatsapp');
    window.open(`https://wa.me/91${rawPhone}`, '_blank');
  };

  const handleEmail = (e) => {
    e.stopPropagation();
    setActivePreviewContact(null);
    setActiveEmailContact(contact);
  };

  const handleQR = (e) => {
    e.stopPropagation();
    setActivePreviewContact(null);
    setActiveQRContact(contact);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setActivePreviewContact(null);
    setActiveShareContact(contact);
  };

  const handleExpandToFullScreen = () => {
    const targetId = contact.id;
    setActivePreviewContact(null);
    navigate(`/contacts/${targetId}`);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => setActivePreviewContact(null)}>
      <div className="popcard-container animate-pop-in" onClick={e => e.stopPropagation()}>
        {/* Card Header */}
        <div className="popcard-top-bar">
          <div className="popcard-cat-badge" style={{ color: categoryTheme.color, background: `${categoryTheme.color}15`, borderColor: `${categoryTheme.color}35` }}>
            <span className="cat-dot" style={{ background: categoryTheme.color }}></span>
            <span>{categoryTheme.name}</span>
          </div>

          <div className="popcard-top-actions">
            <button
              className={`popcard-star-btn ${contact.isFavorite ? 'starred' : ''}`}
              onClick={() => toggleFavorite(contact.id)}
              title={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-label="Favorite"
            >
              <FiStar />
            </button>
            <button
              className="popcard-close-btn"
              onClick={() => setActivePreviewContact(null)}
              aria-label="Close preview"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Profile Identity */}
        <div className="popcard-profile-hero">
          <div
            className="popcard-avatar"
            style={{ background: contact.avatarBg || categoryTheme.gradient }}
          >
            {contact.avatarUrl ? (
              <img src={contact.avatarUrl} alt={contact.fullName} className="popcard-avatar-img" />
            ) : (
              <span>{getInitials(contact.fullName)}</span>
            )}
          </div>
          <h2 className="popcard-name">{contact.fullName}</h2>
          {(contact.jobTitle || contact.company) && (
            <p className="popcard-role">
              <FiBriefcase className="mini-icon" />
              {[contact.jobTitle, contact.company].filter(Boolean).join(' at ')}
            </p>
          )}
        </div>

        {/* Info Grid */}
        <div className="popcard-info-box">
          <div className="popcard-info-row">
            <span className="info-key"><FiPhone /> Mobile:</span>
            <span className="info-val font-numeric">{formatIndianPhone(contact.phone)}</span>
          </div>

          {contact.email && (
            <div className="popcard-info-row">
              <span className="info-key"><FiMail /> Email:</span>
              <span className="info-val email-val" onClick={handleEmail}>{contact.email}</span>
            </div>
          )}

          {contact.city && (
            <div className="popcard-info-row">
              <span className="info-key"><FiMapPin /> Location:</span>
              <span className="info-val">{[contact.city, contact.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Quick Dial Buttons */}
        <div className="popcard-quick-actions">
          <button className="pop-btn btn-call" onClick={handleCall}>
            <FiPhone /> Call
          </button>
          <button className="pop-btn btn-whatsapp" onClick={handleWhatsApp}>
            <FiMessageSquare /> WhatsApp
          </button>
          {contact.email && (
            <button className="pop-btn btn-email" onClick={handleEmail}>
              <FiMail /> Email
            </button>
          )}
          <button className="pop-btn btn-qr" onClick={handleQR} title="Generate vCard QR">
            <FiMaximize2 /> QR
          </button>
          <button className="pop-btn btn-share" onClick={handleShare} title="Share Contact">
            <FiShare2 />
          </button>
        </div>

        {/* Expand to Full Screen CTA Button */}
        <div className="popcard-expand-footer">
          <button
            className="popcard-expand-btn"
            onClick={handleExpandToFullScreen}
          >
            <FiMaximize2 className="expand-svg" />
            <span>Expand to Full Screen</span>
            <FiArrowRight className="arrow-svg" />
          </button>
        </div>
      </div>
    </div>
  );
};
