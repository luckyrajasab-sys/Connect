import React from 'react';
import { FiSearch, FiInbox, FiStar, FiUsers, FiAlertCircle } from 'react-icons/fi';
import './EmptyState.css';

export const EmptyState = ({
  iconType = "search",
  title = "No Contacts Found",
  description = "Try adjusting your search criteria or add a new contact.",
  actionText,
  onAction
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'star':
      case 'favorites':
        return <FiStar className="empty-svg-icon text-amber" />;
      case 'users':
      case 'contacts':
        return <FiUsers className="empty-svg-icon text-saffron" />;
      case 'emergency':
        return <FiAlertCircle className="empty-svg-icon text-red" />;
      case 'inbox':
        return <FiInbox className="empty-svg-icon text-muted" />;
      case 'search':
      default:
        return <FiSearch className="empty-svg-icon text-muted" />;
    }
  };

  return (
    <div className="empty-state-card animate-fade-in">
      <div className="empty-icon-bubble">
        {renderIcon()}
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {actionText && onAction && (
        <button className="empty-action-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
