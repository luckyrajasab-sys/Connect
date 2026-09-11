import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  // Modern Dark Glassmorphism Design Tokens matching the web app
  const colors = {
    primary: '#10B981', // Emerald theme
    primaryDark: '#059669',
    primaryLight: '#34D399',
    primaryGlow: 'rgba(16, 185, 129, 0.25)',
    
    // Backgrounds
    background: '#0B0F19',
    surface: '#111827',
    surfaceSubtle: '#1F2937',
    surfaceElevated: '#1A2234',
    
    // Glassmorphism
    glassBg: 'rgba(17, 24, 39, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassHighlight: 'rgba(255, 255, 255, 0.14)',
    glassCard: 'rgba(31, 41, 55, 0.5)',
    
    // Typography
    text: '#F9FAFB',
    textMuted: '#9CA3AF',
    textDim: '#6B7280',
    
    // Accents & Badges
    accentBlue: '#3B82F6',
    accentPurple: '#A855F7',
    accentAmber: '#F59E0B',
    accentRed: '#EF4444',
    accentCyan: '#00E5FF',
    accentOrange: '#FF7722',
    
    // Borders
    border: 'rgba(255, 255, 255, 0.08)',
    borderActive: '#10B981',
    divider: '#1F2937'
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
