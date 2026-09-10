import React, { useState } from 'react';
import { ContactForm } from '../../components/ContactForm/ContactForm';
import { SocialImportModal } from '../../components/SocialImportModal/SocialImportModal';
import { useContacts } from '../../context/ContactContext';
import {
  FiEdit3,
  FiPhone,
  FiUpload
} from 'react-icons/fi';
import './AddContact.css';

// Google Multicolor Icon Component
const GoogleIcon = () => (
  <svg className="action-brand-svg" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

// Apple Icon Component
const AppleIcon = () => (
  <svg className="action-brand-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.56.65-1.05 1.71-.92 2.74 1.01.08 2.03-.5 2.62-1.24z" />
  </svg>
);

export const AddContact = () => {
  const { importFromMobilePicker } = useContacts();
  const [activeImportModal, setActiveImportModal] = useState(null); // 'google' | 'apple' | null

  return (
    <div className="add-contact-page animate-fade-in">
      {/* Top Import / Source Choices Bar */}
      <div className="add-contact-sources-bar">
        <div className="sources-bar-header">
          <span className="sources-bar-label">Choose How to Add Contacts:</span>
        </div>

        <div className="sources-action-cards-grid">
          <button
            type="button"
            className="source-card-btn active-manual"
            onClick={() => {}}
          >
            <div className="source-card-icon text-emerald">
              <FiEdit3 />
            </div>
            <div className="source-card-text">
              <strong>Manual Entry</strong>
              <span>Add custom profile dossier</span>
            </div>
          </button>

          <button
            type="button"
            className="source-card-btn google-source-card"
            onClick={() => setActiveImportModal('google')}
          >
            <div className="source-card-icon">
              <GoogleIcon />
            </div>
            <div className="source-card-text">
              <strong>Google Contacts</strong>
              <span>Import from Gmail address book</span>
            </div>
          </button>

          <button
            type="button"
            className="source-card-btn apple-source-card"
            onClick={() => setActiveImportModal('apple')}
          >
            <div className="source-card-icon">
              <AppleIcon />
            </div>
            <div className="source-card-text">
              <strong>Apple Contacts</strong>
              <span>Import iCloud or .vcf export</span>
            </div>
          </button>

          <button
            type="button"
            className="source-card-btn device-source-card"
            onClick={importFromMobilePicker}
          >
            <div className="source-card-icon text-blue">
              <FiPhone />
            </div>
            <div className="source-card-text">
              <strong>Phone Contacts</strong>
              <span>Pick from mobile device</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Manual Dossier Form */}
      <ContactForm isEditMode={false} />

      {/* Google / Apple Import Modal */}
      {activeImportModal && (
        <SocialImportModal
          isOpen={Boolean(activeImportModal)}
          provider={activeImportModal}
          onClose={() => setActiveImportModal(null)}
        />
      )}
    </div>
  );
};
