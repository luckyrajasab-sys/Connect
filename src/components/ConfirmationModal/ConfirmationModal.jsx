import React, { useEffect } from 'react';
import { FiAlertTriangle, FiPhoneCall, FiTrash2, FiX } from 'react-icons/fi';
import './ConfirmationModal.css';

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // "emergency", "danger", "default"
  onConfirm,
  onCancel,
  disclaimer
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onCancel} role="dialog" aria-modal="true">
      <div
        className={`modal-container modal-${type} animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onCancel} aria-label="Close dialog">
          <FiX />
        </button>

        <div className="modal-header">
          <div className={`modal-icon-badge badge-${type}`}>
            {type === 'emergency' && <FiPhoneCall />}
            {type === 'danger' && <FiTrash2 />}
            {type === 'default' && <FiAlertTriangle />}
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
          {disclaimer && (
            <div className="modal-disclaimer">
              <FiAlertTriangle className="disclaimer-icon" />
              <span>{disclaimer}</span>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`modal-btn btn-primary btn-${type}`}
            onClick={onConfirm}
            autoFocus
          >
            {type === 'emergency' && <FiPhoneCall className="btn-icon" />}
            {type === 'danger' && <FiTrash2 className="btn-icon" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
