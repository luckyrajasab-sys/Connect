import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { LANGUAGES, getTranslation } from '../locales';
import { COUNTRIES, CURRENCIES, DATE_FORMATS, TIMEZONES } from '../data/countries';

const I18nContext = createContext();

const I18N_STORAGE_KEYS = {
  LANGUAGE: 'connect_mobile_i18n_lang',
  CURRENCY: 'connect_mobile_i18n_currency',
  DATE_FORMAT: 'connect_mobile_i18n_date_format',
};

export const I18nProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [currency, setCurrencyState] = useState('INR');
  const [dateFormat, setDateFormatState] = useState('DD/MM/YYYY');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(I18N_STORAGE_KEYS.LANGUAGE);
        if (savedLang && LANGUAGES.some(l => l.code === savedLang)) {
          setLanguageState(savedLang);
        }
        const savedCurrency = await AsyncStorage.getItem(I18N_STORAGE_KEYS.CURRENCY);
        if (savedCurrency) setCurrencyState(savedCurrency);
      } catch (e) {
      } finally {
        setIsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  const currentLangObj = useMemo(() => {
    return LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  }, [language]);

  const isRTL = Boolean(currentLangObj.isRTL);

  const setLanguage = async (langCode) => {
    if (LANGUAGES.some(l => l.code === langCode)) {
      setLanguageState(langCode);
      const targetLang = LANGUAGES.find(l => l.code === langCode);
      try {
        await AsyncStorage.setItem(I18N_STORAGE_KEYS.LANGUAGE, langCode);
      } catch (e) {}
    }
  };

  const t = useCallback((key, fallback = '') => {
    return getTranslation(language, key, fallback);
  }, [language]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  }, []);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t,
        currentLangObj,
        LANGUAGES,
        currency,
        setCurrency: setCurrencyState,
        CURRENCIES,
        dateFormat,
        setDateFormat: setDateFormatState,
        formatDate,
        COUNTRIES
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
