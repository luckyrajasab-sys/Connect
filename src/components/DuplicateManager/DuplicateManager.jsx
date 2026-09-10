import React from 'react';
import { useContacts } from '../../context/ContactContext';
import { formatIndianPhone } from '../../utils/validation';
import { getInitials } from '../../utils/avatarHelper';
import {
  FiX,
  FiAlertTriangle,
  FiGitMerge,
  FiCheck,
  FiCopy,
  FiPhone,
  FiMail,
  FiBriefcase
} from 'react-icons/fi';
import './DuplicateManager.css';

export const DuplicateManager = () => {
  const {
    duplicateMatches,
    showDuplicateModal,
    setShowDuplicateModal,
    mergeDuplicatePair
  } = useContacts();

  if (!showDuplicateModal || duplicateMatches.length === 0) return null;

  const currentDup = duplicateMatches[0];

  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => setShowDuplicateModal(false)}>
      <div className="modal-container duplicate-modal-card animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="dup-modal-header">
          <div className="dup-title-group">
            <div className="dup-icon-badge">
              <FiAlertTriangle />
            </div>
            <div>
              <h3 className="dup-title">Possible Duplicate Contact</h3>
              <p className="dup-subtitle">
                Found {duplicateMatches.length} potential duplicate {duplicateMatches.length === 1 ? 'record' : 'records'} ({currentDup.reason})
              </p>
            </div>
          </div>
          <button
            className="dup-close-btn"
            onClick={() => setShowDuplicateModal(false)}
            aria-label="Close duplicate manager"
          >
            <FiX />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="dup-compare-body">
          {/* Primary Card */}
          <div className="dup-contact-box primary-box">
            <div className="box-badge primary-badge">Existing Record</div>
            <div
              className="dup-avatar"
              style={{ background: currentDup.primary.avatarBg || 'linear-gradient(135deg, #FF7722, #EA580C)' }}
            >
              <span>{getInitials(currentDup.primary.fullName)}</span>
            </div>
            <h4 className="dup-name">{currentDup.primary.fullName}</h4>
            <span className="dup-info-row"><FiPhone /> {formatIndianPhone(currentDup.primary.phone)}</span>
            {currentDup.primary.email && (
              <span className="dup-info-row"><FiMail /> {currentDup.primary.email}</span>
            )}
            {currentDup.primary.company && (
              <span className="dup-info-row"><FiBriefcase /> {currentDup.primary.company}</span>
            )}
          </div>

          <div className="dup-versus-divider">
            <div className="versus-badge">VS</div>
          </div>

          {/* Duplicate Card */}
          <div className="dup-contact-box duplicate-box">
            <div className="box-badge dup-badge">Matching Record</div>
            <div
              className="dup-avatar"
              style={{ background: currentDup.duplicate.avatarBg || 'linear-gradient(135deg, #00E5FF, #0284C7)' }}
            >
              <span>{getInitials(currentDup.duplicate.fullName)}</span>
            </div>
            <h4 className="dup-name">{currentDup.duplicate.fullName}</h4>
            <span className="dup-info-row"><FiPhone /> {formatIndianPhone(currentDup.duplicate.phone)}</span>
            {currentDup.duplicate.email && (
              <span className="dup-info-row"><FiMail /> {currentDup.duplicate.email}</span>
            )}
            {currentDup.duplicate.company && (
              <span className="dup-info-row"><FiBriefcase /> {currentDup.duplicate.company}</span>
            )}
          </div>
        </div>

        {/* Notice */}
        <div className="dup-notice">
          <p>
            <strong>Merge Strategy:</strong> Combines alternate phone numbers, email addresses, companies, notes, and tags into the primary contact without losing information.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="dup-modal-actions">
          <button
            className="dup-action-btn btn-ignore"
            onClick={() => setShowDuplicateModal(false)}
          >
            Ignore & Keep Both
          </button>

          <button
            className="dup-action-btn btn-merge"
            onClick={() => mergeDuplicatePair(currentDup.primary.id, currentDup.duplicate.id)}
          >
            <FiGitMerge /> Merge Contacts
          </button>
        </div>
      </div>
    </div>
  );
};
