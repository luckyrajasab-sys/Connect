import React from 'react';
import { useContacts } from '../../context/ContactContext';
import { getInitials } from '../../utils/avatarHelper';
import { getCategoryTheme } from '../../data/categories';
import { FiStar, FiChevronRight } from 'react-icons/fi';
import './ContactCard.css';

export const ContactCard = ({ contact }) => {
  const { toggleFavorite, setActivePreviewContact } = useContacts();
  const categoryTheme = getCategoryTheme(contact.group);

  const handleCardClick = () => {
    setActivePreviewContact(contact);
  };

  const handleToggleStar = (e) => {
    e.stopPropagation();
    toggleFavorite(contact.id);
  };

  return (
    <div
      className="contact-card-minimal animate-fade-in"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      title={`Click to view ${contact.fullName}`}
    >
      <div className="card-minimal-left">
        <div
          className="contact-avatar-clean"
          style={{ background: contact.avatarBg || categoryTheme.gradient }}
        >
          {contact.avatarUrl ? (
            <img src={contact.avatarUrl} alt={contact.fullName} className="avatar-img-clean" />
          ) : (
            <span>{getInitials(contact.fullName)}</span>
          )}
        </div>

        <div className="contact-name-box">
          <h3 className="contact-display-name">{contact.fullName}</h3>
          <span className="contact-category-sub" style={{ color: categoryTheme.color }}>
            {categoryTheme.name}
          </span>
        </div>
      </div>

      <div className="card-minimal-right">
        <button
          className={`star-pill-btn ${contact.isFavorite ? 'starred' : ''}`}
          onClick={handleToggleStar}
          aria-label={contact.isFavorite ? "Remove favorite" : "Mark as favorite"}
        >
          <FiStar />
        </button>
        <FiChevronRight className="card-arrow-icon" />
      </div>
    </div>
  );
};
