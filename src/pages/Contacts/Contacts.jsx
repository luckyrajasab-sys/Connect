import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { ContactCard } from '../../components/ContactCard/ContactCard';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { formatIndianPhone } from '../../utils/validation';
import { getInitials } from '../../utils/avatarHelper';
import { getCategoryTheme } from '../../data/categories';
import { SocialImportModal } from '../../components/SocialImportModal/SocialImportModal';
import {
  FiGrid,
  FiList,
  FiMapPin,
  FiUserPlus,
  FiPhone,
  FiStar,
  FiChevronRight,
  FiMail,
  FiMaximize2,
  FiSliders,
  FiDownload,
  FiUpload
} from 'react-icons/fi';
import './Contacts.css';

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const Contacts = () => {
  const {
    filteredContacts,
    searchQuery,
    setSearchQuery,
    selectedGroup,
    setSelectedGroup,
    selectedFilter,
    setSelectedFilter,
    toggleFavorite,
    setActiveEmailContact,
    setActiveQRContact,
    cardStyleView,
    exportContactsVCard
  } = useContacts();

  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'compact'
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [activeImportModal, setActiveImportModal] = useState(null);
  const navigate = useNavigate();

  const displayedContacts = selectedLetter
    ? filteredContacts.filter(c => (c.fullName || '').toUpperCase().startsWith(selectedLetter))
    : filteredContacts;

  const handleLetterClick = (letter) => {
    setSelectedLetter(prev => (prev === letter ? null : letter));
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedGroup('all');
    setSelectedFilter('all');
    setSelectedLetter(null);
  };

  return (
    <div className="contacts-page-container animate-fade-in">
      {/* Top Header */}
      <div className="contacts-header-row">
        <div>
          <h1 className="contacts-main-title">
            Contact Directory <span className="title-count">({filteredContacts.length})</span>
          </h1>
          <p className="contacts-sub-title">
            Search, sort, filter and manage your complete smart address book
          </p>
        </div>

        <div className="header-controls">
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid View"
            >
              <FiGrid />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List View"
            >
              <FiList />
            </button>
            <button
              className="view-btn"
              onClick={() => navigate('/map')}
              aria-label="Open Map View"
              title="Interactive Location Map"
            >
              <FiMapPin />
            </button>
          </div>

          <button
            className="secondary-pill-btn"
            onClick={() => setActiveImportModal('google')}
            title="Direct Import from Google or Apple"
          >
            <FiUpload />
            <span>Import</span>
          </button>

          <button
            className="secondary-pill-btn"
            onClick={exportContactsVCard}
            title="Export all contacts to vCard"
          >
            <FiDownload />
            <span>Export vCard</span>
          </button>

          <button
            className="add-contact-pill-btn"
            onClick={() => navigate('/add')}
          >
            <FiUserPlus />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Social Import Modal */}
      {activeImportModal && (
        <SocialImportModal
          isOpen={Boolean(activeImportModal)}
          provider={activeImportModal}
          onClose={() => setActiveImportModal(null)}
        />
      )}

      {/* Search & Filter Component with Sort & Card Style Switcher */}
      <SearchBar showFilters={true} showSort={true} showCardStyleSwitcher={true} />

      {/* Alphabetical Scrubber */}
      <div className="alphabet-scrubber-bar">
        <button
          className={`alphabet-btn ${selectedLetter === null ? 'active' : ''}`}
          onClick={() => setSelectedLetter(null)}
        >
          All
        </button>
        {ALPHABETS.map(letter => {
          const hasContacts = filteredContacts.some(c =>
            (c.fullName || '').toUpperCase().startsWith(letter)
          );
          return (
            <button
              key={letter}
              className={`alphabet-btn ${selectedLetter === letter ? 'active' : ''} ${!hasContacts ? 'disabled' : ''}`}
              onClick={() => handleLetterClick(letter)}
              disabled={!hasContacts}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Contacts Grid / List Display */}
      {displayedContacts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="contacts-grid-layout animate-fade-in">
            {displayedContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <div className="contacts-list-layout animate-fade-in">
            {displayedContacts.map(contact => {
              const catTheme = getCategoryTheme(contact.group);
              return (
                <div
                  key={contact.id}
                  className="contact-list-row"
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                >
                  <div
                    className="list-avatar"
                    style={{ background: contact.avatarBg || catTheme.gradient }}
                  >
                    <span>{getInitials(contact.fullName)}</span>
                  </div>

                  <div className="list-info">
                    <div className="list-title-row">
                      <span className="list-name">{contact.fullName}</span>
                      <span className="list-cat-badge" style={{ color: catTheme.color, borderColor: catTheme.color }}>
                        {catTheme.name}
                      </span>
                    </div>
                    <div className="list-meta-row">
                      <span className="list-phone font-numeric">{formatIndianPhone(contact.phone)}</span>
                      {contact.email && <span className="list-email">• {contact.email}</span>}
                      {contact.city && <span className="list-city">• {contact.city}</span>}
                    </div>
                  </div>

                  <div className="list-actions" onClick={e => e.stopPropagation()}>
                    {contact.email && (
                      <button
                        className="list-icon-btn"
                        onClick={() => setActiveEmailContact(contact)}
                        title="Compose Email"
                      >
                        <FiMail />
                      </button>
                    )}

                    <button
                      className="list-icon-btn"
                      onClick={() => setActiveQRContact(contact)}
                      title="vCard QR"
                    >
                      <FiMaximize2 />
                    </button>

                    <button
                      className={`list-star-btn ${contact.isFavorite ? 'starred' : ''}`}
                      onClick={() => toggleFavorite(contact.id)}
                      aria-label={contact.isFavorite ? "Unstar" : "Star"}
                      title="Toggle Favorite"
                    >
                      <FiStar />
                    </button>

                    <a
                      href={`tel:+91${contact.phone.replace(/\D/g, '')}`}
                      className="list-call-btn"
                      title="Call"
                      aria-label="Call"
                    >
                      <FiPhone />
                    </a>

                    <FiChevronRight className="list-arrow" />
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <EmptyState
          iconType="search"
          title="No contacts match your filter"
          description={
            searchQuery || selectedGroup !== 'all' || selectedLetter
              ? "We couldn't find any contact matching your active search or filters."
              : "Your contact directory is currently empty."
          }
          actionText={
            searchQuery || selectedGroup !== 'all' || selectedLetter
              ? "Reset All Filters"
              : "Add New Contact"
          }
          onAction={
            searchQuery || selectedGroup !== 'all' || selectedLetter
              ? resetAllFilters
              : () => navigate('/add')
          }
        />
      )}
    </div>
  );
};
