import React from 'react';
import { useContacts } from '../../context/ContactContext';
import { getInitials } from '../../utils/avatarHelper';
import { getCategoryTheme } from '../../data/categories';
import {
  FiStar,
  FiChevronRight,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiMapPin,
  FiMessageSquare
} from 'react-icons/fi';
import './ContactCard.css';
import { EmailButton } from '../EmailButton/EmailButton';

export const ContactCard = ({ contact }) => {
  const { toggleFavorite, setActivePreviewContact, setActiveEmailContact } = useContacts();
  const categoryTheme = getCategoryTheme(contact.group || contact.category);

  const cleanDigits = (contact.phone || '').replace(/\D/g, '');
  const hasPlus = (contact.phone || '').startsWith('+');
  const intlPhone = hasPlus ? cleanDigits : (cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits);

  const handleCardClick = () => {
    setActivePreviewContact(contact);
  };

  const handleToggleStar = (e) => {
    e.stopPropagation();
    toggleFavorite(contact.id);
  };

  const handleQuickCall = (e) => {
    e.stopPropagation();
    if (contact.phone) {
      window.location.href = `tel:+${intlPhone}`;
    }
  };

  const handleQuickWhatsApp = (e) => {
    e.stopPropagation();
    if (contact.phone) {
      window.open(`https://wa.me/${intlPhone}`, '_blank');
    }
  };

  const handleQuickEmail = (e) => {
    e.stopPropagation();
    if (contact.email) {
      setActiveEmailContact(contact);
    }
  };

  return (
    <div
      className="contact-card-minimal animate-fade-in"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      title={`Click to view dossier for ${contact.fullName || contact.name}`}
    >
      <div className="card-minimal-left">
        <div
          className="contact-avatar-clean"
          style={{ background: contact.avatarBg || categoryTheme.gradient }}
        >
          {contact.avatarUrl || contact.avatar ? (
            <img src={contact.avatarUrl || contact.avatar} alt={contact.fullName || contact.name} className="avatar-img-clean" />
          ) : (
            <span>{getInitials(contact.fullName || contact.name)}</span>
          )}
        </div>

        <div className="contact-name-box">
          <div className="contact-name-header-row">
            <h3 className="contact-display-name">{contact.fullName || contact.name}</h3>
            <span
              className="contact-category-sub"
              style={{ color: categoryTheme.color, background: `${categoryTheme.color}15` }}
            >
              {categoryTheme.name}
            </span>
          </div>

          <div className="contact-meta-row">
            {contact.phone && (
              <span className="contact-meta-phone">
                <FiPhone className="mini-meta-icon" /> {contact.phone}
              </span>
            )}
            {(contact.jobTitle || contact.company) && (
              <span className="contact-meta-work">
                <FiBriefcase className="mini-meta-icon" /> {[contact.jobTitle, contact.company].filter(Boolean).join(' • ')}
              </span>
            )}
            {contact.city && !contact.phone && (
              <span className="contact-meta-location">
                <FiMapPin className="mini-meta-icon" /> {contact.city}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card-minimal-right">
        {contact.phone && (
          <div className="card-quick-actions" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="quick-card-btn call"
              onClick={handleQuickCall}
              title={`Call ${contact.phone}`}
            >
              <FiPhone />
            </button>
            <button
              type="button"
              className="quick-card-btn wa"
              onClick={handleQuickWhatsApp}
              title="WhatsApp Chat"
            >
              <FiMessageSquare />
            </button>
            {contact.email && (
              <EmailButton email={contact.email} name={contact.fullName || contact.name} variant="quick-card" />
            )}
          </div>
        )}

        <button
          className={`star-pill-btn ${contact.isFavorite || contact.favorite ? 'starred' : ''}`}
          onClick={handleToggleStar}
          aria-label={contact.isFavorite || contact.favorite ? "Remove favorite" : "Mark as favorite"}
          title={contact.isFavorite || contact.favorite ? "Starred Favorite" : "Add to favorites"}
        >
          <FiStar />
        </button>

        <FiChevronRight className="card-arrow-icon" />
      </div>
    </div>
  );
};
