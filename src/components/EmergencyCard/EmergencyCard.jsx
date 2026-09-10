import React, { useState } from 'react';
import { FiPhoneCall } from 'react-icons/fi';
import { getEmergencyIcon } from '../../utils/iconHelper';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import './EmergencyCard.css';

export const EmergencyCard = ({ contact }) => {
  const [showCallModal, setShowCallModal] = useState(false);

  const handleCallConfirm = () => {
    setShowCallModal(false);
    window.location.href = `tel:${contact.number}`;
  };

  return (
    <>
      <div className={`emergency-card ${contact.priority === 'highest' ? 'card-highest-priority' : ''}`}>
        <div className="emergency-card-body">
          <div className="emergency-header-top">
            <div className="emergency-icon-circle">
              {getEmergencyIcon(contact.iconType)}
            </div>
            <div className="emergency-badges">
              <span className="emergency-badge category-badge">{contact.category}</span>
              {contact.badge && (
                <span className="emergency-badge spec-badge">{contact.badge}</span>
              )}
            </div>
          </div>

          <div className="emergency-info">
            <h3 className="emergency-title">{contact.name}</h3>
            <div className="emergency-dial-box">
              <span className="dial-number">{contact.number}</span>
              <span className="dial-tollfree">24x7 Helpline</span>
            </div>
            <p className="emergency-description">{contact.description}</p>
          </div>
        </div>

        <div className="emergency-footer">
          <button
            type="button"
            className="emergency-call-button"
            onClick={() => setShowCallModal(true)}
            aria-label={`Call emergency service ${contact.name} at ${contact.number}`}
          >
            <FiPhoneCall className="call-btn-icon" />
            <span className="call-btn-label">Call {contact.number} Now</span>
          </button>
        </div>
      </div>

      {/* Emergency Call Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCallModal}
        type="emergency"
        title={`Call ${contact.name}?`}
        message={`Are you sure you want to call this emergency service (${contact.number})?`}
        disclaimer="Emergency service availability may vary by location. Please verify local emergency services when necessary."
        confirmText={`Call ${contact.number} Now`}
        cancelText="Cancel"
        onConfirm={handleCallConfirm}
        onCancel={() => setShowCallModal(false)}
      />
    </>
  );
};
