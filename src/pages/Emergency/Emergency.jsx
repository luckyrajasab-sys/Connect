import React, { useState } from 'react';
import { useContacts } from '../../context/ContactContext';
import { emergencyContacts } from '../../data/emergencyContacts';
import { EmergencyCard } from '../../components/EmergencyCard/EmergencyCard';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { formatIndianPhone, cleanPhoneDigits, validateIndianPhone } from '../../utils/validation';
import {
  FiAlertTriangle,
  FiPhoneCall,
  FiPlus,
  FiUser,
  FiTrash2,
  FiInfo,
  FiShield,
  FiHeart
} from 'react-icons/fi';
import './Emergency.css';

export const Emergency = () => {
  const {
    personalEmergency,
    addPersonalEmergency,
    removePersonalEmergency
  } = useContacts();

  // Personal Emergency Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    name: '',
    relation: 'Family',
    phone: '',
    address: '',
    notes: ''
  });
  const [phoneError, setPhoneError] = useState(null);

  // Call Confirmation for Personal Contact
  const [callPersonalTarget, setCallPersonalTarget] = useState(null);

  // Delete Confirmation for Personal Contact
  const [deletePersonalTarget, setDeletePersonalTarget] = useState(null);

  const handleSavePersonal = (e) => {
    e.preventDefault();
    if (!personalForm.name.trim()) return;

    const error = validateIndianPhone(personalForm.phone);
    if (error) {
      setPhoneError(error);
      return;
    }

    addPersonalEmergency({
      ...personalForm,
      phone: cleanPhoneDigits(personalForm.phone)
    });

    setPersonalForm({
      name: '',
      relation: 'Family',
      phone: '',
      address: '',
      notes: ''
    });
    setPhoneError(null);
    setShowAddModal(false);
  };

  const handlePersonalCall = (entry) => {
    setCallPersonalTarget(entry);
  };

  return (
    <div className="emergency-page-container animate-fade-in">
      {/* Page Header */}
      <div className="emergency-hero-header">
        <div className="emergency-header-content">
          <div className="sos-top-pill">
            <span className="live-dot"></span>
            <span>National Helplines & Emergency ERSS</span>
          </div>
          <h1 className="emergency-main-title">
            Indian Emergency Directory
          </h1>
          <p className="emergency-sub-title">
            Immediate 24x7 crisis lines, police control rooms, medical assistance, and personal SOS contacts.
          </p>
        </div>

        {/* Universal 112 SOS Banner Card */}
        <div className="emergency-112-highlight">
          <div className="badge-112">112</div>
          <div className="info-112">
            <span className="title-112">Emergency Response Support System (ERSS)</span>
            <span className="desc-112">Universal helpline functional across all Indian States & UTs</span>
          </div>
          <button
            className="call-112-btn"
            onClick={() => setCallPersonalTarget({ name: 'National Emergency ERSS', phone: '112', number: '112' })}
          >
            <FiPhoneCall /> Quick 112
          </button>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="emergency-disclaimer-box">
        <FiInfo className="disclaimer-lead-icon" />
        <p className="disclaimer-text">
          <strong>Official Indian Safety Advisory:</strong> Emergency service availability may vary by location. Please verify local emergency services when necessary. In case of immediate life hazard, dial <strong>112</strong> or <strong>100</strong> immediately.
        </p>
      </div>

      {/* SECTION 1: Personal Emergency Contacts */}
      <section className="emergency-section">
        <div className="section-title-action-row">
          <div className="section-title-group">
            <h2 className="emergency-section-heading">
              <FiHeart className="heading-icon text-red" /> My Emergency Contacts
            </h2>
            <p className="section-explainer">
              Family members, doctors, and guardians notified in critical situations
            </p>
          </div>
          <button
            className="add-personal-sos-btn"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus /> Add Contact
          </button>
        </div>

        {personalEmergency.length > 0 ? (
          <div className="personal-sos-grid">
            {personalEmergency.map(item => (
              <div key={item.id} className="personal-sos-card animate-fade-in">
                <div className="personal-sos-top">
                  <div className="personal-avatar-icon">
                    <FiUser />
                  </div>
                  <div className="personal-sos-info">
                    <div className="personal-name-row">
                      <h3 className="personal-name">{item.name}</h3>
                      <span className="relation-tag">{item.relation}</span>
                    </div>
                    <span className="personal-phone">{formatIndianPhone(item.phone)}</span>
                    {item.notes && <p className="personal-notes">"{item.notes}"</p>}
                  </div>
                </div>

                <div className="personal-sos-footer">
                  <button
                    className="personal-call-btn"
                    onClick={() => handlePersonalCall(item)}
                  >
                    <FiPhoneCall /> Call {item.name.split(' ')[0]}
                  </button>
                  <button
                    className="personal-remove-btn"
                    onClick={() => setDeletePersonalTarget(item)}
                    title="Remove from Emergency"
                    aria-label="Remove contact"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="personal-empty-box">
            <p>No personal emergency contacts added yet.</p>
            <button className="add-personal-link" onClick={() => setShowAddModal(true)}>
              + Add Father, Mother, Doctor or Guardian
            </button>
          </div>
        )}
      </section>

      {/* SECTION 2: National Helplines Directory */}
      <section className="emergency-section">
        <div className="section-title-group">
          <h2 className="emergency-section-heading">
            <FiShield className="heading-icon text-saffron" /> National & State Helplines
          </h2>
          <p className="section-explainer">
            Pre-configured official government helpline numbers
          </p>
        </div>

        <div className="national-helpline-grid">
          {emergencyContacts.map(contact => (
            <EmergencyCard key={contact.id} contact={contact} />
          ))}
        </div>
      </section>

      {/* Add Personal Emergency Contact Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-container personal-add-modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Add Personal Emergency Contact</h3>
            <p className="modal-message">Add a trusted contact to reach out to in emergencies.</p>

            <form onSubmit={handleSavePersonal} className="personal-add-form">
              <div className="form-field">
                <label className="input-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Papa / Dr. Rajesh Sharma"
                  value={personalForm.name}
                  onChange={e => setPersonalForm({ ...personalForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label className="input-label">Relationship / Role</label>
                <select
                  className="form-input form-select"
                  value={personalForm.relation}
                  onChange={e => setPersonalForm({ ...personalForm, relation: e.target.value })}
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Family Doctor">Family Doctor</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Neighbor">Neighbor</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label className="input-label">Indian Mobile Number *</label>
                <div className="input-with-icon phone-input-group">
                  <div className="india-code-badge">
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    className="form-input phone-field"
                    placeholder="98765 43210 (10 digits)"
                    value={personalForm.phone}
                    onChange={e => {
                      setPersonalForm({ ...personalForm, phone: cleanPhoneDigits(e.target.value) });
                      setPhoneError(null);
                    }}
                    maxLength={10}
                    required
                  />
                </div>
                {phoneError && <span className="field-error-msg">{phoneError}</span>}
              </div>

              <div className="form-field">
                <label className="input-label">Notes / Blood Group / Medical info</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Has spare keys, Blood group B+ve"
                  value={personalForm.notes}
                  onChange={e => setPersonalForm({ ...personalForm, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn btn-primary btn-emergency"
                >
                  Save Emergency Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Call Confirmation Modal */}
      {callPersonalTarget && (
        <ConfirmationModal
          isOpen={Boolean(callPersonalTarget)}
          type="emergency"
          title={`Call ${callPersonalTarget.name}?`}
          message={`Are you sure you want to call ${callPersonalTarget.name} (${callPersonalTarget.number || callPersonalTarget.phone})?`}
          disclaimer="Emergency service availability may vary by location. Please verify local emergency services when necessary."
          confirmText="Call Now"
          cancelText="Cancel"
          onConfirm={() => {
            const num = callPersonalTarget.number || callPersonalTarget.phone;
            setCallPersonalTarget(null);
            window.location.href = `tel:${num}`;
          }}
          onCancel={() => setCallPersonalTarget(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletePersonalTarget && (
        <ConfirmationModal
          isOpen={Boolean(deletePersonalTarget)}
          type="danger"
          title="Remove Emergency Contact?"
          message={`Are you sure you want to remove "${deletePersonalTarget.name}" from your personal emergency contacts?`}
          confirmText="Remove"
          cancelText="Keep"
          onConfirm={() => {
            removePersonalEmergency(deletePersonalTarget.id);
            setDeletePersonalTarget(null);
          }}
          onCancel={() => setDeletePersonalTarget(null)}
        />
      )}
    </div>
  );
};
