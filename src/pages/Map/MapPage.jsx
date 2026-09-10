import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { getInitials } from '../../utils/avatarHelper';
import { getCoordinatesForContact } from '../../utils/geocoding';
import { formatIndianPhone } from '../../utils/validation';
import { getCategoryTheme, CATEGORIES } from '../../data/categories';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FiMapPin,
  FiSearch,
  FiPhone,
  FiExternalLink,
  FiStar,
  FiFilter,
  FiCompass,
  FiX
} from 'react-icons/fi';
import './MapPage.css';

export const MapPage = () => {
  const { contacts, theme } = useContacts();
  const navigate = useNavigate();

  const [mapSearch, setMapSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Contacts with location info
  const locatedContacts = contacts.filter(c => Boolean(c.city || c.address || c.state));

  const filteredLocated = locatedContacts.filter(c => {
    if (activeCategory !== 'all') {
      if (activeCategory === 'favorites' && !c.isFavorite) return false;
      if (activeCategory === 'emergency' && !c.isEmergency && c.group !== 'emergency') return false;
      if (activeCategory !== 'favorites' && activeCategory !== 'emergency' && c.group !== activeCategory) return false;
    }
    if (mapSearch.trim()) {
      const q = mapSearch.toLowerCase();
      const matchName = (c.fullName || '').toLowerCase().includes(q);
      const matchCity = (c.city || '').toLowerCase().includes(q);
      const matchState = (c.state || '').toLowerCase().includes(q);
      const matchAddress = (c.address || '').toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchState && !matchAddress) return false;
    }
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map centered on India (20.5937, 78.9629)
      const map = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Tile layer (Dark / Light based on theme)
      const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      // Update tile layer on theme switch
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      L.tileLayer(tileUrl, {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [theme]);

  // Update Markers when filtered list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const bounds = [];

    filteredLocated.forEach((contact, index) => {
      const coords = getCoordinatesForContact(contact, index);
      bounds.push(coords);

      const catTheme = getCategoryTheme(contact.group);
      const initials = getInitials(contact.fullName);

      // Create custom HTML avatar pin marker
      const customIcon = L.divIcon({
        className: 'leaflet-custom-marker',
        html: `
          <div class="map-marker-pin" style="border-color: ${catTheme.color}; box-shadow: 0 0 14px ${catTheme.glow}">
            <div class="map-marker-avatar" style="background: ${contact.avatarBg || catTheme.gradient}">
              <span>${initials}</span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedContact(contact);
        map.flyTo(coords, 12, { animate: true, duration: 1 });
      });

      markersRef.current.push(marker);
    });

    if (bounds.length > 0 && !selectedContact) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [filteredLocated]);

  const handleSelectMarkerFromSidebar = (contact) => {
    setSelectedContact(contact);
    const coords = getCoordinatesForContact(contact);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 13, { animate: true, duration: 1.2 });
    }
  };

  return (
    <div className="map-page-layout animate-fade-in">
      {/* Sidebar List & Filters */}
      <div className="map-sidebar-panel">
        <div className="map-sidebar-header">
          <div className="map-title-row">
            <FiMapPin className="map-lead-svg" />
            <div>
              <h2 className="map-page-title">Contact Locations</h2>
              <span className="map-count-badge">{filteredLocated.length} mapped contacts</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="map-search-input-wrap">
            <FiSearch className="map-search-icon" />
            <input
              type="text"
              className="map-search-field"
              placeholder="Search by city, state, or name..."
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
            />
            {mapSearch && (
              <button className="map-search-clear" onClick={() => setMapSearch('')}>
                <FiX />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="map-filter-pills">
            <button
              className={`map-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            <button
              className={`map-pill ${activeCategory === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveCategory('favorites')}
            >
              <FiStar className="text-amber" /> Starred
            </button>
            {CATEGORIES.slice(0, 5).map(cat => (
              <button
                key={cat.id}
                className={`map-pill ${activeCategory === cat.id ? 'active' : ''}`}
                style={{ '--cat-color': cat.color }}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="pill-dot" style={{ background: cat.color }}></span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* List of Contacts */}
        <div className="map-contacts-list-scroll">
          {filteredLocated.map(contact => {
            const isSelected = selectedContact?.id === contact.id;
            const catTheme = getCategoryTheme(contact.group);
            return (
              <div
                key={contact.id}
                className={`map-contact-list-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectMarkerFromSidebar(contact)}
              >
                <div
                  className="map-item-avatar"
                  style={{ background: contact.avatarBg || catTheme.gradient }}
                >
                  <span>{getInitials(contact.fullName)}</span>
                </div>
                <div className="map-item-meta">
                  <span className="map-item-name">{contact.fullName}</span>
                  <span className="map-item-location">
                    <FiMapPin className="mini-pin" /> {[contact.city, contact.state].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredLocated.length === 0 && (
            <div className="map-empty-msg">
              <p>No contacts with matching addresses found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Map Viewport */}
      <div className="map-viewport-wrapper">
        <div ref={mapContainerRef} className="leaflet-full-map-container" />

        {/* Selected Contact Popover Drawer */}
        {selectedContact && (
          <div className="map-selected-popover animate-slide-up">
            <button
              className="popover-close-btn"
              onClick={() => setSelectedContact(null)}
              aria-label="Close details"
            >
              <FiX />
            </button>

            <div className="popover-content">
              <div
                className="popover-avatar"
                style={{ background: selectedContact.avatarBg || 'linear-gradient(135deg, #FF7722, #EA580C)' }}
              >
                <span>{getInitials(selectedContact.fullName)}</span>
              </div>
              <div className="popover-meta">
                <h3 className="popover-name">{selectedContact.fullName}</h3>
                <span className="popover-address">
                  <FiMapPin className="pin-svg" />
                  {[selectedContact.address, selectedContact.city, selectedContact.state].filter(Boolean).join(', ') || 'Location On Map'}
                </span>
                <span className="popover-phone font-numeric">{formatIndianPhone(selectedContact.phone)}</span>
              </div>
            </div>

            <div className="popover-actions">
              <a
                href={`tel:+91${selectedContact.phone.replace(/\D/g, '')}`}
                className="popover-btn call-btn"
              >
                <FiPhone /> Call Now
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([selectedContact.address, selectedContact.city, selectedContact.state, 'India'].filter(Boolean).join(', '))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="popover-btn nav-btn"
              >
                <FiCompass /> Directions <FiExternalLink />
              </a>
              <button
                className="popover-btn dossier-btn"
                onClick={() => navigate(`/contacts/${selectedContact.id}`)}
              >
                View Full Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
