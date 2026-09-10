import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CATEGORIES } from '../data/categories';
import { getAvatarGradient } from '../utils/avatarHelper';
import { generateVCardString, parseVCardString, exportToCSV, parseCSVString } from '../utils/vcard';
import { calculateCompleteness } from '../utils/completeness';
import { triggerGoogleOAuth, triggerAppleOAuth } from '../utils/oauthHelper';
import { dbClient } from '../services/dbClient';

const ContactContext = createContext();

const STORAGE_KEYS = {
  AUTH_SESSION: 'connect_auth_session_v6',
  THEME_MODE: 'connect_theme_mode_v6',
  ACCENT_COLOR: 'connect_accent_color_v6',
  DEFAULT_SORT: 'connect_default_sort_v6',
  CARD_STYLE: 'connect_card_style_v6',
  PRIVACY_SETTINGS: 'connect_privacy_v6'
};

export const ContactProvider = ({ children }) => {
  // --- Appearance & Centralized Theme Engine ---
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [themeMode, setThemeModeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME_MODE) || 'system';
    } catch (e) {
      return 'system';
    }
  });

  const [accentColor, setAccentColorState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR) || 'emerald';
    } catch (e) {
      return 'emerald';
    }
  });

  const [systemIsDark, setSystemIsDark] = useState(() => getSystemTheme() === 'dark');

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemIsDark(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const theme = useMemo(() => {
    if (themeMode === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return themeMode === 'dark' ? 'dark' : 'light';
  }, [themeMode, systemIsDark]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-accent', accentColor);
      document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode);
    } catch (e) {}
  }, [theme, themeMode, accentColor]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, accentColor);
    } catch (e) {}
  }, [accentColor]);

  const setThemeMode = (mode) => {
    setThemeModeState(mode);
  };

  const toggleTheme = () => {
    setThemeModeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setAccentColor = (color) => {
    setAccentColorState(color);
  };

  // --- Real Authentication State ---
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Authenticating session...');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && parsed.email) return parsed;
      }
    } catch (e) {}
    return null;
  });

  // Persist Current Session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      }
    } catch (e) {}
  }, [currentUser]);

  // --- User-Isolated Contacts State (Cloud DB Backed) ---
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [personalEmergency, setPersonalEmergency] = useState([]);

  // Toast System
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Groups / Categories State
  const [groups, setGroups] = useState(CATEGORIES);

  // Sorting and Layout Preferences
  const [defaultSort, setDefaultSortState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DEFAULT_SORT) || 'favorites';
    } catch (e) {
      return 'favorites';
    }
  });

  const setDefaultSort = (sort) => {
    setDefaultSortState(sort);
    try {
      localStorage.setItem(STORAGE_KEYS.DEFAULT_SORT, sort);
    } catch (e) {}
  };

  const [defaultCardStyle, setDefaultCardStyleState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CARD_STYLE) || 'standard';
    } catch (e) {
      return 'standard';
    }
  });

  const setDefaultCardStyle = (style) => {
    setDefaultCardStyleState(style);
    try {
      localStorage.setItem(STORAGE_KEYS.CARD_STYLE, style);
    } catch (e) {}
  };

  const [privacySettings, setPrivacySettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRIVACY_SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      autoBackup: true,
      maskPhone: false,
      cloudSync: true,
      analyticsConsent: true
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRIVACY_SETTINGS, JSON.stringify(privacySettings));
    } catch (e) {}
  }, [privacySettings]);

  // Modal / Interaction States
  const [activePreviewContact, setActivePreviewContact] = useState(null);
  const [activeEmailContact, setActiveEmailContact] = useState(null);
  const [activeQRContact, setActiveQRContact] = useState(null);
  const [activeShareContact, setActiveShareContact] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateList, setDuplicateList] = useState([]);

  // --- Load User Data from Database on Session Change ---
  const loadUserData = useCallback(async (user) => {
    if (!user || !user.id) {
      setContacts([]);
      setPersonalEmergency([]);
      setIsLoadingContacts(false);
      setIsAuthLoading(false);
      return;
    }

    setIsLoadingContacts(true);
    setLoadingMessage('Loading your contacts from cloud database...');
    try {
      const cloudContacts = await dbClient.getContacts(user.id, user.token);
      setContacts(cloudContacts || []);
      
      // Sync user profile record
      await dbClient.syncUserProfile(user);
    } catch (err) {
      console.error('Failed to load user contacts from database:', err);
      showToast('Could not sync with cloud database. Loaded local offline vault.', 'warning');
    } finally {
      setIsLoadingContacts(false);
      setIsAuthLoading(false);
    }
  }, [showToast]);

  // Initial Session Check
  useEffect(() => {
    if (currentUser) {
      setLoadingMessage('Loading profile...');
      loadUserData(currentUser);
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  // --- Real Google OAuth Sign-In ---
  const loginWithGoogle = async (providedData = null) => {
    setIsAuthLoading(true);
    setLoadingMessage('Authenticating with Google OAuth...');
    try {
      const oauthData = providedData || await triggerGoogleOAuth();
      if (!oauthData || !oauthData.sub) {
        throw new Error('Google authentication did not return a valid user token.');
      }

      const userId = `google_${oauthData.sub}`;
      const userEmail = (oauthData.email || '').toLowerCase().trim();
      const userName = oauthData.name || userEmail.split('@')[0];
      const userAvatar = oauthData.avatarUrl || oauthData.picture || '';

      const authenticatedUser = {
        id: userId,
        provider: 'google',
        providerUserId: oauthData.sub,
        name: userName,
        email: userEmail,
        avatar: userAvatar,
        avatarUrl: userAvatar,
        avatarBg: 'linear-gradient(135deg, #4285F4, #34A853)',
        role: 'Google User',
        lastSync: new Date().toISOString()
      };

      setLoadingMessage('Loading your contacts from cloud...');
      setCurrentUser(authenticatedUser);
      await loadUserData(authenticatedUser);
      showToast(`Welcome, ${authenticatedUser.name}! Signed in with Google.`, 'success');
      return true;
    } catch (err) {
      console.error('Google OAuth error:', err);
      showToast(err.message || 'Google Sign-In failed', 'error');
      setIsAuthLoading(false);
      return false;
    }
  };

  // --- Real Sign In with Apple ---
  const loginWithApple = async (providedData = null) => {
    setIsAuthLoading(true);
    setLoadingMessage('Authenticating with Apple ID...');
    try {
      const oauthData = providedData || await triggerAppleOAuth();
      if (!oauthData || !oauthData.sub) {
        throw new Error('Apple Sign-In did not return a valid user identity.');
      }

      const userId = `apple_${oauthData.sub}`;
      const userEmail = (oauthData.email || '').toLowerCase().trim();
      const userName = oauthData.name || (userEmail ? userEmail.split('@')[0] : 'Apple User');

      const authenticatedUser = {
        id: userId,
        provider: 'apple',
        providerUserId: oauthData.sub,
        name: userName,
        email: userEmail,
        avatar: '',
        avatarUrl: '',
        avatarBg: 'linear-gradient(135deg, #1C1917, #44403C)',
        role: 'Apple ID User',
        lastSync: new Date().toISOString()
      };

      setLoadingMessage('Loading your contacts from cloud...');
      setCurrentUser(authenticatedUser);
      await loadUserData(authenticatedUser);
      showToast(`Welcome, ${authenticatedUser.name}! Signed in with Apple.`, 'success');
      return true;
    } catch (err) {
      console.error('Apple OAuth error:', err);
      showToast(err.message || 'Apple Sign-In failed', 'error');
      setIsAuthLoading(false);
      return false;
    }
  };

  // --- Real Email/Password Authentication ---
  const loginWithEmail = async (email, password = '') => {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }

    setIsAuthLoading(true);
    setLoadingMessage('Verifying credentials with database...');
    try {
      const user = await dbClient.signInWithEmailPassword(cleanEmail, password);
      const authenticatedUser = {
        ...user,
        avatarBg: getAvatarGradient(user.name || user.email),
        role: 'Member',
        lastSync: new Date().toISOString()
      };

      setLoadingMessage('Loading your contacts from cloud...');
      setCurrentUser(authenticatedUser);
      await loadUserData(authenticatedUser);
      showToast(`Welcome back, ${authenticatedUser.name}!`, 'success');
      return true;
    } catch (err) {
      console.error('Email sign in error:', err);
      showToast(err.message || 'Authentication failed', 'error');
      setIsAuthLoading(false);
      return false;
    }
  };

  // --- Real Email Registration ---
  const signupWithEmail = async (userData) => {
    const cleanEmail = (userData.email || '').toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }

    setIsAuthLoading(true);
    setLoadingMessage('Creating secure account in cloud database...');
    try {
      const user = await dbClient.signUpWithEmailPassword(cleanEmail, userData.password || '', userData.name || '');
      const authenticatedUser = {
        ...user,
        phone: userData.phone || '',
        jobTitle: userData.jobTitle || '',
        company: userData.company || '',
        avatarBg: getAvatarGradient(user.name),
        role: 'Member',
        lastSync: new Date().toISOString()
      };

      setLoadingMessage('Configuring your cloud directory...');
      setCurrentUser(authenticatedUser);
      await loadUserData(authenticatedUser);
      showToast(`Account created successfully for ${authenticatedUser.name}!`, 'success');
      return true;
    } catch (err) {
      console.error('Sign up error:', err);
      showToast(err.message || 'Registration failed', 'error');
      setIsAuthLoading(false);
      return false;
    }
  };

  // --- Logout (Destroys Session & Clears In-Memory User State) ---
  const logoutUser = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    setCurrentUser(null);
    setContacts([]);
    setPersonalEmergency([]);
    setActivePreviewContact(null);
    setActiveEmailContact(null);
    setActiveQRContact(null);
    setActiveShareContact(null);
    setShowDuplicateModal(false);
    showToast('Signed out. User session destroyed.', 'info');
  };

  // --- Update User Profile ---
  const updateUserProfile = async (updates) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...updates,
      lastSync: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    await dbClient.syncUserProfile(updatedUser);
    showToast('Profile updated and saved to cloud database!', 'success');
  };

  // --- Contact CRUD Operations (Bound to Authenticated User ID) ---
  const addContact = async (contactData) => {
    if (!currentUser || !currentUser.id) {
      showToast('Please sign in to add contacts', 'error');
      return null;
    }

    const fullName = contactData.fullName || contactData.name || 'Unnamed Contact';
    const payload = {
      ...contactData,
      fullName,
      name: fullName,
      userId: currentUser.id,
      phone: contactData.phone || '',
      email: contactData.email || '',
      company: contactData.company || '',
      jobTitle: contactData.jobTitle || '',
      address: contactData.address || '',
      city: contactData.city || '',
      state: contactData.state || '',
      pincode: contactData.pincode || '',
      birthday: contactData.birthday || '',
      notes: contactData.notes || '',
      category: contactData.category || contactData.group || 'Personal',
      group: contactData.category || contactData.group || 'Personal',
      favorite: Boolean(contactData.favorite || contactData.isFavorite),
      isFavorite: Boolean(contactData.favorite || contactData.isFavorite),
      avatar: contactData.avatar || contactData.avatarUrl || '',
      avatarUrl: contactData.avatar || contactData.avatarUrl || '',
      avatarBg: contactData.avatarBg || getAvatarGradient(fullName),
      latitude: contactData.latitude || null,
      longitude: contactData.longitude || null
    };

    try {
      const created = await dbClient.createContact(currentUser.id, payload, currentUser.token);
      setContacts(prev => [created, ...prev.filter(c => c.id !== created.id)]);
      showToast(`Added ${fullName} to cloud directory!`, 'success');
      return created;
    } catch (err) {
      console.error('Failed to create contact in cloud DB:', err);
      showToast(err.message || 'Failed to save contact', 'error');
      return null;
    }
  };

  const updateContact = async (id, updates) => {
    if (!currentUser || !currentUser.id) return null;

    const existing = contacts.find(c => c.id === id);
    if (!existing) return null;

    const fullName = updates.fullName || updates.name || existing.fullName || existing.name;
    const merged = {
      ...existing,
      ...updates,
      fullName,
      name: fullName,
      userId: currentUser.id
    };

    try {
      const updated = await dbClient.updateContact(currentUser.id, id, merged, currentUser.token);
      setContacts(prev => prev.map(c => (c.id === id ? updated : c)));
      showToast(`Updated ${fullName} in cloud database!`, 'success');
      return updated;
    } catch (err) {
      console.error('Failed to update contact in cloud DB:', err);
      showToast(err.message || 'Failed to update contact', 'error');
      return null;
    }
  };

  const deleteContact = async (id) => {
    if (!currentUser || !currentUser.id) return false;

    const target = contacts.find(c => c.id === id);
    try {
      await dbClient.deleteContact(currentUser.id, id, currentUser.token);
      setContacts(prev => prev.filter(c => c.id !== id));
      showToast(`Deleted ${target?.fullName || 'contact'} from database`, 'info');
      return true;
    } catch (err) {
      console.error('Failed to delete contact from cloud DB:', err);
      showToast(err.message || 'Failed to delete contact', 'error');
      return false;
    }
  };

  const toggleFavorite = async (id) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    const nextVal = !contact.favorite && !contact.isFavorite;
    await updateContact(id, { favorite: nextVal, isFavorite: nextVal });
  };

  const importContactsList = async (list) => {
    if (!currentUser || !currentUser.id || !Array.isArray(list) || list.length === 0) return 0;

    let successCount = 0;
    for (const item of list) {
      const added = await addContact(item);
      if (added) successCount++;
    }
    showToast(`Successfully imported ${successCount} contacts into your cloud directory!`, 'success');
    return successCount;
  };

  // Bulk Operations
  const bulkDeleteContacts = async (ids) => {
    if (!ids || ids.length === 0 || !currentUser) return;
    for (const id of ids) {
      await dbClient.deleteContact(currentUser.id, id, currentUser.token);
    }
    setContacts(prev => prev.filter(c => !ids.includes(c.id)));
    showToast(`Removed ${ids.length} contacts from database`, 'info');
  };

  const bulkUpdateCategory = async (ids, category) => {
    if (!ids || ids.length === 0 || !currentUser) return;
    for (const id of ids) {
      await updateContact(id, { category, group: category });
    }
    showToast(`Updated category for ${ids.length} contacts`, 'success');
  };

  // Duplicate Finder
  const checkDuplicatesNow = () => {
    const emailMap = new Map();
    const phoneMap = new Map();
    const dupes = [];

    contacts.forEach(c => {
      const cleanPhone = (c.phone || '').replace(/\D/g, '');
      const cleanEmail = (c.email || '').toLowerCase().trim();

      if (cleanPhone && cleanPhone.length > 5) {
        if (phoneMap.has(cleanPhone)) {
          dupes.push({ original: phoneMap.get(cleanPhone), duplicate: c, reason: 'Matching Phone Number' });
        } else {
          phoneMap.set(cleanPhone, c);
        }
      }

      if (cleanEmail) {
        if (emailMap.has(cleanEmail)) {
          dupes.push({ original: emailMap.get(cleanEmail), duplicate: c, reason: 'Matching Email Address' });
        } else {
          emailMap.set(cleanEmail, c);
        }
      }
    });

    setDuplicateList(dupes);
    setShowDuplicateModal(true);
    return dupes;
  };

  // Analytics & Statistics
  const stats = useMemo(() => {
    const total = contacts.length;
    const favorites = contacts.filter(c => c.favorite || c.isFavorite).length;
    const withEmail = contacts.filter(c => c.email && c.email.trim().length > 0).length;
    const withPhone = contacts.filter(c => c.phone && c.phone.trim().length > 0).length;
    const withLocation = contacts.filter(c => c.latitude && c.longitude).length;

    const groupCounts = {};
    contacts.forEach(c => {
      const grp = c.category || c.group || 'Personal';
      groupCounts[grp] = (groupCounts[grp] || 0) + 1;
    });

    return {
      total,
      favorites,
      withEmail,
      withPhone,
      withLocation,
      groupCounts
    };
  }, [contacts]);

  // Export / Backup Helpers
  const exportContactsJSON = () => {
    const jsonStr = JSON.stringify(contacts, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `connect_contacts_${currentUser?.email || 'backup'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported contacts to JSON file', 'success');
  };

  const exportContactsVCard = () => {
    if (contacts.length === 0) {
      showToast('No contacts to export', 'warning');
      return;
    }
    const allVCards = contacts.map(c => generateVCardString(c)).join('\r\n');
    const blob = new Blob([allVCards], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `connect_contacts_${new Date().toISOString().split('T')[0]}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported contacts to vCard (.vcf)', 'success');
  };

  const exportContactsCSV = () => {
    if (contacts.length === 0) {
      showToast('No contacts to export', 'warning');
      return;
    }
    const csvContent = exportToCSV(contacts);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `connect_contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported contacts to CSV spreadsheet', 'success');
  };

  return (
    <ContactContext.Provider
      value={{
        // Theme & Appearance
        themeMode,
        setThemeMode,
        toggleTheme,
        accentColor,
        setAccentColor,
        theme,
        defaultSort,
        setDefaultSort,
        defaultCardStyle,
        setDefaultCardStyle,
        privacySettings,
        setPrivacySettings,

        // Auth & Identity
        currentUser,
        isAuthLoading,
        loadingMessage,
        loginWithGoogle,
        loginWithApple,
        loginWithEmail,
        signupWithEmail,
        logoutUser,
        updateUserProfile,

        // User Isolated Contacts
        contacts,
        isLoadingContacts,
        addContact,
        updateContact,
        deleteContact,
        toggleFavorite,
        importContactsList,
        bulkDeleteContacts,
        bulkUpdateCategory,

        // Emergency & Groups
        personalEmergency,
        setPersonalEmergency,
        groups,
        setGroups,

        // Modals & UI States
        activePreviewContact,
        setActivePreviewContact,
        activeEmailContact,
        setActiveEmailContact,
        activeQRContact,
        setActiveQRContact,
        activeShareContact,
        setActiveShareContact,
        showDuplicateModal,
        setShowDuplicateModal,
        duplicateList,
        checkDuplicatesNow,

        // Stats & Exports
        stats,
        exportContactsJSON,
        exportContactsVCard,
        exportContactsCSV,

        // Toast
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};
