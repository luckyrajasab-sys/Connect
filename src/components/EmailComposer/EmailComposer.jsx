import React, { useState, useEffect } from 'react';
import { useContacts } from '../../context/ContactContext';
import { FiX, FiSend, FiSave, FiMail, FiCheck, FiFileText } from 'react-icons/fi';
import './EmailComposer.css';

const TEMPLATES = [
  {
    name: 'Quick Hello',
    subject: 'Catching up / Quick hello',
    body: (name) => `Hi ${name.split(' ')[0]},\n\nHope you're having a great day! Just wanted to quickly connect and see how things are going with you.\n\nBest regards,\nSent from Vcontacts`
  },
  {
    name: 'Meeting Request',
    subject: 'Request for a brief meeting / discussion',
    body: (name) => `Dear ${name},\n\nI would love to schedule a brief call or meeting to discuss our upcoming plans. Please let me know your availability this week.\n\nLooking forward to hearing from you.\n\nBest regards,\nSent from Vcontacts`
  },
  {
    name: 'Follow-up',
    subject: 'Follow-up on our recent conversation',
    body: (name) => `Hi ${name.split(' ')[0]},\n\nFollowing up on our recent discussion. Let me know if you need any further information or updates from my side.\n\nWarm regards,\nSent from Vcontacts`
  }
];

export const EmailComposer = () => {
  const { activeEmailContact, setActiveEmailContact, showToast, logInteraction } = useContacts();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeEmailContact) {
      // Check for saved draft
      const draftKey = `vcontacts_draft_${activeEmailContact.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setSubject(parsed.subject || '');
          setMessage(parsed.message || '');
        } catch (e) {}
      } else {
        setSubject('');
        setMessage('');
      }
    }
  }, [activeEmailContact]);

  if (!activeEmailContact) return null;

  const handleApplyTemplate = (tmpl) => {
    setSubject(tmpl.subject);
    setMessage(tmpl.body(activeEmailContact.fullName || 'there'));
  };

  const handleSaveDraft = () => {
    const draftKey = `vcontacts_draft_${activeEmailContact.id}`;
    localStorage.setItem(draftKey, JSON.stringify({ subject, message, updatedAt: new Date().toISOString() }));
    showToast('Draft saved successfully', 'success');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!activeEmailContact.email) {
      showToast('Contact has no email address configured', 'warning');
      return;
    }

    const mailtoUrl = `mailto:${activeEmailContact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;

    logInteraction(activeEmailContact.id, 'email');
    showToast(`Opening default mail client for ${activeEmailContact.fullName}`, 'success');
    
    // Clear draft if any
    localStorage.removeItem(`vcontacts_draft_${activeEmailContact.id}`);
    setActiveEmailContact(null);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => setActiveEmailContact(null)}>
      <div className="modal-container email-composer-card animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="composer-header">
          <div className="composer-title-group">
            <div className="composer-icon-badge">
              <FiMail />
            </div>
            <div>
              <h3 className="composer-title">Compose Email</h3>
              <p className="composer-subtitle">Send message directly to contact</p>
            </div>
          </div>
          <button
            className="composer-close-btn"
            onClick={() => setActiveEmailContact(null)}
            aria-label="Close composer"
          >
            <FiX />
          </button>
        </div>

        {/* Template Quick Chips */}
        <div className="composer-templates-bar">
          <span className="templates-label"><FiFileText /> Templates:</span>
          <div className="template-chips">
            {TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                className="template-chip"
                onClick={() => handleApplyTemplate(tmpl)}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="composer-form">
          <div className="composer-field recipient-field">
            <label className="field-label">To:</label>
            <div className="recipient-tag">
              <span className="recipient-name">{activeEmailContact.fullName}</span>
              <span className="recipient-email">&lt;{activeEmailContact.email || 'No email'}&gt;</span>
            </div>
          </div>

          <div className="composer-field">
            <label className="field-label" htmlFor="email-subject">Subject:</label>
            <input
              id="email-subject"
              type="text"
              className="composer-input"
              placeholder="Enter subject line..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="composer-field message-field">
            <label className="field-label" htmlFor="email-body">Message:</label>
            <textarea
              id="email-body"
              className="composer-textarea"
              placeholder="Type your email message here..."
              rows={6}
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="composer-actions">
            <button
              type="button"
              className="composer-btn btn-draft"
              onClick={handleSaveDraft}
              title="Save draft for later"
            >
              <FiSave /> Save Draft
            </button>

            <div className="primary-actions-right">
              <button
                type="button"
                className="composer-btn btn-cancel"
                onClick={() => setActiveEmailContact(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="composer-btn btn-send"
                disabled={!activeEmailContact.email}
              >
                <FiSend /> Send Email
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
