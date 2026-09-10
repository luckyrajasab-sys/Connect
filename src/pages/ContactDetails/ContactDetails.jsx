import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { getInitials } from '../../utils/avatarHelper';
import { formatIndianPhone, cleanPhoneDigits } from '../../utils/validation';
import { getCategoryTheme } from '../../data/categories';
import { calculateCompleteness } from '../../utils/completeness';
import { generateVCardString } from '../../utils/vcard';
import { CompletenessBar } from '../../components/CompletenessBar/CompletenessBar';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import {
  FiArrowLeft,
  FiPhone,
  FiMessageSquare,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiCopy,
  FiShare2,
  FiExternalLink,
  FiDownload,
  FiSearch,
  FiBriefcase,
  FiGlobe,
  FiTag,
  FiMaximize2,
  FiAlertTriangle,
  FiCheck
} from 'react-icons/fi';
import './ContactDetails.css';

export const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    contacts,
    toggleFavorite,
    deleteContact,
    showToast,
    setActiveEmailContact,
    setActiveQRContact,
    setActiveShareContact
  } = useContacts();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const contact = contacts.find(c => c.id === id);

  if (!contact) {
    return (
      <div className="details-not-found-container">
        <div className="not-found-card">
          <div className="not-found-icon-wrap">
            <FiSearch />
          </div>
          <h2>Contact Not Found</h2>
          <p>This contact might have been deleted or the link is invalid.</p>
          <button className="back-to-contacts-btn" onClick={() => navigate('/contacts')}>
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const displayName = contact.fullName || contact.name || 'Unnamed Contact';
  const categoryTheme = getCategoryTheme(contact.group || contact.category);
  const rawPhone = contact.phone || '';
  const cleanDigits = (contact.phone || '').replace(/\D/g, '');
  const hasPlus = (contact.phone || '').startsWith('+');
  const intlPhone = hasPlus ? cleanDigits : (cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits);
  const formattedPhone = contact.phone || '';
  const formattedAltPhone = contact.alternatePhone || null;

  const handleCopyNumber = (num, label = 'Phone number') => {
    if (!num) return;
    navigator.clipboard.writeText(num);
    showToast(`Copied ${label} to clipboard`, 'success');
  };

  const handleCall = () => {
    window.location.href = `tel:+${intlPhone}`;
  };

  const handleSMS = () => {
    window.location.href = `sms:+${intlPhone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${intlPhone}`, '_blank');
  };

  const handleExportVCF = () => {
    const vcard = generateVCardString(contact);
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${displayName.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${displayName}.vcf`, 'success');
  };

  const locationQuery = [contact.address, contact.city, contact.state, contact.pincode, contact.country || 'India'].filter(Boolean).join(', ');
  const googleMapsEmbedUrl = contact.city || contact.address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : null;
  const googleMapsDirectionsUrl = contact.city || contact.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`
    : null;

  return (
    <div className="contact-details-container animate-fade-in">
      {/* Top Navbar */}
      <div className="details-header-nav">
        <button className="details-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <FiArrowLeft />
        </button>
        <div className="header-nav-actions">
          <button
            className={`details-nav-icon-btn ${contact.isFavorite ? 'starred' : ''}`}
            onClick={() => toggleFavorite(contact.id)}
            title={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label="Toggle favorite"
          >
            <FiStar />
          </button>
          <button
            className="details-nav-icon-btn"
            onClick={() => setActiveQRContact(contact)}
            title="Generate QR Code"
            aria-label="QR Code"
          >
            <FiMaximize2 />
          </button>
          <button
            className="details-nav-icon-btn"
            onClick={() => setActiveShareContact(contact)}
            title="Share Contact"
            aria-label="Share Contact"
          >
            <FiShare2 />
          </button>
          <button
            className="details-nav-icon-btn edit-btn"
            onClick={() => navigate(`/edit/${contact.id}`)}
            title="Edit Contact"
            aria-label="Edit Contact"
          >
            <FiEdit2 />
          </button>
          <button
            className="details-nav-icon-btn delete-btn"
            onClick={() => setShowDeleteModal(true)}
            title="Delete Contact"
            aria-label="Delete Contact"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Hero Profile Dossier Card */}
      <div className="details-hero-card" style={{ '--hero-accent': categoryTheme.color }}>
        <div
          className="details-large-avatar"
          style={{ background: contact.avatarBg || categoryTheme.gradient }}
        >
          {contact.avatarUrl ? (
            <img src={contact.avatarUrl} alt={displayName} className="details-avatar-img" />
          ) : (
            <span>{getInitials(displayName)}</span>
          )}
          {contact.isEmergency && <span className="hero-emergency-badge"><FiAlertTriangle /></span>}
        </div>

        <h1 className="details-full-name">{displayName}</h1>
        {(contact.jobTitle || contact.company) && (
          <p className="details-work-sub">
            <FiBriefcase className="inline-icon" />
            {[contact.jobTitle, contact.company].filter(Boolean).join(' at ')}
          </p>
        )}
        <p className="details-phone-display font-numeric">{formattedPhone}</p>

        <div className="details-badges-row">
          <span className="details-group-badge" style={{ color: categoryTheme.color, borderColor: categoryTheme.color }}>
            {categoryTheme.name}
          </span>
          {contact.importance === 'vip' && (
            <span className="details-vip-badge">VIP Priority</span>
          )}
          {contact.isEmergency && (
            <span className="details-emergency-badge">
              <FiAlertTriangle /> Emergency ({contact.emergencyRelation || 'Contact'})
            </span>
          )}
          {contact.state && (
            <span className="details-state-badge">{contact.state}</span>
          )}
          {contact.isFavorite && (
            <span className="details-star-badge">
              <FiStar className="badge-star-icon" /> Starred
            </span>
          )}
        </div>

        {/* Primary Action Buttons Grid */}
        <div className="details-action-buttons-grid">
          <button className="d-btn call-d-btn" onClick={handleCall}>
            <FiPhone />
            <span>Call</span>
          </button>
          <button className="d-btn wa-d-btn" onClick={handleWhatsApp}>
            <FiMessageSquare />
            <span>WhatsApp</span>
          </button>
          <button className="d-btn sms-d-btn" onClick={handleSMS}>
            <FiMessageSquare />
            <span>SMS</span>
          </button>
          {contact.email ? (
            <button className="d-btn email-d-btn" onClick={() => setActiveEmailContact(contact)}>
              <FiMail />
              <span>Email</span>
            </button>
          ) : (
            <button className="d-btn copy-d-btn" onClick={() => handleCopyNumber(rawPhone, 'Phone number')}>
              <FiCopy />
              <span>Copy</span>
            </button>
          )}
          <button className="d-btn qr-d-btn" onClick={() => setActiveQRContact(contact)}>
            <FiMaximize2 />
            <span>QR</span>
          </button>
          <button className="d-btn share-d-btn" onClick={() => setActiveShareContact(contact)}>
            <FiShare2 />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Profile Completeness Breakdown */}
      <CompletenessBar contact={contact} showDetails={true} showEditButton={true} />

      {/* Information Cards Sections */}
      <div className="details-info-sections">
        {/* Phone Info */}
        <div className="info-card">
          <div className="info-card-icon bg-blue">
            <FiPhone />
          </div>
          <div className="info-card-content">
            <span className="info-card-label">Primary Mobile Number</span>
            <span className="info-card-val font-numeric">{formattedPhone}</span>
            <span className="info-card-hint">{contact.country ? `Country: ${contact.country}` : 'Global Mobile'}</span>
          </div>
          <button className="info-action-btn" onClick={() => handleCopyNumber(rawPhone, 'Primary phone')} title="Copy phone">
            <FiCopy />
          </button>
        </div>

        {/* Alternate Phone */}
        {formattedAltPhone && (
          <div className="info-card">
            <div className="info-card-icon bg-cyan">
              <FiPhone />
            </div>
            <div className="info-card-content">
              <span className="info-card-label">Alternate Phone</span>
              <span className="info-card-val font-numeric">{formattedAltPhone}</span>
            </div>
            <button className="info-action-btn" onClick={() => handleCopyNumber(cleanPhoneDigits(contact.alternatePhone), 'Alternate phone')} title="Copy alternate phone">
              <FiCopy />
            </button>
          </div>
        )}

        {/* Email Info */}
        {contact.email && (
          <div className="info-card">
            <div className="info-card-icon bg-purple">
              <FiMail />
            </div>
            <div className="info-card-content">
              <span className="info-card-label">Email Address</span>
              <span className="info-card-val link-val" onClick={() => setActiveEmailContact(contact)}>
                {contact.email}
              </span>
            </div>
            <button className="info-action-btn" onClick={() => setActiveEmailContact(contact)} title="Compose Email">
              <FiMail />
            </button>
          </div>
        )}

        {/* Work Info */}
        {(contact.company || contact.jobTitle) && (
          <div className="info-card">
            <div className="info-card-icon bg-saffron">
              <FiBriefcase />
            </div>
            <div className="info-card-content">
              <span className="info-card-label">Company & Job Title</span>
              <span className="info-card-val">{[contact.jobTitle, contact.company].filter(Boolean).join(' at ')}</span>
            </div>
          </div>
        )}

        {/* Website */}
        {contact.website && (
          <div className="info-card">
            <div className="info-card-icon bg-emerald">
              <FiGlobe />
            </div>
            <div className="info-card-content">
              <span className="info-card-label">Website / Portfolio</span>
              <a href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="info-card-val link-val">
                {contact.website}
              </a>
            </div>
            <a href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="info-action-btn">
              <FiExternalLink />
            </a>
          </div>
        )}

        {/* Location & Embedded Interactive Map */}
        {(contact.address || contact.city || contact.state || contact.pincode) && (
          <div className="location-container-card">
            <div className="info-card address-card-top">
              <div className="info-card-icon bg-green">
                <FiMapPin />
              </div>
              <div className="info-card-content">
                <span className="info-card-label">Location & Address</span>
                <span className="info-card-val">
                  {[contact.address, contact.city, contact.state].filter(Boolean).join(', ')}
                  {contact.pincode ? ` - ${contact.pincode}` : ''}
                </span>
                <span className="info-card-hint">{contact.country || 'India'}</span>
              </div>
              {googleMapsDirectionsUrl && (
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-action-btn"
                  title="Open in Google Maps"
                >
                  <FiExternalLink />
                </a>
              )}
            </div>

            {/* Embedded Live Map View */}
            {googleMapsEmbedUrl && (
              <div className="interactive-map-frame-wrapper">
                <iframe
                  title={`Map for ${displayName}`}
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="240"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="map-footer-overlay">
                  <span className="map-place-tag">
                    <FiMapPin className="map-pin-svg" />
                    {[contact.city, contact.state].filter(Boolean).join(', ') || 'India'}
                  </span>
                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-nav-btn"
                  >
                    <span>Get Directions</span>
                    <FiExternalLink />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Date of Birth */}
        {contact.birthday && (
          <div className="info-card">
            <div className="info-card-icon bg-amber">
              <FiCalendar />
            </div>
            <div className="info-card-content">
              <span className="info-card-label">Birthday</span>
              <span className="info-card-val">{new Date(contact.birthday).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        )}

        {/* Tags */}
        {contact.tags?.length > 0 && (
          <div className="info-card tags-info-card">
            <div className="info-card-icon bg-cyan">
              <FiTag />
            </div>
            <div className="info-card-content">
              <span className="info-card-label">Tags & Keywords</span>
              <div className="details-tags-cloud">
                {contact.tags.map((tag, idx) => (
                  <span key={idx} className="details-tag-chip">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {contact.notes && (
          <div className="info-card notes-card">
            <span className="info-card-label">Notes & Dossier Summary</span>
            <p className="notes-text">{contact.notes}</p>
          </div>
        )}

        {/* vCard Download Box */}
        <div className="vcard-export-box">
          <button className="vcard-export-btn" onClick={handleExportVCF}>
            <FiDownload />
            <span>Download vCard Contact File (.vcf)</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        type="danger"
        title="Delete Contact?"
        message={`Are you sure you want to delete ${displayName}? All associated data and notes will be permanently removed.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={() => {
          deleteContact(contact.id);
          setShowDeleteModal(false);
          navigate('/contacts');
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
