import React from 'react';
import { useContacts } from '../../context/ContactContext';
import {
  FiSearch,
  FiX,
  FiStar,
  FiClock,
  FiSliders,
  FiPhone,
  FiMail,
  FiMapPin,
  FiShield
} from 'react-icons/fi';
import './SearchBar.css';

const SORT_OPTIONS = [
  { id: 'favorites', label: 'Starred Favorites First' },
  { id: 'name-asc', label: 'Name (A to Z)' },
  { id: 'name-desc', label: 'Name (Z to A)' },
  { id: 'recent', label: 'Recently Added' },
  { id: 'updated', label: 'Recently Updated' },
  { id: 'most-contacted', label: 'Most Contacted' },
  { id: 'category', label: 'Group / Category' },
  { id: 'city', label: 'City / Location' }
];

export const SearchBar = ({ showFilters = true, showSort = true }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    selectedGroup,
    setSelectedGroup,
    selectedSort,
    setSelectedSort,
    allTags,
    selectedTags,
    setSelectedTags,
    groups
  } = useContacts();

  const handleClear = () => {
    setSearchQuery('');
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="search-and-filter-hub">
      {/* Top Search & Sort Row */}
      <div className="search-top-row">
        <div className="search-input-box">
          <FiSearch className="search-lead-icon" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by name, phone, email, city, company, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search contacts"
          />
          {searchQuery && (
            <button
              className="search-clear-action"
              onClick={handleClear}
              aria-label="Clear search input"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        {showSort && (
          <div className="sort-selector-wrap">
            <span className="sort-icon-label"><FiSliders /></span>
            <select
              className="sort-select-dropdown"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              aria-label="Sort contacts by"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {showFilters && (
        <div className="filter-controls-area">
          {/* Category Quick Tabs */}
          <div className="category-scroll-bar">
            <button
              className={`cat-tab-btn ${selectedGroup === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedGroup('all')}
            >
              All Categories
            </button>
            {groups.map(grp => (
              <button
                key={grp.id}
                className={`cat-tab-btn ${selectedGroup === grp.id ? 'active' : ''}`}
                style={{ '--cat-accent': grp.color }}
                onClick={() => setSelectedGroup(grp.id)}
              >
                <span className="cat-dot" style={{ background: grp.color }}></span>
                <span>{grp.name}</span>
              </button>
            ))}
          </div>

          {/* Smart Attribute Filter Toggles */}
          <div className="attribute-filters-row">
            <button
              className={`attr-filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All
            </button>
            <button
              className={`attr-filter-btn ${selectedFilter === 'favorites' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('favorites')}
            >
              <FiStar className="btn-svg text-amber" /> Starred
            </button>
            <button
              className={`attr-filter-btn ${selectedFilter === 'vip' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('vip')}
            >
              <FiShield className="btn-svg text-purple" /> VIP
            </button>
            <button
              className={`attr-filter-btn ${selectedFilter === 'hasPhone' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('hasPhone')}
            >
              <FiPhone className="btn-svg" /> Has Phone
            </button>
            <button
              className={`attr-filter-btn ${selectedFilter === 'hasEmail' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('hasEmail')}
            >
              <FiMail className="btn-svg" /> Has Email
            </button>
            <button
              className={`attr-filter-btn ${selectedFilter === 'hasAddress' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('hasAddress')}
            >
              <FiMapPin className="btn-svg" /> Has Address
            </button>
            <button
              className={`attr-filter-btn ${selectedFilter === 'recent' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('recent')}
            >
              <FiClock className="btn-svg" /> Recent
            </button>
          </div>

          {/* Tag Cloud Filter */}
          {allTags.length > 0 && (
            <div className="tags-filter-bar">
              <span className="tag-filter-title">Filter by Tag:</span>
              <div className="tag-cloud">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-filter-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button className="tag-clear-btn" onClick={() => setSelectedTags([])}>
                    Clear Tags
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
