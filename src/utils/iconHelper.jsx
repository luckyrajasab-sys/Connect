import React from 'react';
import {
  FiUsers,
  FiUserCheck,
  FiBriefcase,
  FiBookOpen,
  FiAlertTriangle,
  FiShield,
  FiActivity,
  FiHeart,
  FiUser,
  FiLock,
  FiTag,
  FiAlertCircle,
  FiPlusSquare
} from 'react-icons/fi';

export const getGroupIcon = (type = '') => {
  switch (type.toLowerCase()) {
    case 'family':
      return <FiUsers className="group-svg-icon text-saffron" />;
    case 'friends':
      return <FiUserCheck className="group-svg-icon text-blue" />;
    case 'work':
      return <FiBriefcase className="group-svg-icon text-emerald" />;
    case 'college':
      return <FiBookOpen className="group-svg-icon text-purple" />;
    case 'emergency':
      return <FiAlertTriangle className="group-svg-icon text-red" />;
    default:
      return <FiTag className="group-svg-icon text-muted" />;
  }
};

export const getEmergencyIcon = (type = '') => {
  switch (type.toLowerCase()) {
    case 'emergency':
      return <FiAlertCircle className="emergency-svg-icon" />;
    case 'police':
      return <FiShield className="emergency-svg-icon" />;
    case 'fire':
      return <FiAlertTriangle className="emergency-svg-icon" />;
    case 'ambulance':
      return <FiActivity className="emergency-svg-icon" />;
    case 'hospital':
      return <FiPlusSquare className="emergency-svg-icon" />;
    case 'women':
      return <FiHeart className="emergency-svg-icon" />;
    case 'child':
      return <FiUser className="emergency-svg-icon" />;
    case 'cyber':
      return <FiLock className="emergency-svg-icon" />;
    default:
      return <FiAlertTriangle className="emergency-svg-icon" />;
  }
};
