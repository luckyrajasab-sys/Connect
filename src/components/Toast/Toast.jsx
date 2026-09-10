import React from 'react';
import { useContacts } from '../../context/ContactContext';
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import './Toast.css';

export const ToastNotification = () => {
  const { toasts, removeToast } = useContacts();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="toast-icon success" />;
      case 'warning':
        return <FiAlertTriangle className="toast-icon warning" />;
      default:
        return <FiInfo className="toast-icon info" />;
    }
  };

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-card toast-${toast.type} animate-slide-up`}>
          <div className="toast-icon-wrapper">
            {getIcon(toast.type)}
          </div>
          <div className="toast-content">
            <p className="toast-message">{toast.message}</p>
          </div>
          <button
            className="toast-close-btn"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
};
