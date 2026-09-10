import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { calculateCompleteness } from '../../utils/completeness';
import {
  FiBarChart2,
  FiUsers,
  FiStar,
  FiAlertTriangle,
  FiMail,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiGlobe,
  FiTag
} from 'react-icons/fi';
import './Analytics.css';

export const Analytics = () => {
  const { contacts, stats, groups, personalEmergency } = useContacts();
  const navigate = useNavigate();

  const [activeCategoryHover, setActiveCategoryHover] = useState(null);

  // 1. Contacts by Category computation
  const categoryData = groups.map(grp => {
    const count = contacts.filter(c => c.group === grp.id).length;
    return {
      name: grp.name,
      id: grp.id,
      color: grp.color,
      count,
      percent: stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
    };
  }).filter(c => c.count > 0);

  // 2. Contacts by City (Top 6)
  const cityCounts = {};
  contacts.forEach(c => {
    const city = c.city ? c.city.trim() : 'Unknown';
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });
  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // 3. Contacts with key attributes
  const withPhone = contacts.filter(c => c.phone).length;
  const withEmail = contacts.filter(c => c.email).length;
  const withAddress = contacts.filter(c => c.address || c.city).length;
  const withWebsite = contacts.filter(c => c.website).length;
  const withNotes = contacts.filter(c => c.notes).length;

  // 4. Completeness distribution tiers
  const tiers = { full: 0, high: 0, medium: 0, low: 0 };
  contacts.forEach(c => {
    const score = calculateCompleteness(c).score;
    if (score === 100) tiers.full++;
    else if (score >= 70) tiers.high++;
    else if (score >= 40) tiers.medium++;
    else tiers.low++;
  });

  // Calculate SVG Donut paths
  let cumulativePercent = 0;
  const donutSlices = categoryData.map(cat => {
    const startAngle = (cumulativePercent / 100) * 360;
    cumulativePercent += cat.percent;
    const endAngle = (cumulativePercent / 100) * 360;

    // Convert polar coordinates to Cartesian
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 100 + 70 * Math.cos(startRad);
    const y1 = 100 + 70 * Math.sin(startRad);
    const x2 = 100 + 70 * Math.cos(endRad);
    const y2 = 100 + 70 * Math.sin(endRad);

    const largeArcFlag = cat.percent > 50 ? 1 : 0;
    const pathData = `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return { ...cat, pathData };
  });

  return (
    <div className="analytics-page-container animate-fade-in">
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-title-group">
          <div className="analytics-icon-badge">
            <FiBarChart2 />
          </div>
          <div>
            <h1 className="analytics-main-title">Contact Directory Analytics</h1>
            <p className="analytics-sub-title">Visual telemetry, category distribution, and profile health scores</p>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card bg-kpi-orange">
          <div className="kpi-icon-wrap"><FiUsers /></div>
          <div className="kpi-data">
            <span className="kpi-num">{stats.total}</span>
            <span className="kpi-label">Total Contacts</span>
          </div>
          <span className="kpi-meta">{stats.addedThisMonth} Added This Month</span>
        </div>

        <div className="kpi-card bg-kpi-amber">
          <div className="kpi-icon-wrap"><FiStar /></div>
          <div className="kpi-data">
            <span className="kpi-num">{stats.favorites}</span>
            <span className="kpi-label">Starred Favorites</span>
          </div>
          <span className="kpi-meta">{stats.total > 0 ? Math.round((stats.favorites / stats.total) * 100) : 0}% of Total</span>
        </div>

        <div className="kpi-card bg-kpi-red">
          <div className="kpi-icon-wrap"><FiAlertTriangle /></div>
          <div className="kpi-data">
            <span className="kpi-num">{stats.emergency}</span>
            <span className="kpi-label">Emergency Contacts</span>
          </div>
          <span className="kpi-meta">112 Universal SOS</span>
        </div>

        <div className="kpi-card bg-kpi-cyan">
          <div className="kpi-icon-wrap"><FiCheckCircle /></div>
          <div className="kpi-data">
            <span className="kpi-num">{stats.avgCompleteness}%</span>
            <span className="kpi-label">Avg Completeness</span>
          </div>
          <span className="kpi-meta">Health Quality Score</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="analytics-charts-grid">
        {/* CHART 1: Donut Chart (Contacts by Category) */}
        <div className="chart-panel-card">
          <div className="chart-panel-header">
            <h3 className="chart-panel-title">Contacts by Category</h3>
            <span className="chart-panel-badge">Distribution</span>
          </div>

          <div className="donut-chart-wrapper">
            <div className="donut-svg-container">
              <svg viewBox="0 0 200 200" className="donut-svg">
                {donutSlices.map(slice => (
                  <path
                    key={slice.id}
                    d={slice.pathData}
                    fill={slice.color}
                    opacity={activeCategoryHover && activeCategoryHover !== slice.id ? 0.4 : 0.9}
                    stroke="var(--bg-surface-solid)"
                    strokeWidth="2"
                    onMouseEnter={() => setActiveCategoryHover(slice.id)}
                    onMouseLeave={() => setActiveCategoryHover(null)}
                    className="donut-slice-path"
                  />
                ))}
                {/* Donut Center Cutout */}
                <circle cx="100" cy="100" r="46" fill="var(--bg-surface-solid)" />
                <text x="100" y="96" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="800">
                  {stats.total}
                </text>
                <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontWeight="600">
                  TOTAL
                </text>
              </svg>
            </div>

            <div className="donut-legend-list">
              {categoryData.map(cat => (
                <div
                  key={cat.id}
                  className={`donut-legend-row ${activeCategoryHover === cat.id ? 'active' : ''}`}
                  onMouseEnter={() => setActiveCategoryHover(cat.id)}
                  onMouseLeave={() => setActiveCategoryHover(null)}
                >
                  <span className="legend-swatch" style={{ background: cat.color }}></span>
                  <span className="legend-text">{cat.name}</span>
                  <span className="legend-count">{cat.count} ({cat.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 2: Contacts by City Bar Chart */}
        <div className="chart-panel-card">
          <div className="chart-panel-header">
            <h3 className="chart-panel-title">Top Locations & Cities</h3>
            <span className="chart-panel-badge">Geographic</span>
          </div>

          <div className="city-bars-container">
            {topCities.map(([city, count]) => {
              const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={city} className="city-bar-row">
                  <div className="city-info-row">
                    <span className="city-name"><FiMapPin className="city-pin" /> {city}</span>
                    <span className="city-count">{count} ({percent}%)</span>
                  </div>
                  <div className="city-bar-track">
                    <div
                      className="city-bar-fill"
                      style={{ width: `${percent * 1.8}%`, background: 'linear-gradient(90deg, #00E5FF, #0284C7)' }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 3: Information Completeness Comparison Multi-Bar */}
        <div className="chart-panel-card">
          <div className="chart-panel-header">
            <h3 className="chart-panel-title">Field Availability</h3>
            <span className="chart-panel-badge">Completeness</span>
          </div>

          <div className="field-comparison-container">
            {[
              { label: 'Mobile Phone', count: withPhone, color: '#FF7722' },
              { label: 'Email Address', count: withEmail, color: '#00E5FF' },
              { label: 'Physical Address', count: withAddress, color: '#10B981' },
              { label: 'Website / Links', count: withWebsite, color: '#A855F7' },
              { label: 'Notes & Dossier', count: withNotes, color: '#F59E0B' }
            ].map(item => {
              const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
              return (
                <div key={item.label} className="field-bar-item">
                  <div className="field-meta">
                    <span className="field-label">{item.label}</span>
                    <span className="field-pct">{pct}%</span>
                  </div>
                  <div className="field-track">
                    <div
                      className="field-fill"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 4: Profile Completeness Distribution Tiers */}
        <div className="chart-panel-card">
          <div className="chart-panel-header">
            <h3 className="chart-panel-title">Profile Quality Breakdown</h3>
            <span className="chart-panel-badge">Tiers</span>
          </div>

          <div className="quality-tiers-grid">
            <div className="quality-tier-box tier-perfect">
              <span className="tier-count">{tiers.full}</span>
              <span className="tier-label">100% Complete</span>
              <span className="tier-desc">All fields filled</span>
            </div>

            <div className="quality-tier-box tier-high">
              <span className="tier-count">{tiers.high}</span>
              <span className="tier-label">70-99% Complete</span>
              <span className="tier-desc">Strong profiles</span>
            </div>

            <div className="quality-tier-box tier-med">
              <span className="tier-count">{tiers.medium}</span>
              <span className="tier-label">40-69% Complete</span>
              <span className="tier-desc">Basic info</span>
            </div>

            <div className="quality-tier-box tier-low">
              <span className="tier-count">{tiers.low}</span>
              <span className="tier-label">&lt;40% Complete</span>
              <span className="tier-desc">Needs update</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
