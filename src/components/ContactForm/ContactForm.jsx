import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { INDIAN_STATES } from '../../data/indianStates';
import { CATEGORIES } from '../../data/categories';
import { validateContactForm, cleanPhoneDigits } from '../../utils/validation';
import { getInitials, getAvatarGradient } from '../../utils/avatarHelper';
import { calculateCompleteness } from '../../utils/completeness';
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiTag,
  FiBriefcase,
  FiGlobe,
  FiCheck,
  FiArrowLeft,
  FiStar,
  FiAlertTriangle,
  FiPhone,
  FiLayers,
  FiEdit3,
  FiImage
} from 'react-icons/fi';
import './ContactForm.css';

const AVATAR_PALETTES = [
  "linear-gradient(135deg, #FF7722, #EA580C)",
  "linear-gradient(135deg, #00E5FF, #0284C7)",
  "linear-gradient(135deg, #3B82F6, #1D4ED8)",
  "linear-gradient(135deg, #10B981, #047857)",
  "linear-gradient(135deg, #A855F7, #7E22CE)",
  "linear-gradient(135deg, #EF4444, #B91C1C)",
  "linear-gradient(135deg, #F59E0B, #B45309)",
  "linear-gradient(135deg, #EC4899, #BE185D)"
];

const CARD_STYLES = [
  { id: 'standard', label: 'Standard' },
  { id: 'compact', label: 'Compact' },
  { id: 'large', label: 'Large' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'glass', label: 'Glass' },
  { id: 'gradient', label: 'Gradient' }
];

