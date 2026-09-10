import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiDownload,
  FiUpload,
  FiHardDrive,
  FiShield,
  FiRefreshCw,
  FiDatabase,
  FiStar,
  FiAlertTriangle,
  FiSliders,
  FiLayers,
  FiEyeOff,
  FiGitMerge,
  FiCheck,
  FiFileText,
  FiEdit3,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiClock,
  FiArrowRight,
  FiSun,
  FiMoon,
  FiMonitor,
  FiX
} from 'react-icons/fi';
import './Profile.css';

const THEME_MODES = [
  { id: 'light', name: 'Light Mode', icon: FiSun },
  { id: 'dark', name: 'Dark Mode', icon: FiMoon },
  { id: 'system', name: 'System Sync', icon: FiMonitor }
];

const ACCENTS = [
  { id: 'emerald', name: 'Matrix Emerald', color: '#10B981' },
  { id: 'orange', name: 'Cyber Orange', color: '#FF7722' },
  { id: 'cyan', name: 'Neon Cyan', color: '#00E5FF' },
  { id: 'purple', name: 'Electric Purple', color: '#A855F7' }
];

const CARD_STYLES = [
  { id: 'standard', name: 'Standard' },
  { id: 'compact', name: 'Compact' },
  { id: 'large', name: 'Large' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'glass', name: 'Glass' },
  { id: 'gradient', name: 'Gradient' }
];

const SORT_OPTIONS = [
  { id: 'favorites', name: 'Starred Favorites First' },
  { id: 'name-asc', name: 'Name (A to Z)' },
  { id: 'name-desc', name: 'Name (Z to A)' },
  { id: 'recent', name: 'Recently Added' },
  { id: 'updated', name: 'Recently Updated' },
  { id: 'most-contacted', name: 'Most Contacted' },
  { id: 'category', name: 'Category / Group' },
  { id: 'city', name: 'City / Location' }
];

