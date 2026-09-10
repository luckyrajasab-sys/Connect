import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { INDIAN_STATES } from '../../data/indianStates';
import { COUNTRIES, DEFAULT_COUNTRY, findCountryByCode } from '../../data/countries';
import { CATEGORIES } from '../../data/categories';
import { PhoneInput } from '../PhoneInput/PhoneInput';
import { validateContactForm } from '../../utils/validation';
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
  FiImage,
  FiRotateCcw,
  FiChevronRight,
  FiChevronLeft
} from 'react-icons/fi';
import './ContactForm.css';

const AVATAR_PALETTES = [
  "linear-gradient(135deg, #10B981, #047857)",
  "linear-gradient(135deg, #06B6D4, #0284C7)",
  "linear-gradient(135deg, #3B82F6, #1D4ED8)",
  "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  "linear-gradient(135deg, #EC4899, #BE185D)",
  "linear-gradient(135deg, #EF4444, #B91C1C)",
  "linear-gradient(135deg, #F59E0B, #B45309)",
  "linear-gradient(135deg, #1E293B, #0F172A)"
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
  const { addContact, updateContact, groups, defaultCardStyle, showToast } = useContacts();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || initialData?.name || '',
    avatarUrl: initialData?.avatarUrl || initialData?.avatar || '',
    avatarBg: initialData?.avatarBg || AVATAR_PALETTES[0],
    cardStyle: initialData?.cardStyle || defaultCardStyle || 'standard',
    cardColor: initialData?.cardColor || '#10B981',
    countryCode: initialData?.countryCode || 'IN',
    country: initialData?.country || 'India',
    phone: initialData?.phone || location.state?.initialPhone || '',
    alternatePhone: initialData?.alternatePhone || '',
    email: initialData?.email || '',
    company: initialData?.company || '',
    jobTitle: initialData?.jobTitle || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || 'Maharashtra',
    pincode: initialData?.pincode || initialData?.postalCode || '',
    birthday: initialData?.birthday || initialData?.dob || '',
    website: initialData?.website || '',
    linkedin: initialData?.linkedin || '',
    twitter: initialData?.twitter || '',
    notes: initialData?.notes || '',
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
    group: initialData?.group || initialData?.category || 'Personal',
    category: initialData?.category || initialData?.group || 'Personal',
    importance: initialData?.importance || 'normal',
    isFavorite: Boolean(initialData?.isFavorite || initialData?.favorite),
    favorite: Boolean(initialData?.isFavorite || initialData?.favorite),
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
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (field === 'fullName' && !isEditMode && !formData.avatarBg) {
      updated.avatarBg = getAvatarGradient(value);
    }

    if (touched[field]) {
      const { errors: currentErrors } = validateContactForm(updated);
      setErrors(prev => ({ ...prev, [field]: currentErrors[field] || null }));
    }
  };

  const handleCountryChange = (cCode) => {
    const matched = COUNTRIES.find(c => c.code === cCode) || DEFAULT_COUNTRY;
    setFormData(prev => ({
      ...prev,
      countryCode: cCode,
      country: matched.name,
      state: cCode === 'IN' ? 'Maharashtra' : ''
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const { errors: currentErrors } = validateContactForm(formData);
    setErrors(prev => ({ ...prev, [field]: currentErrors[field] || null }));
  };

  const handleClearForm = () => {
    setFormData({
      fullName: '',
      avatarUrl: '',
      avatarBg: AVATAR_PALETTES[0],
      cardStyle: defaultCardStyle || 'standard',
      cardColor: '#10B981',
      countryCode: 'IN',
      country: 'India',
      phone: '',
      alternatePhone: '',
      email: '',
      company: '',
      jobTitle: '',
      address: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
      birthday: '',
      website: '',
      linkedin: '',
      twitter: '',
      notes: '',
      tags: '',
      group: 'Personal',
      category: 'Personal',
      importance: 'normal',
      isFavorite: false,
      favorite: false,
      isEmergency: false,
      emergencyRelation: ''
    });
    setErrors({});
    setTouched({});
    showToast('Form cleared', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateContactForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
      setTouched(allTouched);

      // Focus tab that contains the first error
      if (validationErrors.fullName || validationErrors.phone || validationErrors.email) {
        setActiveTab('basic');
      } else if (validationErrors.pincode) {
        setActiveTab('location');
      }

      const firstError = Object.values(validationErrors)[0] || 'Please complete the required fields';
      showToast(firstError, 'error');
      return;
    }

    const formattedPayload = {
      ...formData,
      tags: formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []
    };

    if (isEditMode) {
      await updateContact(initialData.id, formattedPayload);
      navigate(`/contacts/${initialData.id}`);
    } else {
      const created = await addContact(formattedPayload);
      if (created) {
        navigate(`/contacts/${created.id}`);
      } else {
        navigate('/contacts');
      }
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
              {isEditMode ? 'Edit Contact Profile' : 'Create Global Contact'}
            </h2>
            <p className="form-page-subtitle">
              Configure profile attributes, international calling info, QR vCard, and emergency contacts
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
            <FiBriefcase /> Work &amp; Social
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
            <FiLayers /> Style &amp; Category
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
                  placeholder="e.g. Aarav Sharma / Dr. John Smith"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  required
                />
              </div>
              {errors.fullName && <span className="field-error-msg">{errors.fullName}</span>}
            </div>

            {/* International Phone Inputs */}
            <div className="form-grid-2">
              <PhoneInput
                id="phone"
                label="Primary Phone Number"
                required={true}
                value={formData.phone}
                onChange={(val) => handleChange('phone', val)}
                countryCode={formData.countryCode}
                onCountryChange={handleCountryChange}
              />

              <PhoneInput
                id="alternatePhone"
                label="Alternate Phone (Optional)"
                required={false}
                value={formData.alternatePhone}
                onChange={(val) => handleChange('alternatePhone', val)}
                countryCode={formData.countryCode}
                onCountryChange={handleCountryChange}
              />
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
                    placeholder="name@domain.com"
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
                  onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked, favorite: e.target.checked }))}
                />
                <div className="toggle-visual">
                  <FiStar className="toggle-icon text-amber" />
                  <div>
                    <span className="toggle-title">Add to Starred Favorites</span>
                    <span className="toggle-desc">Show on Dashboard fast-dial carousel</span>
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
                    <span className="toggle-title">Emergency SOS Contact</span>
                    <span className="toggle-desc">Highlight in emergency crisis section</span>
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
                  placeholder="e.g. Father, Mother, Spouse, Family Doctor"
                  value={formData.emergencyRelation}
                  onChange={(e) => handleChange('emergencyRelation', e.target.value)}
                />
              </div>
            )}

            <div className="tab-step-action-row">
              <div></div>
              <button
                type="button"
                className="tab-next-step-btn"
                onClick={() => setActiveTab('work')}
              >
                <span>Next: Work &amp; Social</span>
                <FiChevronRight />
              </button>
            </div>
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
                    placeholder="e.g. Google, TechCorp, NHS"
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
                  placeholder="e.g. Senior Architect / VP Engineering"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="input-label" htmlFor="website">Website / Portfolio</label>
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
                <label className="input-label" htmlFor="linkedin">LinkedIn Profile URL</label>
                <input
                  id="linkedin"
                  type="url"
                  className="form-input"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
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
                  placeholder="e.g. Tech, Advisory, Client, Doctor, VIP"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="input-label" htmlFor="notes">Notes &amp; Dossier Details</label>
              <textarea
                id="notes"
                className="form-input form-textarea"
                rows={4}
                placeholder="Important notes, meeting context, spare keys info, special instructions..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              ></textarea>
            </div>

            <div className="tab-step-action-row">
              <button
                type="button"
                className="tab-prev-step-btn"
                onClick={() => setActiveTab('basic')}
              >
                <FiChevronLeft />
                <span>Back</span>
              </button>
              <button
                type="button"
                className="tab-next-step-btn"
                onClick={() => setActiveTab('location')}
              >
                <span>Next: Location</span>
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Location */}
        {activeTab === 'location' && (
          <div className="form-tab-content animate-fade-in">
            {/* Global Country Selector */}
            <div className="form-field">
              <label className="input-label" htmlFor="country">Country / Region</label>
              <select
                id="country"
                className="form-input form-select"
                value={formData.countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.dialCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="input-label" htmlFor="address">Street / Residence Address</label>
              <div className="input-with-icon">
                <FiMapPin className="input-lead-icon" />
                <input
                  id="address"
                  type="text"
                  className="form-input"
                  placeholder="Street address, apartment, suite, unit, etc."
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
                  placeholder="City name"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="input-label" htmlFor="state">State / Province / Region</label>
                {formData.countryCode === 'IN' ? (
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
                ) : (
                  <input
                    id="state"
                    type="text"
                    className="form-input"
                    placeholder="e.g. California, Ontario, London"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                  />
                )}
              </div>

              <div className="form-field">
                <label className="input-label" htmlFor="pincode">Postal / ZIP Code</label>
                <input
                  id="pincode"
                  type="text"
                  className="form-input"
                  placeholder="ZIP or Postal Code"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                />
              </div>
            </div>

            <div className="tab-step-action-row">
              <button
                type="button"
                className="tab-prev-step-btn"
                onClick={() => setActiveTab('work')}
              >
                <FiChevronLeft />
                <span>Back</span>
              </button>
              <button
                type="button"
                className="tab-next-step-btn"
                onClick={() => setActiveTab('appearance')}
              >
                <span>Next: Style &amp; Category</span>
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Style & Category */}
        {activeTab === 'appearance' && (
          <div className="form-tab-content animate-fade-in">
            {/* Category / Group */}
            <div className="form-field">
              <label className="input-label">Category Group</label>
              <div className="category-select-grid">
                {groups.map(grp => (
                  <button
                    key={grp.id}
                    type="button"
                    className={`cat-choice-btn ${formData.category === grp.id || formData.group === grp.id ? 'active' : ''}`}
                    onClick={() => {
                      handleChange('category', grp.id);
                      handleChange('group', grp.id);
                    }}
                    style={{ '--cat-color': grp.color }}
                  >
                    <span className="cat-choice-dot" style={{ background: grp.color }}></span>
                    <span>{grp.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Palette Selector */}
            <div className="form-field">
              <label className="input-label">Avatar Color Palette</label>
              <div className="palette-picker-row">
                {AVATAR_PALETTES.map((grad, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`palette-swatch ${formData.avatarBg === grad ? 'selected' : ''}`}
                    style={{ background: grad }}
                    onClick={() => handleChange('avatarBg', grad)}
                    aria-label={`Select palette ${idx + 1}`}
                  >
                    {formData.avatarBg === grad && <FiCheck className="swatch-check" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Style Selector */}
            <div className="form-field">
              <label className="input-label">Preferred Card Visual Style</label>
              <div className="card-style-picker-grid">
                {CARD_STYLES.map(style => (
                  <button
                    key={style.id}
                    type="button"
                    className={`style-choice-btn ${formData.cardStyle === style.id ? 'active' : ''}`}
                    onClick={() => handleChange('cardStyle', style.id)}
                  >
                    <span>{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="tab-step-action-row">
              <button
                type="button"
                className="tab-prev-step-btn"
                onClick={() => setActiveTab('location')}
              >
                <FiChevronLeft />
                <span>Back</span>
              </button>
              <div></div>
            </div>
          </div>
        )}

        {/* Form Bottom Actions */}
        <div className="form-submit-row">
          <button
            type="button"
            className="form-clear-btn"
            onClick={handleClearForm}
            title="Clear all inputs"
          >
            <FiRotateCcw />
            <span>Clear Form</span>
          </button>
          <div className="form-submit-right-actions">
            <button
              type="button"
              className="form-cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="form-save-btn"
            >
              <FiCheck />
              <span>{isEditMode ? 'Save Changes' : 'Create Contact'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
