import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Connect Cloud Database & Auth Service for Mobile
 * Directly compatible with the web app's Supabase backend schema
 * Includes AsyncStorage fallback for 100% offline-first resilience
 */

// Default Cloud Config
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

const isCloudConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const cloudFetch = async (endpoint, options = {}, token = null) => {
  if (!isCloudConfigured) return null;
  const url = `${SUPABASE_URL.replace(/\/$/, '')}${endpoint}`;
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...(token ? { 'Authorization': `Bearer ${token}` } : { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.msg || errorData.message || `Cloud Error: ${response.status}`);
  }

  return response.json().catch(() => null);
};

const getLocalKey = (prefix, userId) => `connect_mobile_vault_${prefix}_${userId}`;

export const cloudDb = {
  isConfigured: isCloudConfigured,

  async checkConnection() {
    if (!isCloudConfigured) {
      return { connected: false, mode: 'local_secure_vault', message: 'Offline Local Secure Storage' };
    }
    try {
      await cloudFetch('/rest/v1/', { method: 'GET' });
      return { connected: true, mode: 'supabase_postgres', message: 'Connected to Cloud PostgreSQL' };
    } catch (err) {
      return { connected: false, mode: 'offline_cache', message: err.message };
    }
  },

  async getContacts(userId, token = null) {
    if (!userId) return [];

    if (isCloudConfigured) {
      try {
        const data = await cloudFetch(
          `/rest/v1/contacts?user_id=eq.${encodeURIComponent(userId)}&order=updated_at.desc`,
          { method: 'GET' },
          token
        );
        if (Array.isArray(data)) {
          const normalized = data.map(item => ({
            id: item.id,
            userId: item.user_id,
            fullName: item.full_name || item.name,
            phone: item.phone || '',
            email: item.email || '',
            company: item.company || '',
            jobTitle: item.job_title || '',
            address: item.address || '',
            city: item.city || '',
            state: item.state || '',
            pincode: item.pincode || '',
            birthday: item.birthday || '',
            notes: item.notes || '',
            category: item.category || 'Personal',
            favorite: Boolean(item.favorite),
            avatar: item.avatar || '',
            latitude: item.latitude || null,
            longitude: item.longitude || null,
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }));

          // Cache locally in AsyncStorage
          try {
            await AsyncStorage.setItem(getLocalKey('contacts', userId), JSON.stringify(normalized));
          } catch (e) {}

          return normalized;
        }
      } catch (err) {
        console.warn('Cloud fetch deferred, using AsyncStorage:', err.message);
      }
    }

    // Retrieve from local AsyncStorage cache
    try {
      const cached = await AsyncStorage.getItem(getLocalKey('contacts', userId));
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}

    return [];
  },

  async createContact(userId, contactData, token = null) {
    const contactId = contactData.id || `c_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const dbRecord = {
      id: contactId,
      user_id: userId,
      full_name: contactData.fullName || contactData.name || 'Unnamed Contact',
      phone: contactData.phone || '',
      email: contactData.email || '',
      company: contactData.company || '',
      job_title: contactData.jobTitle || '',
      address: contactData.address || '',
      city: contactData.city || '',
      state: contactData.state || '',
      pincode: contactData.pincode || '',
      birthday: contactData.birthday || '',
      notes: contactData.notes || '',
      category: contactData.category || 'Personal',
      favorite: Boolean(contactData.favorite || contactData.isFavorite),
      avatar: contactData.avatar || '',
      latitude: contactData.latitude || null,
      longitude: contactData.longitude || null,
      created_at: now,
      updated_at: now
    };

    if (isCloudConfigured) {
      try {
        await cloudFetch('/rest/v1/contacts', {
          method: 'POST',
          body: JSON.stringify(dbRecord)
        }, token);
      } catch (err) {
        console.warn('Cloud contact creation deferred:', err.message);
      }
    }

    const appContact = {
      ...contactData,
      id: contactId,
      userId: userId,
      createdAt: now,
      updatedAt: now
    };

    // Save to local AsyncStorage cache
    try {
      const key = getLocalKey('contacts', userId);
      const existing = JSON.parse(await AsyncStorage.getItem(key) || '[]');
      const updated = [appContact, ...existing.filter(c => c.id !== contactId)];
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {}

    return appContact;
  },

  async updateContact(userId, contactId, contactData, token = null) {
    const now = new Date().toISOString();

    const dbRecord = {
      full_name: contactData.fullName || contactData.name,
      phone: contactData.phone,
      email: contactData.email,
      company: contactData.company,
      job_title: contactData.jobTitle,
      address: contactData.address,
      city: contactData.city,
      state: contactData.state,
      pincode: contactData.pincode,
      birthday: contactData.birthday,
      notes: contactData.notes,
      category: contactData.category || contactData.group || 'Personal',
      favorite: Boolean(contactData.favorite || contactData.isFavorite),
      avatar: contactData.avatar,
      updated_at: now
    };

    if (isCloudConfigured) {
      try {
        await cloudFetch(
          `/rest/v1/contacts?id=eq.${encodeURIComponent(contactId)}&user_id=eq.${encodeURIComponent(userId)}`,
          {
            method: 'PATCH',
            body: JSON.stringify(dbRecord)
          },
          token
        );
      } catch (err) {
        console.warn('Cloud contact update deferred:', err.message);
      }
    }

    const updatedContact = {
      ...contactData,
      id: contactId,
      userId: userId,
      updatedAt: now
    };

    // Update local cache
    try {
      const key = getLocalKey('contacts', userId);
      const existing = JSON.parse(await AsyncStorage.getItem(key) || '[]');
      const index = existing.findIndex(c => c.id === contactId);
      if (index !== -1) {
        existing[index] = { ...existing[index], ...updatedContact };
      } else {
        existing.unshift(updatedContact);
      }
      await AsyncStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {}

    return updatedContact;
  },

  async deleteContact(userId, contactId, token = null) {
    if (isCloudConfigured) {
      try {
        await cloudFetch(
          `/rest/v1/contacts?id=eq.${encodeURIComponent(contactId)}&user_id=eq.${encodeURIComponent(userId)}`,
          { method: 'DELETE' },
          token
        );
      } catch (err) {
        console.warn('Cloud contact delete deferred:', err.message);
      }
    }

    try {
      const key = getLocalKey('contacts', userId);
      const existing = JSON.parse(await AsyncStorage.getItem(key) || '[]');
      const filtered = existing.filter(c => c.id !== contactId);
      await AsyncStorage.setItem(key, JSON.stringify(filtered));
    } catch (e) {}
  },

  async syncUserProfile(user) {
    if (!user || !user.id) return null;
    const payload = {
      id: user.id,
      name: user.name || user.fullName || 'User',
      email: user.email,
      avatar: user.avatar || '',
      provider: user.provider || 'email',
      updated_at: new Date().toISOString()
    };

    if (isCloudConfigured) {
      try {
        await cloudFetch('/rest/v1/profiles', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify(payload)
        }, user.token);
      } catch (err) {
        console.warn('Cloud profile sync deferred:', err.message);
      }
    }

    try {
      await AsyncStorage.setItem(getLocalKey('profile', user.id), JSON.stringify(payload));
    } catch (e) {}

    return payload;
  }
};
