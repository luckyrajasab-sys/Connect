import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { ContactCard } from '../../components/ContactCard/ContactCard';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { FiStar, FiSearch, FiX, FiList, FiGrid } from 'react-icons/fi';
import './Favorites.css';

export const Favorites = () => {
  const { contacts, reorderFavorites } = useContacts();
  const [favoriteSearch, setFavoriteSearch] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const navigate = useNavigate();

  const favoriteList = contacts.filter(c => c.isFavorite || c.favorite);

  const displayedFavorites = favoriteList.filter(c => {
    if (!favoriteSearch.trim()) return true;
    const q = favoriteSearch.toLowerCase().trim();
    return (
      (c.fullName || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.city || '').toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q)
    );
  });

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...favoriteList];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    reorderFavorites(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="favorites-page-container animate-fade-in">
      {/* Page Header */}
      <div className="favorites-header">
        <div className="fav-title-wrap">
          <div className="fav-star-icon">
            <FiStar />
          </div>
          <div>
            <h1 className="fav-main-title">
              Favorite Contacts <span className="title-count">({favoriteList.length})</span>
            </h1>
            <p className="fav-sub-title">
              Priority close circle with quick one-touch dial, WhatsApp, email, and customizable ordering
            </p>
          </div>
        </div>

        {/* Favorite Search input if has items */}
        {favoriteList.length > 0 && (
          <div className="fav-search-box">
            <FiSearch className="fav-search-icon" />
            <input
              type="text"
              className="fav-search-input"
              placeholder="Search favorites..."
              value={favoriteSearch}
              onChange={(e) => setFavoriteSearch(e.target.value)}
              aria-label="Search favorites"
            />
            {favoriteSearch && (
              <button
                className="fav-search-clear"
                onClick={() => setFavoriteSearch('')}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid of Starred Contacts with Drag and Drop Support */}
      {displayedFavorites.length > 0 ? (
        <div className="contacts-grid-layout">
          {displayedFavorites.map((contact, index) => (
            <div
              key={contact.id}
              className={`fav-draggable-wrapper ${draggedIndex === index ? 'is-dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <ContactCard contact={contact} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          iconType="star"
          title={favoriteList.length === 0 ? "No Favorite Contacts Yet" : "No Matching Favorites"}
          description={
            favoriteList.length === 0
              ? "Star your family, closest friends, and frequent contacts to access them quickly from this dashboard."
              : "No favorites matched your search criteria."
          }
          actionText={favoriteList.length === 0 ? "Browse All Contacts" : "Clear Search"}
          onAction={
            favoriteList.length === 0
              ? () => navigate('/contacts')
              : () => setFavoriteSearch('')
          }
        />
      )}
    </div>
  );
};
