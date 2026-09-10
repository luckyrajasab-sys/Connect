import React, { useState, useRef } from 'react';
import { useContacts } from '../../context/ContactContext';
import {
  FiDownload,
  FiUpload,
  FiCheck,
  FiX,
  FiSearch,
  FiUserPlus,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiHardDrive
} from 'react-icons/fi';
import './SocialImportModal.css';

// Google Multicolor Icon Component
const GoogleIcon = () => (
  <svg className="social-modal-brand-icon" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
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
  <svg className="social-modal-brand-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.56.65-1.05 1.71-.92 2.74 1.01.08 2.03-.5 2.62-1.24z" />
  </svg>
);

const SAMPLE_GOOGLE_CONTACTS = [
  {
    fullName: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@gmail.com',
    phone: '9820199887',
    company: 'Google Cloud Partner',
    jobTitle: 'Solutions Architect',
    city: 'Pune',
    state: 'Maharashtra',
    group: 'work',
    avatarBg: 'linear-gradient(135deg, #4285F4, #34A853)'
  },
  {
    fullName: 'Ananya Roy',
    email: 'ananya.roy@gmail.com',
    phone: '9830112233',
    company: 'Bengaluru Tech Hub',
    jobTitle: 'Lead UX Designer',
    city: 'Bangalore',
    state: 'Karnataka',
    group: 'friends',
    avatarBg: 'linear-gradient(135deg, #EA4335, #FBBC05)'
  },
  {
    fullName: 'Vikramaditya Sengupta',
    email: 'vikram.sengupta@gmail.com',
    phone: '9810998877',
    company: 'Capital Investments India',
    jobTitle: 'Portfolio Director',
    city: 'Delhi',
    state: 'Delhi',
    group: 'vip',
    avatarBg: 'linear-gradient(135deg, #10B981, #059669)'
  },
  {
    fullName: 'Deepika Ramanathan',
    email: 'deepika.raman@gmail.com',
    phone: '9840123456',
    company: 'Ramanathan Clinics',
    jobTitle: 'Dental Surgeon',
    city: 'Chennai',
    state: 'Tamil Nadu',
    group: 'family',
    avatarBg: 'linear-gradient(135deg, #A855F7, #7E22CE)'
  }
];

const SAMPLE_APPLE_CONTACTS = [
  {
    fullName: 'Siddharth Mehra',
    email: 'siddharth.mehra@icloud.com',
    phone: '9811223344',
    company: 'Apple Design Studio',
    jobTitle: 'Creative Director',
    city: 'Mumbai',
    state: 'Maharashtra',
    group: 'work',
    avatarBg: 'linear-gradient(135deg, #1C1917, #44403C)'
  },
  {
    fullName: 'Kavita Joshi',
    email: 'kavita.joshi@me.com',
    phone: '9822334455',
    company: 'Joshi Legal Advocates',
    jobTitle: 'Senior Advocate',
    city: 'Pune',
    state: 'Maharashtra',
    group: 'vip',
    avatarBg: 'linear-gradient(135deg, #374151, #111827)'
  },
  {
    fullName: 'Dr. Nikhil Rao',
    email: 'dr.nikhil.rao@icloud.com',
    phone: '9877001122',
    company: 'Care Medical Foundation',
    jobTitle: 'Emergency Surgeon',
    city: 'Hyderabad',
    state: 'Telangana',
    group: 'emergency',
    avatarBg: 'linear-gradient(135deg, #DC2626, #991B1B)'
  }
];

