import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { getInitials } from '../../utils/avatarHelper';
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
  FiGlobe
} from 'react-icons/fi';
import './PopCard.css';

export const PopCard = () => {
  const {
    activePreviewContact,
    setActivePreviewContact,
    toggleFavorite,
    setActiveEmailContact,
    setActiveQRContact,
    setActiveShareContact
  } = useContacts();

  const navigate = useNavigate();

  if (!activePreviewContact) return null;

  const contact = activePreviewContact;
  const categoryTheme = getCategoryTheme(contact.group || contact.category);
  
  // Format international phone number for click-to-call and WhatsApp
  const cleanDigits = (contact.phone || '').replace(/\D/g, '');
  const hasPlus = (contact.phone || '').startsWith('+');
  const intlNumber = hasPlus ? cleanDigits : (cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits);

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:+${intlNumber}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    window.open(`https://wa.me/${intlNumber}`, '_blank');
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
              className={`popcard-star-btn ${contact.isFavorite || contact.favorite ? 'starred' : ''}`}
              onClick={() => toggleFavorite(contact.id)}
              title={contact.isFavorite || contact.favorite ? "Remove from favorites" : "Add to favorites"}
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
            {contact.avatarUrl || contact.avatar ? (
              <img src={contact.avatarUrl || contact.avatar} alt={contact.fullName || contact.name} className="popcard-avatar-img" />
            ) : (
              <span>{getInitials(contact.fullName || contact.name)}</span>
            )}
          </div>
          <h2 className="popcard-name">{contact.fullName || contact.name}</h2>
          {(contact.jobTitle || contact.company) && (
            <p className="popcard-role">
              <FiBriefcase className="mini-icon" />
              {[contact.jobTitle, contact.company].filter(Boolean).join(' at ')}
            </p>
          )}
        </div>

        {/* Info Grid */}
        <div className="popcard-info-box">
          {contact.phone && (
            <div className="popcard-info-row">
              <span className="info-key"><FiPhone /> Phone:</span>
              <span className="info-val font-numeric">{contact.phone}</span>
            </div>
          )}

          {contact.email && (
            <div className="popcard-info-row">
              <span className="info-key"><FiMail /> Email:</span>
              <span className="info-val email-val" onClick={handleEmail}>{contact.email}</span>
            </div>
          )}

          {(contact.city || contact.country || contact.state) && (
            <div className="popcard-info-row">
              <span className="info-key"><FiMapPin /> Location:</span>
              <span className="info-val">{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</span>
            </div>
          )}

          {contact.website && (
            <div className="popcard-info-row">
              <span className="info-key"><FiGlobe /> Website:</span>
              <a href={contact.website} target="_blank" rel="noopener noreferrer" className="info-val website-val">
                {contact.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Quick Action Matrix */}
        <div className="popcard-actions-grid">
          {contact.phone && (
            <>
              <button className="action-tile-btn call-tile" onClick={handleCall} title="Direct Phone Call">
                <FiPhone />
                <span>Call</span>
              </button>
              <button className="action-tile-btn wa-tile" onClick={handleWhatsApp} title="Chat on WhatsApp">
                <FiMessageSquare />
                <span>WhatsApp</span>
              </button>
            </>
          )}
          {contact.email && (
            <button className="action-tile-btn email-tile" onClick={handleEmail} title="Compose Email">
              <FiMail />
              <span>Email</span>
            </button>
          )}
          <button className="action-tile-btn qr-tile" onClick={handleQR} title="Show QR vCard">
            <FiMaximize2 />
            <span>QR Code</span>
          </button>
          <button className="action-tile-btn share-tile" onClick={handleShare} title="Share Contact Card">
            <FiShare2 />
            <span>Share</span>
          </button>
        </div>

        {/* View Full Dossier Button */}
        <button className="popcard-full-btn" onClick={handleExpandToFullScreen}>
          <span>View Full Contact Dossier</span>
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
};
