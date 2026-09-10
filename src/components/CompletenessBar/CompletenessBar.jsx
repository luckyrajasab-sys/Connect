import React from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateCompleteness, getCompletenessColor } from '../../utils/completeness';
import { FiCheckCircle, FiAlertCircle, FiEdit } from 'react-icons/fi';
import './CompletenessBar.css';

export const CompletenessBar = ({ contact, showDetails = true, showEditButton = true }) => {
  const navigate = useNavigate();
  if (!contact) return null;

  const { score, missing, filled } = calculateCompleteness(contact);
  const color = getCompletenessColor(score);

  return (
    <div className="completeness-widget">
      <div className="completeness-header">
        <div className="score-label-group">
          <span className="completeness-title">Profile Completeness</span>
          <span className="completeness-percentage" style={{ color }}>{score}%</span>
        </div>
        {showEditButton && score < 100 && (
          <button
            className="complete-profile-pill-btn"
            onClick={() => navigate(`/edit/${contact.id}`)}
            title="Complete missing fields"
          >
            <FiEdit /> Complete Profile
          </button>
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="completeness-track">
        <div
          className="completeness-fill"
          style={{ width: `${score}%`, backgroundColor: color }}
        ></div>
      </div>

      {/* Missing / Filled Breakdown */}
      {showDetails && (
        <div className="completeness-breakdown">
          {missing.length > 0 ? (
            <div className="missing-list">
              <span className="missing-label"><FiAlertCircle /> Missing:</span>
              <div className="missing-chips">
                {missing.slice(0, 4).map((m, idx) => (
                  <span key={idx} className="missing-chip">{m}</span>
                ))}
                {missing.length > 4 && <span className="missing-chip">+{missing.length - 4} more</span>}
              </div>
            </div>
          ) : (
            <div className="complete-banner">
              <FiCheckCircle className="check-icon" />
              <span>Full 100% Profile Complete!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
