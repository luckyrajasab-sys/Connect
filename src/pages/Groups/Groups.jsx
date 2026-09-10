import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { CATEGORIES } from '../../data/categories';
import { ContactCard } from '../../components/ContactCard/ContactCard';
import {
  FiGrid,
  FiPlus,
  FiUsers,
  FiArrowRight,
  FiCheck,
  FiTag,
  FiX
} from 'react-icons/fi';
import './Groups.css';

export const Groups = () => {
  const { contacts, groups, addGroup, setSelectedGroup } = useContacts();
  const navigate = useNavigate();

  const [selectedCatId, setSelectedCatId] = useState('all');
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#FF7722');

  const COLOR_OPTIONS = ['#FF7722', '#00E5FF', '#3B82F6', '#10B981', '#A855F7', '#EF4444', '#F59E0B', '#EC4899'];

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const created = addGroup({
      name: newGroupName.trim(),
      color: newGroupColor
    });

    if (created) {
      setNewGroupName('');
      setShowAddGroupModal(false);
    }
  };

  const displayedContacts = selectedCatId === 'all'
    ? contacts
    : contacts.filter(c => c.group === selectedCatId);

  return (
    <div className="groups-page-container animate-fade-in">
      {/* Header */}
      <div className="groups-header-row">
        <div className="groups-title-group">
          <div className="groups-icon-badge">
            <FiGrid />
          </div>
          <div>
            <h1 className="groups-main-title">Contact Categories & Groups</h1>
            <p className="groups-sub-title">Organize your network into specialized color-coded hubs</p>
          </div>
        </div>

        <button
          className="add-category-btn"
          onClick={() => setShowAddGroupModal(true)}
        >
          <FiPlus /> New Category
        </button>
      </div>

      {/* Category Cards Grid */}
      <div className="category-cards-grid">
        <div
          className={`category-summary-card ${selectedCatId === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCatId('all')}
        >
          <div className="cat-card-top">
            <div className="cat-card-badge bg-orange-glow">
              <FiUsers />
            </div>
            <span className="cat-card-count">{contacts.length}</span>
          </div>
          <h3 className="cat-card-name">All Directory</h3>
          <p className="cat-card-desc">Complete contact book</p>
        </div>

        {groups.map(grp => {
          const count = contacts.filter(c => c.group === grp.id).length;
          const isSelected = selectedCatId === grp.id;
          return (
            <div
              key={grp.id}
              className={`category-summary-card ${isSelected ? 'active' : ''}`}
              style={{ '--cat-color': grp.color }}
              onClick={() => setSelectedCatId(grp.id)}
            >
              <div className="cat-card-top">
                <div className="cat-card-badge" style={{ background: `${grp.color}22`, color: grp.color }}>
                  <span className="cat-bullet" style={{ background: grp.color }}></span>
                </div>
                <span className="cat-card-count">{count}</span>
              </div>
              <h3 className="cat-card-name">{grp.name}</h3>
              <p className="cat-card-desc">{count} stored {count === 1 ? 'contact' : 'contacts'}</p>
            </div>
          );
        })}
      </div>

      {/* Group Contacts Grid */}
      <div className="group-contacts-section">
        <div className="section-header-flex">
          <div>
            <h2 className="section-heading">
              {selectedCatId === 'all' ? 'All Contacts' : `${groups.find(g => g.id === selectedCatId)?.name || 'Category'} Contacts`}
              <span className="heading-count">({displayedContacts.length})</span>
            </h2>
            <p className="section-subtext">Showing contacts organized under this category</p>
          </div>

          <button
            className="browse-in-directory-link"
            onClick={() => {
              setSelectedGroup(selectedCatId);
              navigate('/contacts');
            }}
          >
            Open in Directory <FiArrowRight />
          </button>
        </div>

        {displayedContacts.length > 0 ? (
          <div className="contacts-grid-layout">
            {displayedContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <div className="category-empty-state">
            <p>No contacts currently assigned to this category.</p>
            <button className="add-to-cat-btn" onClick={() => navigate('/add')}>
              + Add Contact to this Group
            </button>
          </div>
        )}
      </div>

      {/* Add Custom Category Modal */}
      {showAddGroupModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddGroupModal(false)}>
          <div className="modal-container group-modal-card animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="group-modal-header">
              <h3 className="modal-title">Create Custom Category</h3>
              <button className="modal-close-btn" onClick={() => setShowAddGroupModal(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="group-modal-form">
              <div className="form-field">
                <label className="input-label">Category Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Cricket Club, Startup Investors, Doctors"
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="form-field">
                <label className="input-label">Theme Color Accent</label>
                <div className="color-swatches-row">
                  {COLOR_OPTIONS.map(col => (
                    <button
                      key={col}
                      type="button"
                      className={`color-swatch-btn ${newGroupColor === col ? 'active' : ''}`}
                      style={{ background: col }}
                      onClick={() => setNewGroupColor(col)}
                    >
                      {newGroupColor === col && <FiCheck />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="modal-btn btn-secondary"
                  onClick={() => setShowAddGroupModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn btn-primary"
                  disabled={!newGroupName.trim()}
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