export const SocialImportModal = ({ isOpen, onClose, provider = 'google' }) => {
  const { currentUser, importContactsList, importVCardRaw, importCSVRaw, showToast } = useContacts();
  const fileInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const initialContacts = provider === 'google' ? SAMPLE_GOOGLE_CONTACTS : SAMPLE_APPLE_CONTACTS;
  const [selectedIndices, setSelectedIndices] = useState(() => initialContacts.map((_, i) => i));

  if (!isOpen) return null;

  const toggleSelect = (index) => {
    setSelectedIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIndices.length === initialContacts.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(initialContacts.map((_, i) => i));
    }
  };

  const filteredContacts = initialContacts.filter(c =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleImportSelected = () => {
    const toImport = initialContacts.filter((_, i) => selectedIndices.includes(i));
    if (toImport.length === 0) {
      showToast('Please select at least one contact to import', 'warning');
      return;
    }

    importContactsList(toImport);
    showToast(`Successfully imported ${toImport.length} contacts from ${provider === 'google' ? 'Google Contacts' : 'Apple iCloud'}!`, 'success');
    onClose();
  };

  // Handle local vCard or CSV upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      if (file.name.endsWith('.vcf') || file.name.endsWith('.vcard')) {
        importVCardRaw(text);
      } else if (file.name.endsWith('.csv')) {
        importCSVRaw(text);
      } else {
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) importContactsList(parsed);
          else if (parsed.contacts) importContactsList(parsed.contacts);
        } catch (err) {
          showToast('Unsupported contact file format', 'error');
        }
      }
      onClose();
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay-backdrop animate-fade-in" onClick={onClose}>
      <div className="social-import-dialog animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="social-import-header">
          <div className="social-header-brand">
            {provider === 'google' ? <GoogleIcon /> : <AppleIcon />}
            <div>
              <h3>{provider === 'google' ? 'Import from Google Contacts' : 'Import from Apple iCloud'}</h3>
              <p>
                Connected to: <strong>{currentUser?.email || (provider === 'google' ? 'Google Account' : 'Apple ID')}</strong>
              </p>
            </div>
          </div>
          <button className="social-modal-close" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        {/* Content Body */}
        <div className="social-import-body">
          {/* File Upload Option */}
          <div className="upload-quick-bar">
            <div className="upload-bar-text">
              <FiHardDrive className="bar-icon" />
              <span>Or import directly from exported file (.vcf / .csv):</span>
            </div>
            <label className="upload-file-pill-btn">
              <FiUpload />
              <span>Choose File</span>
              <input
                type="file"
                ref={fileInputRef}
                accept=".vcf,.vcard,.csv,.json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Search & Select All Controls */}
          <div className="import-controls-row">
            <div className="import-search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Filter contacts to import..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="select-all-btn"
              onClick={toggleSelectAll}
            >
              {selectedIndices.length === initialContacts.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Contact Preview List */}
          <div className="import-contacts-list">
            {filteredContacts.map((contact, index) => {
              const isSelected = selectedIndices.includes(index);
              return (
                <div
                  key={contact.email || index}
                  className={`import-contact-row ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleSelect(index)}
                >
                  <div className="import-checkbox">
                    {isSelected && <FiCheck />}
                  </div>

                  <div
                    className="import-contact-avatar"
                    style={{ background: contact.avatarBg }}
                  >
                    {contact.fullName.charAt(0).toUpperCase()}
                  </div>

                  <div className="import-contact-info">
                    <strong className="import-name">{contact.fullName}</strong>
                    <div className="import-meta-row">
                      <span><FiMail className="meta-mini-icon" /> {contact.email}</span>
                      <span><FiPhone className="meta-mini-icon" /> {contact.phone}</span>
                    </div>
                  </div>

                  <div className="import-tag-pill">
                    {contact.jobTitle || contact.company || contact.city}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="social-import-footer">
          <div className="selection-count-indicator">
            <FiCheckCircle className="text-emerald" />
            <span>{selectedIndices.length} contacts selected</span>
          </div>

          <div className="footer-btn-group">
            <button type="button" className="action-btn-pill btn-secondary-pill" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="action-btn-pill btn-primary-pill"
              onClick={handleImportSelected}
              disabled={selectedIndices.length === 0}
            >
              <FiUserPlus className="mr-1" />
              <span>Import {selectedIndices.length} to Vault</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
