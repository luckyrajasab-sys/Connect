import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cloudDb } from '../services/cloudDb';
import { INITIAL_SAMPLE_CONTACTS } from '../data/sampleContacts';
import { getAvatarColor } from '../utils/avatarHelper';
import { notificationService } from '../services/notificationService';

const ContactContext = createContext();

const STORAGE_KEYS = {
  USER_SESSION: 'connect_mobile_user_session_v1',
  CONTACTS_DATA: 'connect_mobile_contacts_data_v1',
  DEFAULT_SORT: 'connect_mobile_default_sort_v1',
  EMERGENCY_DATA: 'connect_mobile_emergency_v1'
};

export const ContactProvider = ({ children }) => {
  // Auth & Profile State
  const [currentUser, setCurrentUser] = useState({
    id: 'usr_guest_primary',
    name: 'Smart Hub Member',
    email: 'user@connecthub.global',
    phone: '+91 98765 43210',
    jobTitle: 'Product Architect',
    company: 'Connect Global',
    avatar: '',
    provider: 'local_vault',
    lastSync: new Date().toISOString()
  });

  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Contacts List State
  const [contacts, setContacts] = useState(INITIAL_SAMPLE_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('favorites');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Load Saved Contacts and Session
  useEffect(() => {
    const initializeData = async () => {
      try {
        const savedSession = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
        if (savedSession) {
          setCurrentUser(JSON.parse(savedSession));
        }

        const savedContacts = await AsyncStorage.getItem(STORAGE_KEYS.CONTACTS_DATA);
        if (savedContacts) {
          const parsed = JSON.parse(savedContacts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setContacts(parsed);
          }
        }

        // Check Cloud Connectivity
        const conn = await cloudDb.checkConnection();
        setIsCloudConnected(conn.connected);
      } catch (err) {
        console.warn('Initialization error:', err);
      }
    };

    initializeData();
  }, []);

  // Persist Contacts on Changes
  const saveContactsLocally = async (newList) => {
    setContacts(newList);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CONTACTS_DATA, JSON.stringify(newList));
    } catch (e) {}
  };

  // Sync with Cloud
  const syncWithCloud = async () => {
    setIsSyncing(true);
    try {
      const conn = await cloudDb.checkConnection();
      setIsCloudConnected(conn.connected);

      if (conn.connected && currentUser?.id) {
        const remote = await cloudDb.getContacts(currentUser.id, currentUser.token);
        if (remote && remote.length > 0) {
          await saveContactsLocally(remote);
        }
        await cloudDb.syncUserProfile(currentUser);
        showToast('Successfully synchronized with Cloud PostgreSQL!', 'success');
      } else {
        // Offline background local sync
        await saveContactsLocally(contacts);
        showToast('Local vault synchronized and backed up securely.', 'success');
      }
      
      setCurrentUser(prev => ({ ...prev, lastSync: new Date().toISOString() }));
    } catch (err) {
      showToast('Sync error: ' + err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // CRUD Operations
  const addContact = async (contactData) => {
    const fullName = contactData.fullName || contactData.name || 'Unnamed Contact';
    const newContact = {
      ...contactData,
      id: contactData.id || `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName,
      name: fullName,
      phone: contactData.phone || '',
      alternatePhone: contactData.alternatePhone || '',
      email: contactData.email || '',
      company: contactData.company || '',
      jobTitle: contactData.jobTitle || '',
      address: contactData.address || '',
      city: contactData.city || '',
      state: contactData.state || '',
      pincode: contactData.pincode || '',
      country: contactData.country || 'India',
      birthday: contactData.birthday || '',
      website: contactData.website || '',
      notes: contactData.notes || '',
      category: contactData.category || 'Personal',
      favorite: Boolean(contactData.favorite),
      avatar: contactData.avatar || '',
      avatarBg: contactData.avatarBg || getAvatarColor(fullName),
      tags: Array.isArray(contactData.tags) ? contactData.tags : [],
      importance: contactData.importance || 'normal',
      isEmergency: Boolean(contactData.isEmergency),
      emergencyRelation: contactData.emergencyRelation || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedList = [newContact, ...contacts.filter(c => c.id !== newContact.id)];
    await saveContactsLocally(updatedList);
    
    // Background cloud sync attempt
    if (currentUser?.id) {
      cloudDb.createContact(currentUser.id, newContact, currentUser.token).catch(() => {});
    }

    showToast(`Added ${fullName} to contact hub!`, 'success');
    return newContact;
  };

  const updateContact = async (id, updates) => {
    const existing = contacts.find(c => c.id === id);
    if (!existing) return null;

    const fullName = updates.fullName || updates.name || existing.fullName || existing.name;
    const updated = {
      ...existing,
      ...updates,
      fullName,
      name: fullName,
      updatedAt: new Date().toISOString()
    };

    const updatedList = contacts.map(c => (c.id === id ? updated : c));
    await saveContactsLocally(updatedList);

    if (currentUser?.id) {
      cloudDb.updateContact(currentUser.id, id, updated, currentUser.token).catch(() => {});
    }

    showToast(`Updated ${fullName}!`, 'success');
    return updated;
  };

  const deleteContact = async (id) => {
    const target = contacts.find(c => c.id === id);
    const updatedList = contacts.filter(c => c.id !== id);
    await saveContactsLocally(updatedList);

    if (currentUser?.id) {
      cloudDb.deleteContact(currentUser.id, id, currentUser.token).catch(() => {});
    }

    showToast(`Deleted ${target?.fullName || 'contact'}`, 'info');
    return true;
  };

  const toggleFavorite = async (id) => {
    const target = contacts.find(c => c.id === id);
    if (!target) return;
    const nextFav = !target.favorite;
    await updateContact(id, { favorite: nextFav });
  };

  const importContactsBatch = async (batch) => {
    if (!Array.isArray(batch) || batch.length === 0) return 0;
    let count = 0;
    const existingPhones = new Set(contacts.map(c => (c.phone || '').replace(/\D/g, '')));
    const toAdd = [];

    for (const item of batch) {
      const cleanP = (item.phone || '').replace(/\D/g, '');
      if (!cleanP || !existingPhones.has(cleanP)) {
        toAdd.push({
          ...item,
          id: item.id || `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          avatarBg: getAvatarColor(item.fullName || 'Contact'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        if (cleanP) existingPhones.add(cleanP);
        count++;
      }
    }

    if (toAdd.length > 0) {
      const combined = [...toAdd, ...contacts];
      await saveContactsLocally(combined);
      showToast(`Successfully imported ${count} new contacts!`, 'success');
      notificationService.sendLocalAlert(
        'Contacts Imported',
        `${count} contacts have been added to your Connect Hub.`
      );
    } else {
      showToast('All contacts already exist in directory.', 'info');
    }
    return count;
  };

  // Filtered & Sorted Contacts
  const filteredContacts = useMemo(() => {
    let list = [...contacts];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c => {
        const name = (c.fullName || c.name || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const city = (c.city || '').toLowerCase();
        const comp = (c.company || '').toLowerCase();
        const job = (c.jobTitle || '').toLowerCase();
        const notes = (c.notes || '').toLowerCase();
        const tags = Array.isArray(c.tags) ? c.tags.join(' ').toLowerCase() : '';

        return name.includes(q) || phone.includes(q) || email.includes(q) ||
               city.includes(q) || comp.includes(q) || job.includes(q) ||
               notes.includes(q) || tags.includes(q);
      });
    }

    // Category Filter
    if (selectedCategory !== 'all') {
      list = list.filter(c => (c.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    // Only Favorites Filter
    if (onlyFavorites) {
      list = list.filter(c => Boolean(c.favorite));
    }

    // Sorting
    list.sort((a, b) => {
      if (selectedSort === 'favorites') {
        const favA = a.favorite ? 1 : 0;
        const favB = b.favorite ? 1 : 0;
        if (favA !== favB) return favB - favA;
        return (a.fullName || '').localeCompare(b.fullName || '');
      } else if (selectedSort === 'name-asc') {
        return (a.fullName || '').localeCompare(b.fullName || '');
      } else if (selectedSort === 'name-desc') {
        return (b.fullName || '').localeCompare(a.fullName || '');
      } else if (selectedSort === 'recent') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (selectedSort === 'updated') {
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      }
      return 0;
    });

    return list;
  }, [contacts, searchQuery, selectedCategory, selectedSort, onlyFavorites]);

  // Stats
  const stats = useMemo(() => {
    const total = contacts.length;
    const favorites = contacts.filter(c => c.favorite).length;
    const emergency = contacts.filter(c => c.isEmergency).length;
    const withEmail = contacts.filter(c => c.email).length;
    const withAddress = contacts.filter(c => c.address || c.city).length;

    return { total, favorites, emergency, withEmail, withAddress };
  }, [contacts]);

  // Auth Functions
  const loginUser = async (email, name = '') => {
    const userObj = {
      id: `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: name || email.split('@')[0],
      email: email.toLowerCase().trim(),
      provider: 'cloud_email',
      lastSync: new Date().toISOString()
    };
    setCurrentUser(userObj);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(userObj));
    } catch (e) {}
    showToast(`Signed in as ${userObj.name}`, 'success');
    await syncWithCloud();
  };

  const logoutUser = async () => {
    const guestObj = {
      id: 'usr_guest_primary',
      name: 'Local Guest Vault',
      email: 'guest@connecthub.local',
      provider: 'local_vault',
      lastSync: new Date().toISOString()
    };
    setCurrentUser(guestObj);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(guestObj));
    } catch (e) {}
    showToast('Signed out to Local Guest Vault.', 'info');
  };

  return (
    <ContactContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        isCloudConnected,
        isSyncing,
        syncWithCloud,
        contacts,
        filteredContacts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSort,
        setSelectedSort,
        onlyFavorites,
        setOnlyFavorites,
        addContact,
        updateContact,
        deleteContact,
        toggleFavorite,
        importContactsBatch,
        stats,
        toast,
        showToast
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
