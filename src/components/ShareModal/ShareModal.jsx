import React, { useState } from 'react';
import { useContacts } from '../../context/ContactContext';
import { generateVCardString } from '../../utils/vcard';
import { formatIndianPhone } from '../../utils/validation';
import { getInitials } from '../../utils/avatarHelper';
import {
  FiX,
  FiShare2,
  FiDownload,
  FiCopy,
  FiCheck,
  FiMaximize2,
  FiPhone,
  FiMail,
  FiMapPin
} from 'react-icons/fi';
import './ShareModal.css';

export const ShareModal = () => {
  const { activeShareContact, setActiveShareContact, setActiveQRContact, showToast } = useContacts();
  const [copiedText, setCopiedText] = useState(false);

  if (!activeShareContact) return null;

  const contactText = `Contact: ${activeShareContact.fullName}\nPhone: ${formatIndianPhone(activeShareContact.phone)}${activeShareContact.alternatePhone ? `\nAlt Phone: ${formatIndianPhone(activeShareContact.alternatePhone)}` : ''}${activeShareContact.email ? `\nEmail: ${activeShareContact.email}` : ''}${activeShareContact.company ? `\nCompany: ${activeShareContact.company}` : ''}${activeShareContact.city ? `\nLocation: ${activeShareContact.city}, ${activeShareContact.state || ''}` : ''}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(contactText);
    setCopiedText(true);
    showToast('Contact information copied to clipboard', 'success');
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleDownloadVCard = () => {
    const vcard = generateVCardString(activeShareContact);
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeShareContact.fullName.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${activeShareContact.fullName}.vcf`, 'success');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activeShareContact.fullName,
          text: contactText
        });
        showToast('Shared successfully', 'success');
      } catch (err) {}
    } else {
      handleCopyText();
    }
  };

  const handleOpenQR = () => {
    const contact = activeShareContact;
    setActiveShareContact(null);
    setActiveQRContact(contact);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => setActiveShareContact(null)}>
      <div className="modal-container share-modal-card animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal-header">
          <div className="share-title-group">
            <div className="share-icon-badge">
              <FiShare2 />
            </div>
            <div>
              <h3 className="share-title">Share Contact</h3>
              <p className="share-subtitle">Distribute contact card across devices</p>
            </div>
          </div>
          <button
            className="share-close-btn"
            onClick={() => setActiveShareContact(null)}
            aria-label="Close share modal"
          >
            <FiX />
          </button>
        </div>

        {/* Contact Mini Dossier */}
        <div className="share-contact-dossier">
          <div
            className="share-avatar"
            style={{ background: activeShareContact.avatarBg || 'linear-gradient(135deg, #FF7722, #EA580C)' }}
          >
            <span>{getInitials(activeShareContact.fullName)}</span>
          </div>
          <div className="share-dossier-info">
            <h4 className="share-contact-name">{activeShareContact.fullName}</h4>
            <span className="share-phone"><FiPhone /> {formatIndianPhone(activeShareContact.phone)}</span>
            {activeShareContact.email && (
              <span className="share-email"><FiMail /> {activeShareContact.email}</span>
            )}
            {activeShareContact.city && (
              <span className="share-city"><FiMapPin /> {activeShareContact.city}, {activeShareContact.state}</span>
            )}
          </div>
        </div>

        {/* Share Options Grid */}
        <div className="share-options-grid">
          <button className="share-option-tile" onClick={handleOpenQR}>
            <div className="tile-icon-wrap bg-orange-glow">
              <FiMaximize2 />
            </div>
            <span className="tile-title">vCard QR Code</span>
            <span className="tile-desc">Generate stylish scannable QR code</span>
          </button>

          <button className="share-option-tile" onClick={handleDownloadVCard}>
            <div className="tile-icon-wrap bg-cyan-glow">
              <FiDownload />
            </div>
            <span className="tile-title">Download vCard (.vcf)</span>
            <span className="tile-desc">Compatible with Apple, Android & Outlook</span>
          </button>

          <button className="share-option-tile" onClick={handleCopyText}>
            <div className="tile-icon-wrap bg-purple-glow">
              {copiedText ? <FiCheck /> : <FiCopy />}
            </div>
            <span className="tile-title">{copiedText ? 'Copied to Clipboard!' : 'Copy Information'}</span>
            <span className="tile-desc">Text summary with phone & email</span>
          </button>

          <button className="share-option-tile primary-tile" onClick={handleNativeShare}>
            <div className="tile-icon-wrap bg-emerald-glow">
              <FiShare2 />
            </div>
            <span className="tile-title">Quick Share / AirDrop</span>
            <span className="tile-desc">Open system share sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
