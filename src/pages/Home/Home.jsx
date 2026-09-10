import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { ContactCard } from '../../components/ContactCard/ContactCard';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { formatIndianPhone } from '../../utils/validation';
import { getInitials } from '../../utils/avatarHelper';
import { calculateCompleteness } from '../../utils/completeness';
import {
  FiUsers,
  FiUser,
  FiStar,
  FiAlertTriangle,
  FiUserPlus,
  FiSearch,
  FiArrowRight,
  FiShield,
  FiDownload,
  FiMaximize2,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiPhoneCall,
  FiMail,
  FiMapPin,
  FiLayers
} from 'react-icons/fi';
import './Home.css';

export const Home = () => {
  const {
    currentUser,
    contacts,
    stats,
    personalEmergency,
    groups,
    exportContactsJSON,
    reorderFavorites,
    setActiveQRContact,
    setActiveEmailContact
  } = useContacts();

  const navigate = useNavigate();

  // Drag and drop state for favorites
  const [draggedIndex, setDraggedIndex] = useState(null);

  const favoriteContacts = contacts.filter(c => c.isFavorite);
  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  // Category counts for visual distribution bar
  const categoryCounts = groups.map(grp => {
    const count = contacts.filter(c => c.group === grp.id).length;
    return { ...grp, count };
  }).filter(g => g.count > 0);

  // Field completeness calculations
  const phonePercent = stats.total > 0 ? Math.round((stats.withPhone / stats.total) * 100) : 0;
  const emailPercent = stats.total > 0 ? Math.round((stats.withEmail / stats.total) * 100) : 0;
  const addressPercent = stats.total > 0 ? Math.round((stats.withAddress / stats.total) * 100) : 0;

  // Drag-and-drop handlers for favorites
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...favoriteContacts];
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
    <div className="home-page-container animate-fade-in">
      {/* Welcome Hero Banner */}
      <section className="home-hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            {currentUser ? (
              <span>Synced with {currentUser.email}</span>
            ) : (
              <span>Smart Offline Directory</span>
            )}
          </div>
          <h1 className="hero-title">
            {currentUser ? `Welcome back, ${currentUser.name}` : <>Your <span className="highlight-text">Connect Hub</span></>}
          </h1>
          <p className="hero-subtitle">
            Smart personal contact directory with real-time cloud synchronization, interactive dossier details, vCard QR sharing, and location mapping.
          </p>

          <div className="hero-cta-row">
            <button className="hero-btn primary-hero-btn" onClick={() => navigate('/add')}>
              <FiUserPlus /> Add Contact
            </button>
            <button className="hero-btn secondary-hero-btn" onClick={() => navigate('/qr')}>
              <FiMaximize2 /> Scan / Share QR
            </button>
            <button className="hero-btn tertiary-hero-btn" onClick={() => navigate('/profile')}>
              <FiUser /> Manage Profile &amp; Sync
            </button>
          </div>
        </div>
      </section>

      {/* Primary Metrics Grid */}
      <section className="metrics-grid">
        <div className="metric-card" onClick={() => navigate('/contacts')}>
          <div className="metric-icon-wrap bg-saffron">
            <FiUsers />
          </div>
          <div className="metric-data">
            <span className="metric-num">{stats.total}</span>
            <span className="metric-label">Total Directory</span>
          </div>
          <span className="metric-sub">{stats.addedThisMonth} added this month</span>
        </div>

        <div className="metric-card" onClick={() => navigate('/favorites')}>
          <div className="metric-icon-wrap bg-amber">
            <FiStar />
          </div>
          <div className="metric-data">
            <span className="metric-num">{stats.favorites}</span>
            <span className="metric-label">Quick Favorites</span>
          </div>
          <span className="metric-sub">Fast one-tap dialing</span>
        </div>

        <div className="metric-card" onClick={() => navigate('/emergency')}>
          <div className="metric-icon-wrap bg-red">
            <FiAlertTriangle />
          </div>
          <div className="metric-data">
            <span className="metric-num">{stats.emergency}</span>
            <span className="metric-label">Emergency Helplines</span>
          </div>
          <span className="metric-sub">112 ERSS Standby</span>
        </div>

        <div className="metric-card" onClick={() => navigate('/analytics')}>
          <div className="metric-icon-wrap bg-cyan">
            <FiBarChart2 />
          </div>
          <div className="metric-data">
            <span className="metric-num">{stats.avgCompleteness}%</span>
            <span className="metric-label">Avg Completeness</span>
          </div>
          <span className="metric-sub">Profile health score</span>
        </div>
      </section>

      {/* DASHBOARD PROGRESS BARS & STATUS */}
      <section className="dashboard-bars-section">
        {/* Contact Completeness Breakdown Bar */}
        <div className="dashboard-bar-card">
          <div className="bar-card-header">
            <div className="bar-title-group">
              <FiCheckCircle className="bar-header-svg text-emerald" />
              <h3 className="bar-card-title">Information Completeness</h3>
            </div>
            <span className="bar-summary-badge">{stats.total} Contacts Analyzed</span>
          </div>

          <div className="completeness-bar-items">
            <div className="bar-item-row">
              <div className="bar-item-info">
                <span className="bar-item-name"><FiPhoneCall className="mini-icon" /> Phone Numbers</span>
                <span className="bar-item-val">{phonePercent}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill bg-orange-gradient" style={{ width: `${phonePercent}%` }}></div>
              </div>
            </div>

            <div className="bar-item-row">
              <div className="bar-item-info">
                <span className="bar-item-name"><FiMail className="mini-icon" /> Email Addresses</span>
                <span className="bar-item-val">{emailPercent}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill bg-cyan-gradient" style={{ width: `${emailPercent}%` }}></div>
              </div>
            </div>

            <div className="bar-item-row">
              <div className="bar-item-info">
                <span className="bar-item-name"><FiMapPin className="mini-icon" /> Physical Addresses</span>
                <span className="bar-item-val">{addressPercent}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill bg-purple-gradient" style={{ width: `${addressPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution Bar */}
        <div className="dashboard-bar-card">
          <div className="bar-card-header">
            <div className="bar-title-group">
              <FiLayers className="bar-header-svg text-saffron" />
              <h3 className="bar-card-title">Category Distribution</h3>
            </div>
            <button className="view-all-link-btn" onClick={() => navigate('/groups')}>
              View All Groups <FiArrowRight />
            </button>
          </div>

          {categoryCounts.length > 0 ? (
            <div className="category-multi-bar-wrapper">
              <div className="multi-segmented-bar">
                {categoryCounts.map(cat => {
                  const percent = Math.max(4, Math.round((cat.count / stats.total) * 100));
                  return (
                    <div
                      key={cat.id}
                      className="segment-slice"
                      style={{ width: `${percent}%`, background: cat.color }}
                      title={`${cat.name}: ${cat.count} contacts (${percent}%)`}
                    ></div>
                  );
                })}
              </div>

              <div className="category-legend-grid">
                {categoryCounts.map(cat => (
                  <div key={cat.id} className="cat-legend-item">
                    <span className="legend-dot" style={{ background: cat.color }}></span>
                    <span className="legend-name">{cat.name}</span>
                    <span className="legend-count">({cat.count})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-bar-msg">No categorized contacts yet.</div>
          )}
        </div>
      </section>

      {/* QUICK DIAL FAVORITES CAROUSEL (WITH DRAG & DROP REORDERING) */}
      {favoriteContacts.length > 0 && (
        <section className="fast-dial-section">
          <div className="section-header-flex">
            <div>
              <h2 className="section-heading">
                <FiStar className="heading-svg-icon text-amber" /> Quick Dial Favorites
              </h2>
              <p className="section-subtext">Instant one-tap call & QR share • Drag to reorder</p>
            </div>
            <button
              className="view-all-link"
              onClick={() => navigate('/favorites')}
            >
              View All ({favoriteContacts.length}) <FiArrowRight />
            </button>
          </div>

          <div className="fast-dial-scroll">
            {favoriteContacts.map((contact, index) => (
              <div
                key={contact.id}
                className={`fast-dial-item ${draggedIndex === index ? 'is-dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => navigate(`/contacts/${contact.id}`)}
              >
                <div
                  className="fast-dial-avatar"
                  style={{ background: contact.avatarBg || 'linear-gradient(135deg, #FF7722, #EA580C)' }}
                >
                  <span>{getInitials(contact.fullName)}</span>
                </div>
                <span className="fast-dial-name">{contact.fullName.split(' ')[0]}</span>
                <span className="fast-dial-phone font-numeric">{formatIndianPhone(contact.phone)}</span>

                {/* Quick actions on favorite pill */}
                <div className="fast-dial-quick-actions" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`tel:+91${contact.phone.replace(/\D/g, '')}`}
                    className="quick-icon-btn call"
                    title="Direct Call"
                  >
                    <FiPhoneCall />
                  </a>
                  {contact.email && (
                    <button
                      className="quick-icon-btn email"
                      onClick={() => setActiveEmailContact(contact)}
                      title="Quick Email"
                    >
                      <FiMail />
                    </button>
                  )}
                  <button
                    className="quick-icon-btn qr"
                    onClick={() => setActiveQRContact(contact)}
                    title="QR vCard"
                  >
                    <FiMaximize2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Added Contacts */}
      <section className="recent-contacts-section">
        <div className="section-header-flex">
          <div>
            <h2 className="section-heading">
              <FiClock className="heading-svg-icon text-saffron" /> Recently Added
            </h2>
            <p className="section-subtext">Latest phone numbers stored in your vault</p>
          </div>
          <button
            className="view-all-link"
            onClick={() => navigate('/contacts')}
          >
            All Contacts ({contacts.length}) <FiArrowRight />
          </button>
        </div>

        {recentContacts.length > 0 ? (
          <div className="contacts-grid-layout">
            {recentContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <EmptyState
            iconType="users"
            title="No contacts added yet"
            description="Start building your personal directory by adding a new contact or importing from vCard / CSV."
            actionText="Add New Contact"
            onAction={() => navigate('/add')}
          />
        )}
      </section>
    </div>
  );
};
