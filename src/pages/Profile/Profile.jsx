import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { useI18n } from '../../context/I18nContext';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { parseVCardString, parseCSVString } from '../../utils/vcard';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiDownload,
  FiUpload,
  FiShield,
  FiRefreshCw,
  FiDatabase,
  FiStar,
  FiAlertTriangle,
  FiSliders,
  FiLayers,
  FiEdit3,
  FiLogOut,
  FiLogIn,
  FiSun,
  FiMoon,
  FiMonitor,
  FiGlobe,
  FiClock,
  FiDollarSign,
  FiTrash2,
  FiCheck,
  FiArrowRight,
  FiFileText
} from 'react-icons/fi';
import './Profile.css';

const THEME_MODES = [
  { id: 'light', name: 'Light Mode', icon: FiSun },
  { id: 'dark', name: 'Dark Mode', icon: FiMoon },
  { id: 'system', name: 'System Sync', icon: FiMonitor }
];

const ACCENTS = [
  { id: 'emerald', name: 'Matrix Emerald', color: '#10B981' },
  { id: 'cyan', name: 'Neon Cyan', color: '#06B6D4' },
  { id: 'blue', name: 'Electric Blue', color: '#3B82F6' },
  { id: 'purple', name: 'Royal Purple', color: '#8B5CF6' }
];