export const ContactForm = ({ initialData, isEditMode = false }) => {
  const { addContact, updateContact, groups, defaultCardStyle } = useContacts();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    avatarUrl: initialData?.avatarUrl || '',
    avatarBg: initialData?.avatarBg || AVATAR_PALETTES[0],
    cardStyle: initialData?.cardStyle || defaultCardStyle || 'standard',
    cardColor: initialData?.cardColor || '#FF7722',
    phone: initialData?.phone
      ? cleanPhoneDigits(initialData.phone)
      : location.state?.initialPhone
      ? cleanPhoneDigits(location.state.initialPhone)
      : '',
    alternatePhone: initialData?.alternatePhone ? cleanPhoneDigits(initialData.alternatePhone) : '',
    email: initialData?.email || '',
    company: initialData?.company || '',
    jobTitle: initialData?.jobTitle || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || 'Maharashtra',
    country: initialData?.country || 'India',
    pincode: initialData?.pincode || '',
    birthday: initialData?.birthday || initialData?.dob || '',
    website: initialData?.website || '',
    notes: initialData?.notes || '',
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
    group: initialData?.group || 'friends',
    importance: initialData?.importance || 'normal',
    isFavorite: initialData?.isFavorite || false,
    isEmergency: initialData?.isEmergency || false,
    emergencyRelation: initialData?.emergencyRelation || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Real-time completeness calculation
  const completeness = calculateCompleteness({
    ...formData,
    tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
  });

  const handleChange = (field, value) => {
    let processed = value;
    if (field === 'phone' || field === 'alternatePhone') {
      processed = cleanPhoneDigits(value);
    }
    if (field === 'pincode') {
      processed = value.replace(/\D/g, '').slice(0, 6);
    }

    const updated = { ...formData, [field]: processed };
    setFormData(updated);

    if (field === 'fullName' && !isEditMode && !formData.avatarBg) {
      updated.avatarBg = getAvatarGradient(processed);
    }

    if (touched[field]) {
      const { errors: currentErrors } = validateContactForm(updated);
      setErrors(prev => ({ ...prev, [field]: currentErrors[field] || null }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const { errors: currentErrors } = validateContactForm(formData);
    setErrors(prev => ({ ...prev, [field]: currentErrors[field] || null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateContactForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
      setTouched(allTouched);
      setActiveTab('basic');
      return;
    }

    const formattedPayload = {
      ...formData,
      tags: formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []
    };

    if (isEditMode) {
      updateContact(initialData.id, formattedPayload);
      navigate(`/contacts/${initialData.id}`);
    } else {
      const created = addContact(formattedPayload);
      navigate(`/contacts/${created.id}`);
    }
  };

  return (
    <div className="contact-form-layout">
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        {/* Header Bar */}
        <div className="form-header-bar">
          <button
            type="button"
            className="form-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FiArrowLeft />
          </button>
          <div className="form-header-title-box">
            <h2 className="form-page-title">
              {isEditMode ? 'Edit Contact Profile' : 'Create Smart Contact'}
            </h2>
            <p className="form-page-subtitle">
              Configure profile attributes, work info, QR vCard, and emergency flags
            </p>
          </div>

          {/* Completeness Score Badge */}
          <div className="form-completeness-gauge">
            <span className="gauge-score">{completeness.score}%</span>
            <span className="gauge-label">Profile Strength</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="form-tab-nav">
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            <FiUser /> Primary Details
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'work' ? 'active' : ''}`}
            onClick={() => setActiveTab('work')}
          >
            <FiBriefcase /> Work & Social
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'location' ? 'active' : ''}`}
            onClick={() => setActiveTab('location')}
          >
            <FiMapPin /> Location
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <FiLayers /> Style & Category
          </button>
        </div>

        {/* TAB 1: Basic Info */}
        {activeTab === 'basic' && (
          <div className="form-tab-content animate-fade-in">
            {/* Full Name */}
            <div className="form-field">
              <label className="input-label" htmlFor="fullName">
                Full Name <span className="req-star">*</span>
              </label>
              <div className="input-with-icon">
                <FiUser className="input-lead-icon" />
                <input
                  id="fullName"
                  type="text"
                  className={`form-input ${errors.fullName ? 'has-error' : ''}`}
                  placeholder="e.g. Aarav Sharma / Dr. Priya Patel"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  required
                />
              </div>
              {errors.fullName && <span className="field-error-msg">{errors.fullName}</span>}
            </div>

            {/* Primary Phone */}
            <div className="form-grid-2">
              <div className="form-field">
                <label className="input-label" htmlFor="phone">
                  Primary Mobile Number <span className="req-star">*</span>
                </label>
                <div className="input-with-icon phone-input-group">
                  <div className="india-code-badge">+91</div>
                  <input
                    id="phone"
                    type="tel"
                    className={`form-input phone-field ${errors.phone ? 'has-error' : ''}`}
                    placeholder="98765 43210 (10 digits)"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    maxLength={10}
                    required
                  />
                </div>
                {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
              </div>

              {/* Alternate Phone */}
              <div className="form-field">
                <label className="input-label" htmlFor="alternatePhone">
                  Alternate Phone (Optional)
                </label>
                <div className="input-with-icon phone-input-group">
                  <div className="india-code-badge">+91</div>
                  <input
                    id="alternatePhone"
                    type="tel"
                    className="form-input phone-field"
                    placeholder="Secondary number"
                    value={formData.alternatePhone}
                    onChange={(e) => handleChange('alternatePhone', e.target.value)}
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            {/* Email & Birthday */}
            <div className="form-grid-2">
              <div className="form-field">
                <label className="input-label" htmlFor="email">
                  Email Address
                </label>
                <div className="input-with-icon">
                  <FiMail className="input-lead-icon" />
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                    placeholder="e.g. name@domain.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                  />
                </div>
                {errors.email && <span className="field-error-msg">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label className="input-label" htmlFor="birthday">
                  Birthday / Date of Birth
                </label>
                <div className="input-with-icon">
                  <FiCalendar className="input-lead-icon" />
                  <input
                    id="birthday"
                    type="date"
                    className="form-input"
                    value={formData.birthday}
                    onChange={(e) => handleChange('birthday', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Emergency & Favorites Toggles */}
            <div className="form-toggles-row">
              <label className="checkbox-toggle-card">
                <input
                  type="checkbox"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                />
                <div className="toggle-visual">
                  <FiStar className="toggle-icon text-amber" />
                  <div>
                    <span className="toggle-title">Add to Favorites</span>
                    <span className="toggle-desc">Show on Home quick dial carousel</span>
                  </div>
                </div>
              </label>

              <label className="checkbox-toggle-card">
                <input
                  type="checkbox"
                  checked={formData.isEmergency}
                  onChange={(e) => setFormData(prev => ({ ...prev, isEmergency: e.target.checked }))}
                />
                <div className="toggle-visual">
                  <FiAlertTriangle className="toggle-icon text-red" />
                  <div>
                    <span className="toggle-title">Emergency Contact</span>
                    <span className="toggle-desc">Highlight in SOS crisis section</span>
                  </div>
                </div>
              </label>
            </div>

            {formData.isEmergency && (
              <div className="form-field animate-fade-in">
                <label className="input-label">Emergency Relationship / Role</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Father, Mother, Spouse, Family Physician"
                  value={formData.emergencyRelation}
                  onChange={(e) => handleChange('emergencyRelation', e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Work & Social */}
        {activeTab === 'work' && (
          <div className="form-tab-content animate-fade-in">
            <div className="form-grid-2">
              <div className="form-field">
                <label className="input-label" htmlFor="company">Company / Organization</label>
                <div className="input-with-icon">
                  <FiBriefcase className="input-lead-icon" />
                  <input
                    id="company"
                    type="text"
                    className="form-input"
                    placeholder="e.g. TechCorp India / Apollo"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="input-label" htmlFor="jobTitle">Job Title / Role</label>
                <input
                  id="jobTitle"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Architect / Director"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="input-label" htmlFor="website">Website / Portfolio / LinkedIn</label>
              <div className="input-with-icon">
                <FiGlobe className="input-lead-icon" />
                <input
                  id="website"
                  type="url"
                  className="form-input"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="input-label" htmlFor="tags">Tags (Comma Separated)</label>
              <div className="input-with-icon">
                <FiTag className="input-lead-icon" />
                <input
                  id="tags"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Tech, IIT, Advisory, Doctor, Tennis"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="input-label" htmlFor="notes">Notes & Dossier Details</label>
              <textarea
                id="notes"
                className="form-input form-textarea"
                rows={4}
                placeholder="Important notes, meeting context, spare keys info, blood group..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              ></textarea>
            </div>
          </div>
        )}

        {/* TAB 3: Location */}
        {activeTab === 'location' && (
          <div className="form-tab-content animate-fade-in">
            <div className="form-field">
              <label className="input-label" htmlFor="address">Street / Flat / Landmark Address</label>
              <div className="input-with-icon">
                <FiMapPin className="input-lead-icon" />
                <input
                  id="address"
                  type="text"
                  className="form-input"
                  placeholder="Flat 402, Lotus Towers, Linking Road"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-field">
                <label className="input-label" htmlFor="city">City / Town</label>
                <input
                  id="city"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="input-label" htmlFor="state">State / UT</label>
                <select
                  id="state"
                  className="form-input form-select"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                >
                  {INDIAN_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="input-label" htmlFor="pincode">PIN Code</label>
                <input
                  id="pincode"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 400050"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  maxLength={6}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Appearance & Category */}
        {activeTab === 'appearance' && (
          <div className="form-tab-content animate-fade-in">
            {/* Category Selection */}
            <div className="form-field">
              <label className="input-label">Contact Category</label>
              <div className="category-select-grid">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cat-select-btn ${formData.group === cat.id ? 'active' : ''}`}
                    style={{ '--cat-color': cat.color }}
                    onClick={() => setFormData(prev => ({ ...prev, group: cat.id, cardColor: cat.color }))}
                  >
                    <span className="cat-color-dot" style={{ background: cat.color }}></span>
                    <span className="cat-name">{cat.name}</span>
                    {formData.group === cat.id && <FiCheck className="cat-check" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Visual Style */}
            <div className="form-field">
              <label className="input-label">Card Display Style</label>
              <div className="card-style-picker-grid">
                {CARD_STYLES.map(style => (
                  <button
                    key={style.id}
                    type="button"
                    className={`style-choice-btn ${formData.cardStyle === style.id ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, cardStyle: style.id }))}
                  >
                    <span className="style-name">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Theme & Photo URL */}
            <div className="form-field">
              <label className="input-label">Profile Avatar Theme</label>
              <div className="avatar-preview-row">
                <div
                  className="preview-avatar-circle"
                  style={{ background: formData.avatarBg }}
                >
                  <span>{getInitials(formData.fullName || 'V')}</span>
                </div>
                <div className="palette-options">
                  {AVATAR_PALETTES.map((palette, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`palette-swatch ${formData.avatarBg === palette ? 'active' : ''}`}
                      style={{ background: palette }}
                      onClick={() => setFormData(prev => ({ ...prev, avatarBg: palette }))}
                      aria-label={`Color palette ${index + 1}`}
                    >
                      {formData.avatarBg === palette && <FiCheck className="swatch-check" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Photo URL */}
            <div className="form-field">
              <label className="input-label" htmlFor="avatarUrl">Custom Photo Image URL (Optional)</label>
              <div className="input-with-icon">
                <FiImage className="input-lead-icon" />
                <input
                  id="avatarUrl"
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.avatarUrl}
                  onChange={(e) => handleChange('avatarUrl', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Submit Bar */}
        <div className="form-actions-footer">
          <button
            type="button"
            className="form-btn-cancel"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="form-btn-submit"
          >
            {isEditMode ? 'Save Changes' : 'Save to Directory'}
          </button>
        </div>
      </form>
    </div>
  );
};
