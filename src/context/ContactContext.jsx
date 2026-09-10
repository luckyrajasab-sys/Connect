import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CATEGORIES } from '../data/categories';
import { getAvatarGradient } from '../utils/avatarHelper';
import { generateVCardString, parseVCardString, exportToCSV, parseCSVString } from '../utils/vcard';
import { calculateCompleteness } from '../utils/completeness';
import { triggerGoogleOAuth, triggerAppleOAuth } from '../utils/oauthHelper';

const ContactContext = createContext();

const STORAGE_KEYS = {
  AUTH_SESSION: 'vcontacts_auth_session_v5',
  ACCOUNTS: 'vcontacts_accounts_v5',
  USER_CONTACTS_PREFIX: 'vcontacts_user_contacts_',
  USER_EMERGENCY_PREFIX: 'vcontacts_user_emergency_',
  THEME_MODE: 'vcontacts_theme_mode_v5',
  ACCENT_COLOR: 'vcontacts_accent_color_v5',
  DEFAULT_SORT: 'vcontacts_default_sort_v5',
  PRIVACY_SETTINGS: 'vcontacts_privacy_v5'
};

export const ContactProvider = ({ children }) => {
  // --- Appearance & Theme Engine ---
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
    const handleChange = (e) => {
      setSystemIsDark(e.matches);
    };

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
      document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode);
    } catch (e) {}
  }, [theme, themeMode]);

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

  // --- Registered Accounts Database ---
  const [accounts, setAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {}
  }, [accounts]);

  // --- Authentication State (No Demo Auto-login) ---
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) return parsed;
      }
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    setIsAuthLoading(false);
  }, []);

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

  // --- User-Isolated Contacts State ---
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contacts, setContacts] = useState(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email) {
          const userEmailKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${parsedUser.email.toLowerCase().trim()}`;
          const savedData = localStorage.getItem(userEmailKey);
          if (savedData) {
            const parsed = JSON.parse(savedData);
            if (Array.isArray(parsed)) return parsed;
          }
        }
      }
    } catch (e) {
      console.error("Failed to load user contacts from storage", e);
    }
    return [];
  });

  // Sync Contacts to Current Authenticated User's Isolated Storage
  useEffect(() => {
    if (currentUser && currentUser.email) {
      try {
        const userEmailKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${currentUser.email.toLowerCase().trim()}`;
        localStorage.setItem(userEmailKey, JSON.stringify(contacts));
      } catch (e) {
        console.error("Failed to persist user contacts", e);
      }
    }
  }, [contacts, currentUser]);

  // --- User-Isolated Emergency Contacts ---
  const [personalEmergency, setPersonalEmergency] = useState(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email) {
          const userKey = `${STORAGE_KEYS.USER_EMERGENCY_PREFIX}${parsedUser.email.toLowerCase().trim()}`;
          const saved = localStorage.getItem(userKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
          }
        }
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    if (currentUser && currentUser.email) {
      try {
        const userKey = `${STORAGE_KEYS.USER_EMERGENCY_PREFIX}${currentUser.email.toLowerCase().trim()}`;
        localStorage.setItem(userKey, JSON.stringify(personalEmergency));
      } catch (e) {}
    }
  }, [personalEmergency, currentUser]);

  // Groups / Categories State
  const [groups, setGroups] = useState(CATEGORIES);

  // Sorting and Preferences
  const [defaultSort, setDefaultSort] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DEFAULT_SORT) || 'favorites';
    } catch (e) {
      return 'favorites';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEFAULT_SORT, defaultSort);
    } catch (e) {}
  }, [defaultSort]);

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRIVACY_SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      hidePhoneNumbers: false,
      hideEmailAddresses: false,
      autoDuplicateDetection: true
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRIVACY_SETTINGS, JSON.stringify(privacySettings));
    } catch (e) {}
  }, [privacySettings]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedSort, setSelectedSort] = useState(defaultSort);
  const [selectedTags, setSelectedTags] = useState([]);

  // Active Interactive Modals State
  const [activePreviewContact, setActivePreviewContact] = useState(null);
  const [activeEmailContact, setActiveEmailContact] = useState(null);
  const [activeQRContact, setActiveQRContact] = useState(null);
  const [activeShareContact, setActiveShareContact] = useState(null);
  const [duplicateMatches, setDuplicateMatches] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Authentication & User Identity Functions ---
  const deriveNameFromEmail = (email) => {
    if (!email) return 'User';
    const localPart = email.split('@')[0] || 'User';
    return localPart
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim() || 'User';
  };

  const loginWithEmail = (email, password) => {
    if (!email || !email.trim()) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }

    const cleanEmail = email.toLowerCase().trim();
    let account = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (!account) {
      const defaultName = deriveNameFromEmail(cleanEmail);
      account = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: defaultName,
        email: cleanEmail,
        phone: '',
        password: password || '',
        jobTitle: '',
        company: '',
        bio: '',
        avatarUrl: '',
        avatarBg: getAvatarGradient(defaultName),
        emergencyContact: '',
        role: 'Member',
        joinedDate: new Date().toISOString().split('T')[0],
        syncEnabled: true,
        lastSync: new Date().toISOString()
      };
      setAccounts(prev => [...prev, account]);
    }

    // Load saved contacts for this email from its dedicated storage
    setIsLoadingContacts(true);
    const userEmailKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${cleanEmail}`;
    const userEmergencyKey = `${STORAGE_KEYS.USER_EMERGENCY_PREFIX}${cleanEmail}`;
    const savedContacts = localStorage.getItem(userEmailKey);
    const savedEmergency = localStorage.getItem(userEmergencyKey);

    let loadedContacts = [];
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts);
        if (Array.isArray(parsed)) loadedContacts = parsed;
      } catch (e) {}
    }

    let loadedEmergency = [];
    if (savedEmergency) {
      try {
        const parsed = JSON.parse(savedEmergency);
        if (Array.isArray(parsed)) loadedEmergency = parsed;
      } catch (e) {}
    }

    setContacts(loadedContacts);
    setPersonalEmergency(loadedEmergency);
    setCurrentUser(account);
    setIsLoadingContacts(false);
    showToast(`Welcome, ${account.name}! Loaded ${loadedContacts.length} contacts.`, 'success');
    return true;
  };

  const loginWithGoogle = async (providedData = null) => {
    setIsLoadingContacts(true);
    try {
      // If direct data is passed (e.g. from callback), use it, otherwise trigger real OAuth popup
      const oauthData = providedData || await triggerGoogleOAuth();
      if (!oauthData || !oauthData.sub) {
        throw new Error('Google Sign-In did not return a valid user ID.');
      }

      const userId = `google_${oauthData.sub}`;
      const userEmail = (oauthData.email || '').toLowerCase().trim();
      const userName = oauthData.name || deriveNameFromEmail(userEmail);
      const userAvatar = oauthData.avatarUrl || '';

      let account = accounts.find(a => a.id === userId || (userEmail && a.email.toLowerCase() === userEmail));
      if (!account) {
        account = {
          id: userId,
          provider: 'google',
          providerUserId: oauthData.sub,
          name: userName,
          email: userEmail,
          phone: '',
          jobTitle: '',
          company: '',
          bio: 'Google Connected Account',
          avatarUrl: userAvatar,
          avatarBg: 'linear-gradient(135deg, #4285F4, #34A853)',
          emergencyContact: '',
          role: 'Google User',
          joinedDate: new Date().toISOString().split('T')[0],
          syncEnabled: true,
          lastSync: new Date().toISOString()
        };
        setAccounts(prev => [...prev.filter(a => a.id !== userId), account]);
      } else {
        account = {
          ...account,
          id: userId,
          provider: 'google',
          providerUserId: oauthData.sub,
          name: userName || account.name,
          email: userEmail || account.email,
          avatarUrl: userAvatar || account.avatarUrl,
          lastSync: new Date().toISOString()
        };
        setAccounts(prev => prev.map(a => (a.id === account.id || a.email === userEmail ? account : a)));
      }

      // Load isolated contacts for this user ID
      const userKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${userId}`;
      const legacyKey = userEmail ? `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${userEmail}` : null;
      let loadedContacts = [];
      const saved = localStorage.getItem(userKey) || (legacyKey ? localStorage.getItem(legacyKey) : null);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            loadedContacts = parsed.map(c => ({ ...c, userId }));
          }
        } catch (e) {}
      }

      const emergencyKey = `${STORAGE_KEYS.USER_EMERGENCY_PREFIX}${userId}`;
      let loadedEmergency = [];
      const savedEmergency = localStorage.getItem(emergencyKey);
      if (savedEmergency) {
        try {
          const parsed = JSON.parse(savedEmergency);
          if (Array.isArray(parsed)) loadedEmergency = parsed;
        } catch (e) {}
      }

      setContacts(loadedContacts);
      setPersonalEmergency(loadedEmergency);
      setCurrentUser(account);
      setIsLoadingContacts(false);
      showToast(`Welcome, ${account.name}! Signed in with Google.`, 'success');
      return true;
    } catch (err) {
      setIsLoadingContacts(false);
      console.error('Google OAuth error:', err);
      showToast(err.message || 'Google Sign-In failed', 'error');
      return false;
    }
  };

  const loginWithApple = async (providedData = null) => {
    setIsLoadingContacts(true);
    try {
      const oauthData = providedData || await triggerAppleOAuth();
      if (!oauthData || !oauthData.sub) {
        throw new Error('Apple Sign-In did not return a valid user ID.');
      }

      const userId = `apple_${oauthData.sub}`;
      const userEmail = (oauthData.email || '').toLowerCase().trim();
      const userName = oauthData.name || (userEmail ? deriveNameFromEmail(userEmail) : 'Apple User');

      let account = accounts.find(a => a.id === userId || (userEmail && a.email.toLowerCase() === userEmail));
      if (!account) {
        account = {
          id: userId,
          provider: 'apple',
          providerUserId: oauthData.sub,
          name: userName,
          email: userEmail,
          phone: '',
          jobTitle: '',
          company: '',
          bio: 'Apple ID Connected Account',
          avatarUrl: '',
          avatarBg: 'linear-gradient(135deg, #1C1917, #44403C)',
          emergencyContact: '',
          role: 'Apple ID User',
          joinedDate: new Date().toISOString().split('T')[0],
          syncEnabled: true,
          lastSync: new Date().toISOString()
        };
        setAccounts(prev => [...prev.filter(a => a.id !== userId), account]);
      } else {
        account = {
          ...account,
          id: userId,
          provider: 'apple',
          providerUserId: oauthData.sub,
          name: userName !== 'Apple User' ? userName : account.name,
          email: userEmail || account.email,
          lastSync: new Date().toISOString()
        };
        setAccounts(prev => prev.map(a => (a.id === account.id || a.email === userEmail ? account : a)));
      }

      const userKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${userId}`;
      const legacyKey = userEmail ? `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${userEmail}` : null;
      let loadedContacts = [];
      const saved = localStorage.getItem(userKey) || (legacyKey ? localStorage.getItem(legacyKey) : null);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            loadedContacts = parsed.map(c => ({ ...c, userId }));
          }
        } catch (e) {}
      }

      const emergencyKey = `${STORAGE_KEYS.USER_EMERGENCY_PREFIX}${userId}`;
      let loadedEmergency = [];
      const savedEmergency = localStorage.getItem(emergencyKey);
      if (savedEmergency) {
        try {
          const parsed = JSON.parse(savedEmergency);
          if (Array.isArray(parsed)) loadedEmergency = parsed;
        } catch (e) {}
      }

      setContacts(loadedContacts);
      setPersonalEmergency(loadedEmergency);
      setCurrentUser(account);
      setIsLoadingContacts(false);
      showToast(`Welcome, ${account.name}! Signed in with Apple.`, 'success');
      return true;
    } catch (err) {
      setIsLoadingContacts(false);
      console.error('Apple OAuth error:', err);
      showToast(err.message || 'Apple Sign-In failed', 'error');
      return false;
    }
  };

  const loginWithMobile = (phone, otp) => {
    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 6) {
      showToast('Please enter a valid mobile number', 'error');
      return false;
    }

    let account = accounts.find(a => String(a.phone || '').replace(/\D/g, '').includes(cleanPhone));

    if (!account) {
      const generatedEmail = `user.${cleanPhone.slice(-4)}@vcontacts.user`;
      const defaultName = `User ${cleanPhone.slice(-4)}`;
      account = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: defaultName,
        email: generatedEmail,
        phone: phone,
        password: '',
        jobTitle: '',
        company: '',
        bio: '',
        avatarUrl: '',
        avatarBg: getAvatarGradient(defaultName),
        emergencyContact: '',
        role: 'Member',
        joinedDate: new Date().toISOString().split('T')[0],
        syncEnabled: true,
        lastSync: new Date().toISOString()
      };
      setAccounts(prev => [...prev, account]);
    }

    setIsLoadingContacts(true);
    const userEmailKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${account.email.toLowerCase().trim()}`;
    const savedContacts = localStorage.getItem(userEmailKey);
    let loadedContacts = [];
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts);
        if (Array.isArray(parsed)) loadedContacts = parsed;
      } catch (e) {}
    }

    setContacts(loadedContacts);
    setCurrentUser(account);
    setIsLoadingContacts(false);
    showToast(`Logged in as ${account.name} (${loadedContacts.length} contacts loaded)`, 'success');
    return true;
  };

  const signupWithEmail = (userData) => {
    const cleanEmail = (userData.email || '').toLowerCase().trim();
    if (!cleanEmail) {
      showToast('Please provide an email address', 'error');
      return false;
    }

    const name = userData.name && userData.name.trim() ? userData.name.trim() : deriveNameFromEmail(cleanEmail);

    const newAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      email: cleanEmail,
      phone: userData.phone || '',
      password: userData.password || '',
      jobTitle: userData.jobTitle || '',
      company: userData.company || '',
      bio: userData.bio || '',
      avatarUrl: userData.avatarUrl || '',
      avatarBg: getAvatarGradient(name),
      emergencyContact: userData.emergencyContact || '',
      role: 'Member',
      joinedDate: new Date().toISOString().split('T')[0],
      syncEnabled: true,
      lastSync: new Date().toISOString()
    };

    setAccounts(prev => {
      const filtered = prev.filter(a => a.email.toLowerCase() !== cleanEmail);
      return [...filtered, newAccount];
    });

    const userEmailKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${cleanEmail}`;
    const savedContacts = localStorage.getItem(userEmailKey);
    let initialContacts = [];
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts);
        if (Array.isArray(parsed)) initialContacts = parsed;
      } catch (e) {}
    } else {
      localStorage.setItem(userEmailKey, JSON.stringify([]));
    }

    setContacts(initialContacts);
    setPersonalEmergency([]);
    setCurrentUser(newAccount);
    showToast(`Account created for ${newAccount.name}!`, 'success');
    return true;
  };

  const signupWithMobile = (userData) => {
    const cleanPhone = String(userData.phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 6) {
      showToast('Please provide a valid phone number', 'error');
      return false;
    }

    const name = userData.name && userData.name.trim() ? userData.name.trim() : `User ${cleanPhone.slice(-4)}`;
    const userEmail = (userData.email || `user.${cleanPhone.slice(-4)}@vcontacts.user`).toLowerCase().trim();

    const newAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      email: userEmail,
      phone: userData.phone,
      password: userData.password || '',
      jobTitle: userData.jobTitle || '',
      company: userData.company || '',
      bio: userData.bio || '',
      avatarUrl: '',
      avatarBg: getAvatarGradient(name),
      emergencyContact: '',
      role: 'Member',
      joinedDate: new Date().toISOString().split('T')[0],
      syncEnabled: true,
      lastSync: new Date().toISOString()
    };

    setAccounts(prev => [...prev, newAccount]);

    const userEmailKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${userEmail}`;
    localStorage.setItem(userEmailKey, JSON.stringify([]));

    setContacts([]);
    setPersonalEmergency([]);
    setCurrentUser(newAccount);
    showToast(`Account created for ${newAccount.name}!`, 'success');
    return true;
  };

  const logoutUser = () => {
    if (currentUser?.email) {
      const userKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${currentUser.email.toLowerCase().trim()}`;
      localStorage.setItem(userKey, JSON.stringify(contacts));
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    setCurrentUser(null);
    setContacts([]);
    setPersonalEmergency([]);
    setActivePreviewContact(null);
    setActiveEmailContact(null);
    setActiveQRContact(null);
    setActiveShareContact(null);
    setShowDuplicateModal(false);
    showToast('Signed out successfully', 'info');
  };

  const updateUserProfile = (updates) => {
    if (!currentUser) return;

    const oldEmail = currentUser.email.toLowerCase().trim();
    const updatedUser = {
      ...currentUser,
      ...updates,
      lastSync: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    setAccounts(prev => prev.map(a => (a.id === currentUser.id ? updatedUser : a)));

    if (updates.email && updates.email.toLowerCase().trim() !== oldEmail) {
      const newEmailKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${updates.email.toLowerCase().trim()}`;
      localStorage.setItem(newEmailKey, JSON.stringify(contacts));
    }

    showToast('User profile updated successfully!', 'success');
  };

  const syncEmailContactHistory = () => {
    if (!currentUser?.email) {
      showToast('No active account to sync', 'warning');
      return;
    }
    const userEmailKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${currentUser.email.toLowerCase().trim()}`;
    const userEmergencyKey = `${STORAGE_KEYS.USER_EMERGENCY_PREFIX}${currentUser.email.toLowerCase().trim()}`;
    localStorage.setItem(userEmailKey, JSON.stringify(contacts));
    localStorage.setItem(userEmergencyKey, JSON.stringify(personalEmergency));

    const updatedUser = { ...currentUser, lastSync: new Date().toISOString() };
    setCurrentUser(updatedUser);
    setAccounts(prev => prev.map(a => (a.id === currentUser.id ? updatedUser : a)));
    showToast(`Cloud Vault synced (${contacts.length} contacts saved)!`, 'success');
  };

  const restoreEmailContactHistory = (email) => {
    const targetEmail = (email || currentUser?.email || '').toLowerCase().trim();
    if (!targetEmail) return;
    const userEmailKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${targetEmail}`;
    const saved = localStorage.getItem(userEmailKey);
    let loaded = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) loaded = parsed;
      } catch (e) {}
    }
    setContacts(loaded);
    showToast(`Restored ${loaded.length} contacts from ${targetEmail} vault!`, 'success');
  };

  const switchAccount = (accountId) => {
    const targetAcc = accounts.find(a => a.id === accountId);
    if (!targetAcc) return;
    if (currentUser?.email) {
      const currentKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${currentUser.email.toLowerCase().trim()}`;
      localStorage.setItem(currentKey, JSON.stringify(contacts));
    }
    setIsLoadingContacts(true);
    const userEmailKey = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${targetAcc.email.toLowerCase().trim()}`;
    const saved = localStorage.getItem(userEmailKey);
    let loaded = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) loaded = parsed;
      } catch (e) {}
    }
    setContacts(loaded);
    setCurrentUser(targetAcc);
    setIsLoadingContacts(false);
    showToast(`Switched account to ${targetAcc.name}`, 'info');
  };

  const getSavedEmailAccounts = () => {
    return accounts.map(acc => {
      let count = 0;
      try {
        const key = `${STORAGE_KEYS.USER_CONTACTS_PREFIX}${acc.email.toLowerCase().trim()}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) count = parsed.length;
        }
      } catch (e) {}
      return {
        ...acc,
        savedContactsCount: count
      };
    });
  };

  // --- CRUD Operations (User Associated) ---
  const addContact = (contactData) => {
    if (!currentUser) {
      showToast('Please sign in to add contacts', 'error');
      return null;
    }

    const fullName = contactData.fullName || contactData.name || 'Unnamed Contact';
    const newContact = {
      userId: currentUser.id || currentUser.email,
      id: `cnt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: fullName,
      fullName: fullName,
      phone: contactData.phone || '',
      alternatePhone: contactData.alternatePhone || '',
      email: contactData.email || '',
      company: contactData.company || '',
      jobTitle: contactData.jobTitle || '',
      address: contactData.address || '',
      city: contactData.city || '',
      state: contactData.state || '',
      country: contactData.country || 'India',
      pincode: contactData.pincode || '',
      birthday: contactData.birthday || '',
      website: contactData.website || '',
      notes: contactData.notes || '',
      category: contactData.group || contactData.category || 'friends',
      group: contactData.group || contactData.category || 'friends',
      favorite: Boolean(contactData.isFavorite || contactData.favorite),
      isFavorite: Boolean(contactData.isFavorite || contactData.favorite),
      avatar: contactData.avatarUrl || contactData.avatar || '',
      avatarUrl: contactData.avatarUrl || contactData.avatar || '',
      avatarBg: contactData.avatarBg || getAvatarGradient(fullName),
      latitude: contactData.latitude || null,
      longitude: contactData.longitude || null,
      tags: Array.isArray(contactData.tags) ? contactData.tags : (contactData.tags ? String(contactData.tags).split(',').map(t => t.trim()).filter(Boolean) : []),
      interactionCount: 0,
      favoriteOrder: (contactData.isFavorite || contactData.favorite) ? Date.now() : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setContacts(prev => [newContact, ...prev]);
    showToast(`Added ${newContact.fullName} to contacts`, 'success');
    return newContact;
  };

  const updateContact = (id, updatedData) => {
    setContacts(prev =>
      prev.map(c => {
        if (c.id === id) {
          const fullName = updatedData.fullName || updatedData.name || c.fullName;
          const tags = Array.isArray(updatedData.tags)
            ? updatedData.tags
            : (updatedData.tags ? String(updatedData.tags).split(',').map(t => t.trim()).filter(Boolean) : (c.tags || []));

          return {
            ...c,
            ...updatedData,
            name: fullName,
            fullName,
            tags,
            category: updatedData.group || updatedData.category || c.category || 'friends',
            group: updatedData.group || updatedData.category || c.group || 'friends',
            favorite: updatedData.isFavorite !== undefined ? updatedData.isFavorite : (updatedData.favorite !== undefined ? updatedData.favorite : c.favorite),
            isFavorite: updatedData.isFavorite !== undefined ? updatedData.isFavorite : (updatedData.favorite !== undefined ? updatedData.favorite : c.isFavorite),
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );
    showToast(`Updated contact details successfully`, 'success');
  };

  const deleteContact = (id) => {
    const target = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast(`Deleted ${target?.fullName || target?.name || 'contact'}`, 'info');
  };

  const toggleFavorite = (id) => {
    setContacts(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextState = !c.isFavorite;
          showToast(
            nextState ? `Starred ${c.fullName} as favorite` : `Removed ${c.fullName} from favorites`,
            'info'
          );
          return {
            ...c,
            favorite: nextState,
            isFavorite: nextState,
            favoriteOrder: nextState ? (c.favoriteOrder || Date.now()) : 0
          };
        }
        return c;
      })
    );
  };

  const reorderFavorites = (reorderedFavorites) => {
    const orderMap = new Map();
    reorderedFavorites.forEach((item, index) => {
      orderMap.set(item.id, index + 1);
    });

    setContacts(prev =>
      prev.map(c => {
        if (orderMap.has(c.id)) {
          return { ...c, favoriteOrder: orderMap.get(c.id) };
        }
        return c;
      })
    );
    showToast('Favorites order updated', 'info');
  };

  const logInteraction = (id, type = 'call') => {
    setContacts(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            interactionCount: (c.interactionCount || 0) + 1,
            lastContactedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );
  };

  const getContactById = (id) => {
    return contacts.find(c => c.id === id);
  };

  // Personal Emergency Operations
  const addPersonalEmergency = (data) => {
    const newEntry = {
      ...data,
      id: `pe-${Date.now()}`
    };
    setPersonalEmergency(prev => [newEntry, ...prev]);
    showToast(`Added ${data.name} to Personal Emergency Contacts`, 'success');
    return newEntry;
  };

  const updatePersonalEmergency = (id, updatedData) => {
    setPersonalEmergency(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedData } : item))
    );
    showToast(`Updated emergency contact`, 'success');
  };

  const removePersonalEmergency = (id) => {
    setPersonalEmergency(prev => prev.filter(item => item.id !== id));
    showToast(`Removed from emergency contacts`, 'info');
  };

  // Group Operations
  const addGroup = (groupData) => {
    const exists = groups.some(g => g.name.toLowerCase() === groupData.name.trim().toLowerCase());
    if (exists) {
      showToast(`Group "${groupData.name}" already exists`, 'warning');
      return null;
    }
    const newGroup = {
      id: groupData.name.toLowerCase().replace(/\s+/g, '-'),
      name: groupData.name.trim(),
      color: groupData.color || '#10B981',
      gradient: `linear-gradient(135deg, ${groupData.color || '#10B981'}22 0%, ${groupData.color || '#10B981'}08 100%)`,
      border: `${groupData.color || '#10B981'}44`,
      icon: groupData.icon || 'tag'
    };
    setGroups(prev => [...prev, newGroup]);
    showToast(`Created new group: ${newGroup.name}`, 'success');
    return newGroup;
  };

  // Duplicate Management
  const detectDuplicates = (contactsList = contacts) => {
    const duplicates = [];
    const phoneMap = new Map();
    const emailMap = new Map();

    contactsList.forEach(c => {
      const cleanPhone = (c.phone || '').replace(/\D/g, '');
      const cleanEmail = (c.email || '').trim().toLowerCase();

      if (cleanPhone && cleanPhone.length >= 7) {
        if (phoneMap.has(cleanPhone)) {
          duplicates.push({
            reason: 'Same Phone Number',
            field: 'phone',
            primary: phoneMap.get(cleanPhone),
            duplicate: c
          });
        } else {
          phoneMap.set(cleanPhone, c);
        }
      }

      if (cleanEmail) {
        if (emailMap.has(cleanEmail)) {
          duplicates.push({
            reason: 'Same Email Address',
            field: 'email',
            primary: emailMap.get(cleanEmail),
            duplicate: c
          });
        } else {
          emailMap.set(cleanEmail, c);
        }
      }
    });

    return duplicates;
  };

  const checkDuplicatesNow = () => {
    const dups = detectDuplicates();
    setDuplicateMatches(dups);
    if (dups.length > 0) {
      setShowDuplicateModal(true);
    } else {
      showToast('No duplicate contacts found!', 'success');
    }
  };

  const mergeDuplicatePair = (primaryId, duplicateId) => {
    const primary = contacts.find(c => c.id === primaryId);
    const duplicate = contacts.find(c => c.id === duplicateId);
    if (!primary || !duplicate) return;

    const merged = {
      ...primary,
      alternatePhone: primary.alternatePhone || duplicate.phone || duplicate.alternatePhone,
      email: primary.email || duplicate.email,
      company: primary.company || duplicate.company,
      jobTitle: primary.jobTitle || duplicate.jobTitle,
      address: primary.address || duplicate.address,
      city: primary.city || duplicate.city,
      state: primary.state || duplicate.state,
      pincode: primary.pincode || duplicate.pincode,
      birthday: primary.birthday || duplicate.birthday,
      website: primary.website || duplicate.website,
      notes: [primary.notes, duplicate.notes].filter(Boolean).join('\n---\n'),
      tags: Array.from(new Set([...(primary.tags || []), ...(duplicate.tags || [])])),
      isFavorite: primary.isFavorite || duplicate.isFavorite,
      favorite: primary.isFavorite || duplicate.isFavorite,
      isEmergency: primary.isEmergency || duplicate.isEmergency,
      updatedAt: new Date().toISOString()
    };

    setContacts(prev => prev.filter(c => c.id !== duplicateId).map(c => (c.id === primaryId ? merged : c)));
    setDuplicateMatches(prev => prev.filter(d => d.primary.id !== primaryId && d.duplicate.id !== duplicateId));
    showToast(`Merged duplicate into ${merged.fullName}`, 'success');
  };

  // Import / Export Engine
  const exportContactsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contacts, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `vcontacts_export_${new Date().toISOString().slice(0, 10)}.json`;
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${contacts.length} contacts to JSON`, 'success');
  };

  const exportContactsVCard = () => {
    const allVCards = contacts.map(c => generateVCardString(c)).join('\r\n');
    const blob = new Blob([allVCards], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vcontacts_all_${new Date().toISOString().slice(0, 10)}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${contacts.length} contacts to vCard (.vcf)`, 'success');
  };

  const exportContactsCSV = () => {
    const csvContent = exportToCSV(contacts);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vcontacts_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${contacts.length} contacts to CSV`, 'success');
  };

  const backupAllData = () => {
    const fullBackup = {
      version: '5.0',
      app: 'Vcontacts',
      user: currentUser?.email || 'unauthenticated',
      timestamp: new Date().toISOString(),
      contacts,
      personalEmergency,
      groups,
      defaultSort
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `vcontacts_vault_${new Date().toISOString().slice(0, 10)}.json`;
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Complete Vcontacts vault backup downloaded`, 'success');
  };

  const importContactsList = (incomingList) => {
    if (!Array.isArray(incomingList) || incomingList.length === 0) {
      showToast(`No valid contacts found to import`, 'warning');
      return false;
    }

    let addedCount = 0;
    const merged = [...contacts];

    incomingList.forEach(incoming => {
      const cleanPhone = String(incoming.phone || incoming.mobile || '').replace(/\D/g, '');
      const existingIdx = merged.findIndex(
        c => (c.phone && c.phone.replace(/\D/g, '') === cleanPhone) || (c.id === incoming.id)
      );

      const fullName = incoming.fullName || incoming.name || 'Unnamed Contact';
      const formatted = {
        userId: currentUser?.id || currentUser?.email || 'local',
        id: incoming.id || `cnt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: fullName,
        fullName,
        avatarUrl: incoming.avatarUrl || incoming.avatar || '',
        avatarBg: incoming.avatarBg || getAvatarGradient(fullName),
        phone: cleanPhone || '',
        alternatePhone: incoming.alternatePhone ? String(incoming.alternatePhone).replace(/\D/g, '') : '',
        email: incoming.email || '',
        company: incoming.company || incoming.organization || '',
        jobTitle: incoming.jobTitle || incoming.title || '',
        address: incoming.address || '',
        city: incoming.city || '',
        state: incoming.state || 'Maharashtra',
        country: incoming.country || 'India',
        pincode: incoming.pincode || '',
        birthday: incoming.birthday || incoming.dob || '',
        website: incoming.website || incoming.url || '',
        notes: incoming.notes || '',
        tags: Array.isArray(incoming.tags) ? incoming.tags : (incoming.tags ? String(incoming.tags).split(',').map(t => t.trim()).filter(Boolean) : []),
        category: incoming.category || incoming.group || 'friends',
        group: incoming.group || incoming.category || 'friends',
        importance: incoming.importance || 'normal',
        favorite: Boolean(incoming.isFavorite || incoming.favorite),
        isFavorite: Boolean(incoming.isFavorite || incoming.favorite),
        isEmergency: Boolean(incoming.isEmergency),
        emergencyRelation: incoming.emergencyRelation || '',
        favoriteOrder: (incoming.isFavorite || incoming.favorite) ? Date.now() : 0,
        interactionCount: Number(incoming.interactionCount || 0),
        latitude: incoming.latitude || null,
        longitude: incoming.longitude || null,
        createdAt: incoming.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        merged[existingIdx] = { ...merged[existingIdx], ...formatted };
      } else {
        merged.unshift(formatted);
        addedCount++;
      }
    });

    setContacts(merged);
    showToast(`Imported ${incomingList.length} contacts (${addedCount} new added)`, 'success');
    return true;
  };

  const importFromMobilePicker = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel', 'email', 'address'];
        const selected = await navigator.contacts.select(props, { multiple: true });
        if (selected && selected.length > 0) {
          const formattedList = selected.map(item => ({
            fullName: (item.name && item.name[0]) || 'Mobile Contact',
            phone: (item.tel && item.tel[0]) || '',
            email: (item.email && item.email[0]) || '',
            address: (item.address && item.address[0]?.addressLine) || ''
          }));
          importContactsList(formattedList);
          showToast(`Imported ${formattedList.length} contacts from mobile address book!`, 'success');
          return true;
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          showToast('Could not open phone contacts', 'warning');
        }
      }
    } else {
      showToast('Native Contact Picker is available on mobile Chrome/Android. You can also upload .vcf or .csv files.', 'info');
    }
    return false;
  };

  const importVCardRaw = (vcardText) => {
    const parsed = parseVCardString(vcardText);
    return importContactsList(parsed);
  };

  const importCSVRaw = (csvText) => {
    const parsed = parseCSVString(csvText);
    return importContactsList(parsed);
  };

  const restoreAllData = (backupData) => {
    if (backupData.contacts && Array.isArray(backupData.contacts)) {
      setContacts(backupData.contacts);
    }
    if (backupData.personalEmergency && Array.isArray(backupData.personalEmergency)) {
      setPersonalEmergency(backupData.personalEmergency);
    }
    if (backupData.groups && Array.isArray(backupData.groups)) {
      setGroups(backupData.groups);
    }
    showToast(`Vault restored successfully`, 'success');
  };

  // Filtered & Sorted Contacts Computation
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      if (selectedGroup !== 'all' && c.group !== selectedGroup) return false;
      if (selectedFilter === 'favorites' && !c.isFavorite && !c.favorite) return false;
      if (selectedFilter === 'emergency' && !c.isEmergency && c.group !== 'emergency') return false;
      if (selectedFilter === 'vip' && c.importance !== 'vip' && c.group !== 'vip') return false;
      if (selectedFilter === 'hasPhone' && (!c.phone || c.phone.trim() === '')) return false;
      if (selectedFilter === 'hasEmail' && (!c.email || c.email.trim() === '')) return false;
      if (selectedFilter === 'hasLocation' && !c.city && !c.address) return false;

      if (selectedTags.length > 0) {
        const cTags = c.tags || [];
        const matchesAllTags = selectedTags.every(tag => cTags.includes(tag));
        if (!matchesAllTags) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = (c.fullName || c.name || '').toLowerCase().includes(query);
        const phoneMatch = (c.phone || '').includes(query) || (c.alternatePhone || '').includes(query);
        const emailMatch = (c.email || '').toLowerCase().includes(query);
        const companyMatch = (c.company || '').toLowerCase().includes(query);
        const titleMatch = (c.jobTitle || '').toLowerCase().includes(query);
        const cityMatch = (c.city || '').toLowerCase().includes(query);
        const notesMatch = (c.notes || '').toLowerCase().includes(query);
        const tagsMatch = (c.tags || []).some(t => t.toLowerCase().includes(query));

        return (
          nameMatch ||
          phoneMatch ||
          emailMatch ||
          companyMatch ||
          titleMatch ||
          cityMatch ||
          notesMatch ||
          tagsMatch
        );
      }

      return true;
    }).sort((a, b) => {
      switch (selectedSort) {
        case 'name-asc':
          return (a.fullName || a.name || '').localeCompare(b.fullName || b.name || '');
        case 'name-desc':
          return (b.fullName || b.name || '').localeCompare(a.fullName || a.name || '');
        case 'recent':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'updated':
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        case 'most-contacted':
          return (b.interactionCount || 0) - (a.interactionCount || 0);
        case 'category':
          return (a.group || '').localeCompare(b.group || '');
        case 'city':
          return (a.city || '').localeCompare(b.city || '');
        case 'favorites':
        default:
          if (a.isFavorite !== b.isFavorite) {
            return a.isFavorite ? -1 : 1;
          }
          if (a.isFavorite && b.isFavorite) {
            return (a.favoriteOrder || 0) - (b.favoriteOrder || 0);
          }
          return (a.fullName || a.name || '').localeCompare(b.fullName || b.name || '');
      }
    });
  }, [contacts, searchQuery, selectedFilter, selectedGroup, selectedSort, selectedTags]);

  // Statistics computation
  const stats = useMemo(() => {
    const total = contacts.length;
    const favorites = contacts.filter(c => c.isFavorite || c.favorite).length;
    const emergency = contacts.filter(c => c.isEmergency || c.group === 'emergency').length + personalEmergency.length;
    const withEmail = contacts.filter(c => c.email && c.email.trim() !== '').length;
    const withAddress = contacts.filter(c => c.address || c.city).length;
    const withPhone = contacts.filter(c => c.phone && c.phone.trim() !== '').length;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const addedThisMonth = contacts.filter(c => {
      if (!c.createdAt) return false;
      const d = new Date(c.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const totalScore = contacts.reduce((sum, c) => sum + calculateCompleteness(c).score, 0);
    const avgCompleteness = total > 0 ? Math.round(totalScore / total) : 0;

    return {
      total,
      favorites,
      emergency,
      withEmail,
      withAddress,
      withPhone,
      addedThisMonth,
      avgCompleteness
    };
  }, [contacts, personalEmergency]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    contacts.forEach(c => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach(t => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }, [contacts]);

  return (
    <ContactContext.Provider
      value={{
        // Theme & Appearance
        theme,
        themeMode,
        setThemeMode,
        toggleTheme,
        accentColor,
        setAccentColor,
        // Auth & Identity
        isAuthLoading,
        isLoadingContacts,
        currentUser,
        accounts,
        loginWithGoogle,
        loginWithApple,
        loginWithEmail,
        loginWithMobile,
        signupWithEmail,
        signupWithMobile,
        logoutUser,
        updateUserProfile,
        syncEmailContactHistory,
        restoreEmailContactHistory,
        switchAccount,
        getSavedEmailAccounts,
        // Contacts CRUD
        contacts,
        filteredContacts,
        stats,
        allTags,
        personalEmergency,
        groups,
        searchQuery,
        setSearchQuery,
        selectedFilter,
        setSelectedFilter,
        selectedGroup,
        setSelectedGroup,
        selectedSort,
        setSelectedSort,
        defaultSort,
        setDefaultSort,
        selectedTags,
        setSelectedTags,
        privacySettings,
        setPrivacySettings,
        toasts,
        showToast,
        removeToast,
        addContact,
        updateContact,
        deleteContact,
        toggleFavorite,
        reorderFavorites,
        logInteraction,
        getContactById,
        addPersonalEmergency,
        updatePersonalEmergency,
        removePersonalEmergency,
        addGroup,
        // Interactive Modals
        activePreviewContact,
        setActivePreviewContact,
        activeEmailContact,
        setActiveEmailContact,
        activeQRContact,
        setActiveQRContact,
        activeShareContact,
        setActiveShareContact,
        duplicateMatches,
        showDuplicateModal,
        setShowDuplicateModal,
        checkDuplicatesNow,
        mergeDuplicatePair,
        // Import & Export
        exportContactsJSON,
        exportContactsVCard,
        exportContactsCSV,
        backupAllData,
        importContactsList,
        importFromMobilePicker,
        importVCardRaw,
        importCSVRaw,
        restoreAllData
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