export const Profile = () => {
  const {
    currentUser,
    updateUserProfile,
    logoutUser,
    themeMode,
    setThemeMode,
    accentColor,
    setAccentColor,
    privacySettings,
    setPrivacySettings,
    stats,
    personalEmergency,
    contacts,
    exportContactsJSON,
    exportContactsVCard,
    exportContactsCSV,
    importContactsList,
    bulkDeleteContacts,
    checkDuplicatesNow,
    showToast
  } = useContacts();

  const {
    language,
    setLanguage,
    LANGUAGES,
    currency,
    setCurrency,
    CURRENCIES,
    timezone,
    setTimezone,
    TIMEZONES,
    dateFormat,
    setDateFormat,
    DATE_FORMATS,
    countryCode,
    setCountryCode,
    COUNTRIES,
    t
  } = useI18n();

  const navigate = useNavigate();

  const vcfInputRef = useRef(null);
  const csvInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'appearance' | 'language' | 'region' | 'privacy' | 'danger'
  const [showEditModal, setShowEditModal] = useState(false);
  const [showClearContactsModal, setShowClearContactsModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  // Edit Profile Form State
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editCompany, setEditCompany] = useState(currentUser?.company || '');
  const [editJobTitle, setEditJobTitle] = useState(currentUser?.jobTitle || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');

  const openEditProfile = () => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditEmail(currentUser.email || '');
      setEditPhone(currentUser.phone || '');
      setEditCompany(currentUser.company || '');
      setEditJobTitle(currentUser.jobTitle || '');
      setEditBio(currentUser.bio || '');
      setShowEditModal(true);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateUserProfile({
      name: editName,
      phone: editPhone,
      company: editCompany,
      jobTitle: editJobTitle,
      bio: editBio
    });
    setShowEditModal(false);
  };

  // Handle vCard Import
  const handleVCFImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        const parsed = parseVCardString(text);
        if (parsed.length > 0) {
          await importContactsList(parsed);
        } else {
          showToast('No valid contact entries found in vCard file', 'warning');
        }
        if (vcfInputRef.current) vcfInputRef.current.value = '';
      } catch (err) {
        showToast('Failed to parse vCard file', 'warning');
      }
    };
    reader.readAsText(file);
  };

  // Handle CSV Import
  const handleCSVImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        const parsed = parseCSVString(text);
        if (parsed.length > 0) {
          await importContactsList(parsed);
        } else {
          showToast('No valid contact records found in CSV file', 'warning');
        }
        if (csvInputRef.current) csvInputRef.current.value = '';
      } catch (err) {
        showToast('Failed to parse CSV file', 'warning');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllContacts = async () => {
    const allIds = contacts.map(c => c.id);
    await bulkDeleteContacts(allIds);
    setShowClearContactsModal(false);
    showToast('All contacts cleared from your cloud account', 'info');
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(false);
    logoutUser();
    navigate('/login');
    showToast('Your account session has been terminated', 'info');
  };

  return (
    <div className="profile-page-container animate-fade-in">
      {/* 1. TOP USER PROFILE HERO CARD */}
      {currentUser ? (
        <div className="profile-user-hero-card">
          <div className="user-hero-main">
            <div
              className="user-hero-avatar"
              style={{
                background: currentUser.avatarBg || 'linear-gradient(135deg, #064E3B, #10B981)'
              }}
            >
              {currentUser.avatarUrl || currentUser.avatar ? (
                <img
                  src={currentUser.avatarUrl || currentUser.avatar}
                  alt={currentUser.name}
                  className="user-avatar-img"
                />
              ) : (
                <span className="user-avatar-letter">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>

            <div className="user-hero-meta">
              <div className="user-hero-title-row">
                <h1 className="user-hero-name">{currentUser.name}</h1>
                <span className="user-role-badge">
                  {currentUser.provider === 'google'
                    ? 'Google Account'
                    : currentUser.provider === 'apple'
                    ? 'Apple ID'
                    : 'Verified Member'}
                </span>
                <span className="user-sync-pill">
                  <span className="sync-pulse-dot"></span>
                  <span>Cloud Synced</span>
                </span>
              </div>

              <div className="user-hero-sub-meta">
                <span className="user-hero-id" title="Cryptographic Database User ID">
                  <FiShield className="meta-icon" /> ID: <code>{currentUser.id}</code>
                </span>
                <span className="user-hero-email">
                  <FiMail className="meta-icon" /> {currentUser.email}
                </span>
                {currentUser.jobTitle && (
                  <span className="user-hero-job">
                    <FiBriefcase className="meta-icon" /> {currentUser.jobTitle}{' '}
                    {currentUser.company && `at ${currentUser.company}`}
                  </span>
                )}
                {currentUser.phone && (
                  <span className="user-hero-phone">
                    <FiPhone className="meta-icon" /> {currentUser.phone}
                  </span>
                )}
              </div>

              {currentUser.bio && <p className="user-hero-bio">"{currentUser.bio}"</p>}

              <div className="user-stats-bar">
                <div className="stat-pill">
                  <FiUser className="stat-icon" />
                  <strong>{stats?.total || 0}</strong> Total Contacts
                </div>
                <div className="stat-pill">
                  <FiStar className="stat-icon text-amber" />
                  <strong>{stats?.favorites || 0}</strong> Starred
                </div>
                <div className="stat-pill">
                  <FiAlertTriangle className="stat-icon text-red" />
                  <strong>{personalEmergency?.length || 0}</strong> SOS Contacts
                </div>
              </div>
            </div>
          </div>

          <div className="user-hero-actions">
            <button className="user-action-btn btn-edit-profile" onClick={openEditProfile}>
              <FiEdit3 />
              <span>Edit Profile</span>
            </button>
            <button className="user-action-btn btn-logout" onClick={logoutUser}>
              <FiLogOut />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-guest-card">
          <div className="guest-info">
            <div className="guest-icon-wrap">
              <FiUser />
            </div>
            <div>
              <h2>Guest / Offline Session</h2>
              <p>Sign in with your Google, Apple, or email account to save and retrieve your contacts securely.</p>
            </div>
          </div>
          <div className="guest-actions">
            <button className="btn-primary-pill" onClick={() => navigate('/login')}>
              <FiLogIn />
              <span>Sign In / Connect Account</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. SETTINGS NAVIGATION TABS */}
      <div className="settings-tab-bar">
        <button
          className={`settings-nav-pill ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <FiUser /> Account &amp; Identity
        </button>
        <button
          className={`settings-nav-pill ${activeTab === 'appearance' ? 'active' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          <FiSun /> Appearance
        </button>
        <button
          className={`settings-nav-pill ${activeTab === 'language' ? 'active' : ''}`}
          onClick={() => setActiveTab('language')}
        >
          <FiGlobe /> Language &amp; RTL
        </button>
        <button
          className={`settings-nav-pill ${activeTab === 'region' ? 'active' : ''}`}
          onClick={() => setActiveTab('region')}
        >
          <FiClock /> Region &amp; Formats
        </button>
        <button
          className={`settings-nav-pill ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <FiShield /> Privacy &amp; Data Control
        </button>
        <button
          className={`settings-nav-pill text-red ${activeTab === 'danger' ? 'active danger' : ''}`}
          onClick={() => setActiveTab('danger')}
        >
          <FiTrash2 /> Danger Zone
        </button>
      </div>

      {/* TAB CONTENT 1: Account */}
      {activeTab === 'account' && (
        <section className="profile-section animate-fade-in">
          <div className="section-title-wrap">
            <h2 className="profile-section-title">Cloud Account &amp; Sync Status</h2>
            <span className="section-subtitle">
              Your contact directory is encrypted and stored in PostgreSQL with Row-Level Security.
            </span>
          </div>

          <div className="profile-card">
            <div className="profile-row">
              <div className="profile-row-info">
                <div className="row-icon-wrap text-emerald">
                  <FiDatabase />
                </div>
                <div>
                  <span className="row-title">Active Database Vault</span>
                  <span className="row-desc">
                    User ID: <code>{currentUser?.id || 'Not Signed In'}</code> • {stats.total} Contacts Stored
                  </span>
                </div>
              </div>
              <div className="row-btn-group">
                <button
                  className="action-btn-pill btn-emerald-pill"
                  onClick={() => checkDuplicatesNow()}
                >
                  <FiRefreshCw className="mr-1" />
                  Scan Duplicates
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT 2: Appearance */}
      {activeTab === 'appearance' && (
        <section className="profile-section animate-fade-in">
          <h2 className="profile-section-title">Appearance &amp; Theme System</h2>
          <div className="profile-card">
            <div className="profile-row">
              <div className="profile-row-info">
                <div className="row-icon-wrap text-emerald">
                  {themeMode === 'dark' ? <FiMoon /> : themeMode === 'light' ? <FiSun /> : <FiMonitor />}
                </div>
                <div>
                  <span className="row-title">Color Mode</span>
                  <span className="row-desc">Switch between Light, Dark, or sync automatically with your Operating System</span>
                </div>
              </div>
              <div className="theme-segmented-group">
                {THEME_MODES.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      className={`theme-segment-btn ${themeMode === mode.id ? 'active' : ''}`}
                      onClick={() => setThemeMode(mode.id)}
                    >
                      <Icon className="segment-icon" />
                      <span>{mode.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="divider-line"></div>

            <div className="profile-row">
              <div className="profile-row-info">
                <div className="row-icon-wrap text-emerald">
                  <FiSliders />
                </div>
                <div>
                  <span className="row-title">Brand Accent Color</span>
                  <span className="row-desc">Customize buttons, highlights, and badge glow shades</span>
                </div>
              </div>
              <div className="accent-swatch-group">
                {ACCENTS.map((accent) => (
                  <button
                    key={accent.id}
                    type="button"
                    className={`accent-color-circle ${accentColor === accent.id ? 'active' : ''}`}
                    style={{ background: accent.color }}
                    onClick={() => setAccentColor(accent.id)}
                    title={accent.name}
                  >
                    {accentColor === accent.id && <FiCheck className="accent-check" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT 3: Language & RTL */}
      {activeTab === 'language' && (
        <section className="profile-section animate-fade-in">
          <div className="section-title-wrap">
            <h2 className="profile-section-title">Multi-Language &amp; RTL Support</h2>
            <span className="section-subtitle">
              Connect supports 11 international and Indian languages with native Right-to-Left (RTL) layout switching for Arabic.
            </span>
          </div>

          <div className="profile-card">
            <div className="language-selector-grid">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    className={`lang-card-choice ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setLanguage(lang.code)}
                  >
                    <span className="lang-flag">{lang.flag}</span>
                    <div className="lang-text-meta">
                      <strong className="lang-name">{lang.name}</strong>
                      <span className="lang-native">{lang.nativeName}</span>
                    </div>
                    {lang.isRTL && <span className="rtl-badge">RTL</span>}
                    {isSelected && <FiCheck className="lang-check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT 4: Region & Formats */}
      {activeTab === 'region' && (
        <section className="profile-section animate-fade-in">
          <div className="section-title-wrap">
            <h2 className="profile-section-title">Regional Conventions &amp; Formatting</h2>
            <span className="section-subtitle">
              Configure your default country, timezone, date formatting, and primary currency.
            </span>
          </div>

          <div className="profile-card">
            {/* Primary Country */}
            <div className="profile-row">
              <div className="profile-row-info">
                <div className="row-icon-wrap text-emerald">
                  <FiGlobe />
                </div>
                <div>
                  <span className="row-title">Default Country &amp; Dial Code</span>
                  <span className="row-desc">Used as the initial country code for phone inputs</span>
                </div>
              </div>
              <div className="settings-select-wrapper">
                <select
                  className="settings-select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divider-line"></div>

            {/* Date Format */}
            <div className="profile-row">
              <div className="profile-row-info">
                <div className="row-icon-wrap text-emerald">
                  <FiClock />
                </div>
                <div>
                  <span className="row-title">Date Format</span>
                  <span className="row-desc">How dates of birth and record timestamps are displayed</span>
                </div>
              </div>
              <div className="settings-select-wrapper">
                <select
                  className="settings-select"
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                >
                  {DATE_FORMATS.map(df => (
                    <option key={df.id} value={df.id}>
                      {df.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divider-line"></div>

            {/* Timezone */}
            <div className="profile-row">
              <div className="profile-row-info">
                <div className="row-icon-wrap text-emerald">
                  <FiClock />
                </div>
                <div>
                  <span className="row-title">Preferred Timezone</span>
                  <span className="row-desc">For interaction logs and meeting sync timestamps</span>
                </div>
              </div>
              <div className="settings-select-wrapper">
                <select
                  className="settings-select"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz.id} value={tz.id}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divider-line"></div>

            {/* Currency */}
            <div className="profile-row">
              <div className="profile-row-info">
                <div className="row-icon-wrap text-emerald">
                  <FiDollarSign />
                </div>
                <div>
                  <span className="row-title">Display Currency</span>
                  <span className="row-desc">Used for billing, plans, and business contact values</span>
                </div>
              </div>
              <div className="settings-select-wrapper">
                <select
                  className="settings-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) — {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT 5: Privacy & Data Control */}
      {activeTab === 'privacy' && (
        <section className="profile-section animate-fade-in">
          <div className="section-title-wrap">
            <h2 className="profile-section-title">Data Control, Portability &amp; Privacy (GDPR / DPDP)</h2>
            <span className="section-subtitle">
              You own your contact data. Export your directory in open standards anytime.
            </span>
          </div>

          <div className="profile-card">
            <div className="export-actions-grid">
              <div className="export-action-card" onClick={exportContactsVCard}>
                <div className="export-icon-box text-emerald">
                  <FiFileText />
                </div>
                <div className="export-card-info">
                  <strong>Export vCard (.vcf)</strong>
                  <span>Standard contact cards compatible with Apple Contacts, Google, Outlook</span>
                </div>
                <FiDownload className="export-download-arrow" />
              </div>

              <div className="export-action-card" onClick={exportContactsCSV}>
                <div className="export-icon-box text-blue">
                  <FiFileText />
                </div>
                <div className="export-card-info">
                  <strong>Export Spreadsheet (.csv)</strong>
                  <span>Comma-separated table format for Excel, Google Sheets, CRM</span>
                </div>
                <FiDownload className="export-download-arrow" />
              </div>

              <div className="export-action-card" onClick={exportContactsJSON}>
                <div className="export-icon-box text-purple">
                  <FiFileText />
                </div>
                <div className="export-card-info">
                  <strong>Full JSON Vault Backup</strong>
                  <span>Complete raw database export including notes and custom fields</span>
                </div>
                <FiDownload className="export-download-arrow" />
              </div>
            </div>

            <div className="divider-line"></div>

            {/* Import Controls */}
            <div className="import-controls-row">
              <input
                type="file"
                accept=".vcf,text/vcard"
                ref={vcfInputRef}
                style={{ display: 'none' }}
                onChange={handleVCFImport}
              />
              <input
                type="file"
                accept=".csv,text/csv"
                ref={csvInputRef}
                style={{ display: 'none' }}
                onChange={handleCSVImport}
              />

              <button
                className="secondary-pill-btn"
                onClick={() => vcfInputRef.current?.click()}
              >
                <FiUpload />
                <span>Import vCard File</span>
              </button>

              <button
                className="secondary-pill-btn"
                onClick={() => csvInputRef.current?.click()}
              >
                <FiUpload />
                <span>Import CSV File</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT 6: Danger Zone */}
      {activeTab === 'danger' && (
        <section className="profile-section animate-fade-in">
          <div className="section-title-wrap">
            <h2 className="profile-section-title text-red">Danger Zone</h2>
            <span className="section-subtitle">
              Irreversible actions regarding your contact directory and account.
            </span>
          </div>

          <div className="profile-card danger-card">
            <div className="profile-row">
              <div className="profile-row-info">
                <div className="row-icon-wrap text-red">
                  <FiTrash2 />
                </div>
                <div>
                  <span className="row-title">Clear All Contacts</span>
                  <span className="row-desc">Permanently remove all contacts from your account directory</span>
                </div>
              </div>
              <button
                className="danger-btn-pill"
                onClick={() => setShowClearContactsModal(true)}
              >
                Clear Contacts
              </button>
            </div>

            <div className="divider-line"></div>

            <div className="profile-row">
              <div className="profile-row-info">
                <div className="row-icon-wrap text-red">
                  <FiAlertTriangle />
                </div>
                <div>
                  <span className="row-title">Delete Account Session</span>
                  <span className="row-desc">Terminate your authentication session and sign out completely</span>
                </div>
              </div>
              <button
                className="danger-btn-pill"
                onClick={() => setShowDeleteAccountModal(true)}
              >
                Delete / Sign Out
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowEditModal(false)}>
          <div className="modal-dialog-box animate-pop-in" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>Edit Account Profile</h3>
              <button className="dialog-close-btn" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <form className="dialog-form" onSubmit={handleSaveProfile}>
              <div className="dialog-field">
                <label>Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="dialog-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>

              <div className="dialog-grid-2">
                <div className="dialog-field">
                  <label>Company</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                  />
                </div>
                <div className="dialog-field">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={editJobTitle}
                    onChange={(e) => setEditJobTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="dialog-field">
                <label>Bio / Status</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                ></textarea>
              </div>

              <div className="dialog-actions">
                <button
                  type="button"
                  className="dialog-btn cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dialog-btn save-btn"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clearing Contacts */}
      <ConfirmationModal
        isOpen={showClearContactsModal}
        title="Delete All Contacts?"
        message={`Are you sure you want to permanently delete all ${contacts.length} contacts? This action cannot be undone.`}
        confirmText="Yes, Delete All"
        confirmType="danger"
        onConfirm={handleClearAllContacts}
        onCancel={() => setShowClearContactsModal(false)}
      />

      {/* Confirmation Modal for Deleting Account */}
      <ConfirmationModal
        isOpen={showDeleteAccountModal}
        title="Sign Out & Clear Session?"
        message="This will immediately destroy your session and return you to the login page."
        confirmText="Confirm Sign Out"
        confirmType="danger"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteAccountModal(false)}
      />
    </div>
  );
};

export default Profile;
