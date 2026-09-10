import React, { useState, useEffect } from 'react';
import { useContacts } from '../../context/ContactContext';
import { generateVCardString } from '../../utils/vcard';
import { generateQRCodeDataURL } from '../../utils/qrHelper';
import { getInitials } from '../../utils/avatarHelper';
import { formatIndianPhone } from '../../utils/validation';
import {
  FiX,
  FiDownload,
  FiShare2,
  FiCopy,
  FiCheck,
  FiSliders,
  FiMail,
  FiBriefcase,
  FiPhone
} from 'react-icons/fi';
import './QRModal.css';

const QR_STYLES = [
  { id: 'standard', name: 'Classic B&W (Default)' },
  { id: 'gradient', name: 'Cyber Glow' },
  { id: 'rounded', name: 'Neon Orange' },
  { id: 'minimal', name: 'Cyan Minimal' }
];

export const QRModal = () => {
  const { activeQRContact, setActiveQRContact, showToast } = useContacts();
  const [qrStyle, setQrStyle] = useState('standard');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!activeQRContact) {
      setQrDataUrl('');
      return;
    }

    const vcardStr = generateVCardString(activeQRContact);
    generateQRCodeDataURL(vcardStr, qrStyle).then(dataUrl => {
      setQrDataUrl(dataUrl);
    });
  }, [activeQRContact, qrStyle]);

  if (!activeQRContact) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${activeQRContact.fullName.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded QR Code image`, 'success');
  };

  const handleCopyVCard = () => {
    const vcardStr = generateVCardString(activeQRContact);
    navigator.clipboard.writeText(vcardStr);
    setIsCopied(true);
    showToast(`vCard data copied to clipboard`, 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${activeQRContact.fullName} - Contact Card`,
          text: `Contact: ${activeQRContact.fullName}\nPhone: ${formatIndianPhone(activeQRContact.phone)}\nEmail: ${activeQRContact.email || 'N/A'}`
        });
      } catch (err) {}
    } else {
      handleCopyVCard();
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => setActiveQRContact(null)}>
      <div className="modal-container qr-modal-card animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="qr-modal-header">
          <div className="qr-title-box">
            <span className="qr-badge">vCard QR</span>
            <h3 className="qr-modal-title">Contact QR Code</h3>
          </div>
          <button
            className="qr-close-btn"
            onClick={() => setActiveQRContact(null)}
            aria-label="Close QR Modal"
          >
            <FiX />
          </button>
        </div>

        {/* Contact Info Header */}
        <div className="qr-contact-preview">
          <div
            className="qr-avatar"
            style={{ background: activeQRContact.avatarBg || 'linear-gradient(135deg, #FF7722, #EA580C)' }}
          >
            <span>{getInitials(activeQRContact.fullName)}</span>
          </div>
          <div className="qr-meta">
            <h4 className="qr-contact-name">{activeQRContact.fullName}</h4>
            {activeQRContact.jobTitle || activeQRContact.company ? (
              <p className="qr-contact-work">
                <FiBriefcase className="inline-icon" />
                {[activeQRContact.jobTitle, activeQRContact.company].filter(Boolean).join(' at ')}
              </p>
            ) : null}
            <p className="qr-contact-phone">
              <FiPhone className="inline-icon" /> {formatIndianPhone(activeQRContact.phone)}
            </p>
            {activeQRContact.email && (
              <p className="qr-contact-email">
                <FiMail className="inline-icon" /> {activeQRContact.email}
              </p>
            )}
          </div>
        </div>

        {/* QR Style Selector */}
        <div className="qr-styles-bar">
          <span className="style-label"><FiSliders /> Style:</span>
          <div className="style-pills">
            {QR_STYLES.map(st => (
              <button
                key={st.id}
                className={`style-pill ${qrStyle === st.id ? 'active' : ''}`}
                onClick={() => setQrStyle(st.id)}
              >
                {st.name}
              </button>
            ))}
          </div>
        </div>

        {/* QR Code Canvas Frame */}
        <div className={`qr-display-frame qr-style-${qrStyle}`}>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for ${activeQRContact.fullName}`}
              className="qr-image"
            />
          ) : (
            <div className="qr-loading-spinner">Generating QR...</div>
          )}
          <p className="qr-scan-hint">Scan with any phone camera or Vcontacts Scanner to import</p>
        </div>

        {/* Actions Footer */}
        <div className="qr-modal-actions">
          <button className="qr-action-btn btn-download" onClick={handleDownload}>
            <FiDownload /> Download PNG
          </button>

          <button className="qr-action-btn btn-share" onClick={handleShareQR}>
            <FiShare2 /> Share
          </button>

          <button className="qr-action-btn btn-copy" onClick={handleCopyVCard}>
            {isCopied ? <FiCheck className="text-emerald" /> : <FiCopy />}
            <span>{isCopied ? 'Copied' : 'Copy vCard'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