export const Profile = () => {
  const {
    currentUser,
    accounts,
    updateUserProfile,
    syncEmailContactHistory,
    restoreEmailContactHistory,
    switchAccount,
    getSavedEmailAccounts,
    logoutUser,
    themeMode,
    setThemeMode,
    accentColor,
    setAccentColor,
    defaultCardStyle,
    setDefaultCardStyle,
    defaultSort,
    setDefaultSort,
    privacySettings,
    setPrivacySettings,
    stats,
    personalEmergency,
    exportContactsJSON,
    exportContactsVCard,
    exportContactsCSV,
    backupAllData,
    importContactsList,
    importFromMobilePicker,
    importVCardRaw,
    importCSVRaw,
    restoreAllData,
    resetToDefaults,
    checkDuplicatesNow,
    showToast
  } = useContacts();

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const vcfInputRef = useRef(null);
  const csvInputRef = useRef(null);
  const vaultInputRef = useRef(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Profile Form State
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editCompany, setEditCompany] = useState(currentUser?.company || '');
  const [editJobTitle, setEditJobTitle] = useState(currentUser?.jobTitle || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editEmergency, setEditEmergency] = useState(currentUser?.emergencyContact || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.avatarUrl || '');

  const openEditProfile = () => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditEmail(currentUser.email || '');
      setEditPhone(currentUser.phone || '');
      setEditCompany(currentUser.company || '');
      setEditJobTitle(currentUser.jobTitle || '');
      setEditBio(currentUser.bio || '');
      setEditEmergency(currentUser.emergencyContact || '');
      setEditAvatarUrl(currentUser.avatarUrl || '');
      setShowEditModal(true);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      company: editCompany,
      jobTitle: editJobTitle,
      bio: editBio,
      emergencyContact: editEmergency,
      avatarUrl: editAvatarUrl
    });
    setShowEditModal(false);
  };

  // Handle JSON Import
  const handleJSONImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (Array.isArray(parsed)) {
          importContactsList(parsed);
        } else if (parsed.contacts && Array.isArray(parsed.contacts)) {
          importContactsList(parsed.contacts);
        } else {
          showToast('Unsupported JSON contact format', 'warning');
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        showToast('Invalid JSON file format', 'warning');
      }
    };
    reader.readAsText(file);
  };

  // Handle vCard Import
  const handleVCFImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        importVCardRaw(text);
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
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        importCSVRaw(text);
        if (csvInputRef.current) csvInputRef.current.value = '';
      } catch (err) {
        showToast('Failed to parse CSV file', 'warning');
      }
    };
    reader.readAsText(file);
  };

  // Handle Vault Restore
  const handleVaultRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed.contacts) {
          restoreAllData(parsed);
        } else if (Array.isArray(parsed)) {
          importContactsList(parsed);
        } else {
          showToast('Unsupported vault backup file', 'warning');
        }
        if (vaultInputRef.current) vaultInputRef.current.value = '';
      } catch (err) {
        showToast('Error reading vault file', 'warning');
      }
    };
    reader.readAsText(file);
  };

  const savedAccounts = getSavedEmailAccounts();

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
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
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
                    : currentUser.role || 'Member'}
                </span>
                <span className="user-sync-pill">
                  <span className="sync-pulse-dot"></span>
                  <span>
                    {currentUser.provider === 'google'
                      ? 'Google Synced'
                      : currentUser.provider === 'apple'
                      ? 'Apple Synced'
                      : 'Email Synced'}
                  </span>
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
                  <strong>{stats?.total || 0}</strong> Contacts in Vault
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
            <button
              className="user-action-btn btn-sync-now"
              onClick={syncEmailContactHistory}
              title="Sync current contacts with your cloud vault"
            >
              <FiRefreshCw />
              <span>Sync Cloud Vault</span>
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
              <p>Sign in with your Google, Apple, or email account to save and retrieve your contacts across devices.</p>
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

      {/* 2. EMAIL CONTACT HISTORY & CLOUD VAULT SECTION */}
      <section className="profile-section">
        <div className="section-title-wrap">
          <h2 className="profile-section-title">Email Contact History &amp; Cloud Accounts</h2>
          <span className="section-subtitle">
            Every email account maintains its own contact history archive. When you log in with an email, its saved contacts are instantly retrieved.
          </span>
        </div>

        <div className="profile-card">
          {/* Active Cloud Sync Status */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-emerald">
                <FiDatabase />
              </div>
              <div>
                <span className="row-title">Active Cloud Vault</span>
                <span className="row-desc">
                  Connected to: <strong>{currentUser?.email || 'Guest Mode'}</strong> • Last Sync:{' '}
                  {currentUser?.lastSync ? new Date(currentUser.lastSync).toLocaleTimeString() : 'Never'}
                </span>
              </div>
            </div>
            <div className="row-btn-group">
              <button
                className="action-btn-pill btn-emerald-pill"
                onClick={syncEmailContactHistory}
                disabled={!currentUser}
              >
                <FiRefreshCw className="mr-1" />
                Sync Now
              </button>
            </div>
          </div>

          <div className="divider-line"></div>

          {/* Saved Email Accounts & History Selector */}
          <div className="email-history-list-wrapper">
            <span className="email-history-title">
              <FiClock className="mr-1" /> Available Email Contact Histories on this Browser:
            </span>

            <div className="email-accounts-grid">
              {savedAccounts.map((acc) => {
                const isCurrent = currentUser?.id === acc.id;
                return (
                  <div
                    key={acc.id}
                    className={`email-account-card ${isCurrent ? 'is-active-account' : ''}`}
                  >
                    <div className="acc-card-header">
                      <div
                        className="acc-mini-avatar"
                        style={{ background: acc.avatarBg || 'linear-gradient(135deg, #064E3B, #10B981)' }}
                      >
                        {acc.name.charAt(0)}
                      </div>
                      <div className="acc-meta">
                        <strong className="acc-name">{acc.name}</strong>
                        <span className="acc-email">{acc.email}</span>
                      </div>
                      {isCurrent && <span className="acc-current-badge">Active</span>}
                    </div>

                    <div className="acc-stats-row">
                      <span>Saved Contacts:</span>
                      <strong>{acc.savedContactsCount} contacts</strong>
                    </div>

                    <div className="acc-actions-row">
                      {isCurrent ? (
                        <button
                          className="acc-btn active-restore-btn"
                          onClick={() => restoreEmailContactHistory(acc.email)}
                        >
                          <FiRefreshCw /> Restore Saved Contacts
                        </button>
                      ) : (
                        <button
                          className="acc-btn switch-btn"
                          onClick={() => switchAccount(acc.id)}
                        >
                          <FiArrowRight /> Switch &amp; Load Contacts
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: Appearance & Theme */}
      <section className="profile-section">
        <h2 className="profile-section-title">Appearance &amp; Theme Settings</h2>

        <div className="profile-card">
          {/* Theme Mode Toggle (Light, Dark, System) */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-emerald">
                {themeMode === 'dark' ? <FiMoon /> : themeMode === 'light' ? <FiSun /> : <FiMonitor />}
              </div>
              <div>
                <span className="row-title">Theme Mode</span>
                <span className="row-desc">Switch between Light, Dark, or sync with System OS preferences</span>
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
                    aria-label={mode.name}
                  >
                    <Icon className="segment-icon" />
                    <span>{mode.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divider-line"></div>

          {/* Accent Color Picker */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-emerald">
                <FiSliders />
              </div>
              <div>
                <span className="row-title">Brand Accent Color</span>
                <span className="row-desc">Select glowing highlight theme</span>
              </div>
            </div>
            <div className="accent-swatches-row">
              {ACCENTS.map((acc) => (
                <button
                  key={acc.id}
                  className={`accent-swatch-btn ${accentColor === acc.id ? 'active' : ''}`}
                  style={{ background: acc.color }}
                  onClick={() => setAccentColor(acc.id)}
                  title={acc.name}
                  aria-label={acc.name}
                >
                  {accentColor === acc.id && <FiCheck />}
                </button>
              ))}
            </div>
          </div>

          <div className="divider-line"></div>

          {/* Default Card Style */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-cyan">
                <FiLayers />
              </div>
              <div>
                <span className="row-title">Default Card Display Style</span>
                <span className="row-desc">Visual layout applied when opening contact previews</span>
              </div>
            </div>
            <select
              className="profile-select-control"
              value={defaultCardStyle}
              onChange={(e) => setDefaultCardStyle(e.target.value)}
            >
              {CARD_STYLES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} Card
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 4. SECTION: Contacts & Organization */}
      <section className="profile-section">
        <h2 className="profile-section-title">Directory Preferences</h2>

        <div className="profile-card">
          {/* Default Sorting */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-purple">
                <FiSliders />
              </div>
              <div>
                <span className="row-title">Default Sorting Method</span>
                <span className="row-desc">Primary ordering applied when browsing directory</span>
              </div>
            </div>
            <select
              className="profile-select-control"
              value={defaultSort}
              onChange={(e) => setDefaultSort(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="divider-line"></div>

          {/* Duplicate Detection Check */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-amber">
                <FiGitMerge />
              </div>
              <div>
                <span className="row-title">Smart Duplicate Detection</span>
                <span className="row-desc">Scan directory for identical phone numbers or email addresses</span>
              </div>
            </div>
            <button className="action-btn-pill btn-amber-pill" onClick={checkDuplicatesNow}>
              Check Duplicates Now
            </button>
          </div>
        </div>
      </section>

      {/* 5. SECTION: Privacy & Security */}
      <section className="profile-section">
        <h2 className="profile-section-title">Privacy &amp; Masking Controls</h2>

        <div className="profile-card">
          {/* Hide Phone Numbers Mode */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-muted">
                <FiEyeOff />
              </div>
              <div>
                <span className="row-title">Mask Phone Numbers on Cards</span>
                <span className="row-desc">Hides middle digits on card previews for privacy in public spaces</span>
              </div>
            </div>
            <label className="switch-toggle-label">
              <input
                type="checkbox"
                checked={privacySettings.hidePhoneNumbers}
                onChange={(e) =>
                  setPrivacySettings((prev) => ({ ...prev, hidePhoneNumbers: e.target.checked }))
                }
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="divider-line"></div>

          {/* Hide Email Addresses Mode */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-muted">
                <FiEyeOff />
              </div>
              <div>
                <span className="row-title">Mask Email Addresses on Cards</span>
                <span className="row-desc">Obfuscates email text until contact dossier is opened</span>
              </div>
            </div>
            <label className="switch-toggle-label">
              <input
                type="checkbox"
                checked={privacySettings.hideEmailAddresses}
                onChange={(e) =>
                  setPrivacySettings((prev) => ({ ...prev, hideEmailAddresses: e.target.checked }))
                }
              />
              <span className="switch-slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* 6. SECTION: Data Import, Export & Vault Backup */}
      <section className="profile-section">
        <h2 className="profile-section-title">Data Backup &amp; Migration</h2>

        <div className="profile-card backup-card-group">
          {/* Export vCard */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-saffron">
                <FiDownload />
              </div>
              <div>
                <span className="row-title">Export Contacts as vCard (.vcf)</span>
                <span className="row-desc">Universal address book format compatible with iOS, Android, and Outlook</span>
              </div>
            </div>
            <button className="action-btn-pill btn-primary-pill" onClick={exportContactsVCard}>
              Download vCard
            </button>
          </div>

          <div className="divider-line"></div>

          {/* Export CSV */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-emerald">
                <FiFileText />
              </div>
              <div>
                <span className="row-title">Export Contacts as CSV Spreadsheet</span>
                <span className="row-desc">Formatted table for Excel, Google Sheets, or CRM databases</span>
              </div>
            </div>
            <button className="action-btn-pill btn-emerald-pill" onClick={exportContactsCSV}>
              Download CSV
            </button>
          </div>

          <div className="divider-line"></div>

          {/* Export JSON */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-blue">
                <FiDownload />
              </div>
              <div>
                <span className="row-title">Export Contacts (JSON)</span>
                <span className="row-desc">Direct structured database backup</span>
              </div>
            </div>
            <button className="action-btn-pill btn-blue-pill" onClick={exportContactsJSON}>
              Export JSON
            </button>
          </div>

          {/* Import from Device / Phone Address Book */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-emerald">
                <FiPhone />
              </div>
              <div>
                <span className="row-title">Pick Contacts from Phone / Mobile Address Book</span>
                <span className="row-desc">Direct 1-tap contact picker from your mobile device</span>
              </div>
            </div>
            <button className="action-btn-pill btn-emerald-pill" onClick={importFromMobilePicker}>
              Pick from Phone
            </button>
          </div>

          <div className="divider-line"></div>

          {/* Import vCard */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-saffron">
                <FiUpload />
              </div>
              <div>
                <span className="row-title">Import Contacts from vCard (.vcf)</span>
                <span className="row-desc">Load contacts from saved .vcf file</span>
              </div>
            </div>
            <label className="action-btn-pill btn-secondary-pill cursor-pointer">
              <span>Choose .vcf File</span>
              <input
                type="file"
                ref={vcfInputRef}
                accept=".vcf,.vcard"
                onChange={handleVCFImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="divider-line"></div>

          {/* Import CSV */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-emerald">
                <FiUpload />
              </div>
              <div>
                <span className="row-title">Import Contacts from CSV</span>
                <span className="row-desc">Import spreadsheet rows with auto-mapped fields</span>
              </div>
            </div>
            <label className="action-btn-pill btn-secondary-pill cursor-pointer">
              <span>Choose .csv File</span>
              <input
                type="file"
                ref={csvInputRef}
                accept=".csv"
                onChange={handleCSVImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="divider-line"></div>

          {/* Full Vault Backup */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-purple">
                <FiDatabase />
              </div>
              <div>
                <span className="row-title">Full Vault Backup</span>
                <span className="row-desc">Complete archive including preferences, emergency numbers &amp; categories</span>
              </div>
            </div>
            <button className="action-btn-pill btn-purple-pill" onClick={backupAllData}>
              Download Full Vault
            </button>
          </div>

          <div className="divider-line"></div>

          {/* Full Vault Restore */}
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-amber">
                <FiHardDrive />
              </div>
              <div>
                <span className="row-title">Restore Full Vault Archive</span>
                <span className="row-desc">Restore entire application state from a saved Vcontacts vault file</span>
              </div>
            </div>
            <label className="action-btn-pill btn-amber-pill cursor-pointer">
              <span>Restore Vault File</span>
              <input
                type="file"
                ref={vaultInputRef}
                accept=".json"
                onChange={handleVaultRestore}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </section>

      {/* 7. System Reset */}
      <section className="profile-section">
        <h2 className="profile-section-title">System Reset</h2>

        <div className="profile-card">
          <div className="profile-row">
            <div className="profile-row-info">
              <div className="row-icon-wrap text-red">
                <FiRefreshCw />
              </div>
              <div>
                <span className="row-title">Clear All Contacts &amp; Storage</span>
                <span className="row-desc">Wipe all local records while retaining official emergency helplines</span>
              </div>
            </div>
            <button
              className="action-btn-pill btn-danger-pill"
              onClick={() => setShowResetModal(true)}
            >
              Wipe Data
            </button>
          </div>
        </div>
      </section>

      {/* 8. EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="modal-overlay-backdrop animate-fade-in" onClick={() => setShowEditModal(false)}>
          <div className="profile-edit-modal animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <div className="edit-modal-title">
                <FiEdit3 className="mr-2" />
                <h3>Edit User Profile</h3>
              </div>
              <button className="edit-modal-close" onClick={() => setShowEditModal(false)}>
                <FiX />
              </button>
            </div>

            <form className="profile-edit-form" onSubmit={handleSaveProfile}>
              <div className="edit-form-grid">
                <div className="edit-field-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div className="edit-field-group">
                  <label>Email Address (Cloud History Key)</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="edit-field-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>

                <div className="edit-field-group">
                  <label>Company / Organization</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                  />
                </div>

                <div className="edit-field-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={editJobTitle}
                    onChange={(e) => setEditJobTitle(e.target.value)}
                  />
                </div>

                <div className="edit-field-group">
                  <label>Avatar Photo URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                  />
                </div>

                <div className="edit-field-group full-width">
                  <label>Emergency Contact Name / Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Priya Patel (+91 9876543210)"
                    value={editEmergency}
                    onChange={(e) => setEditEmergency(e.target.value)}
                  />
                </div>

                <div className="edit-field-group full-width">
                  <label>Short Bio</label>
                  <textarea
                    rows="3"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="edit-form-actions">
                <button
                  type="button"
                  className="action-btn-pill btn-secondary-pill"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="action-btn-pill btn-primary-pill">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetModal}
        type="danger"
        title="Clear All Contact Data?"
        message="This will permanently delete all contacts and personal emergency records stored in your browser."
        confirmText="Yes, Wipe Everything"
        cancelText="Cancel"
        onConfirm={() => {
          resetToDefaults();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
};
