import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LANGUAGES, getTranslation } from '../locales';
import { COUNTRIES, CURRENCIES, DATE_FORMATS, TIMEZONES } from '../data/countries';

const I18nContext = createContext();

const I18N_STORAGE_KEYS = {
  LANGUAGE: 'connect_i18n_lang_v1',
  CURRENCY: 'connect_i18n_currency_v1',
  TIMEZONE: 'connect_i18n_timezone_v1',
  DATE_FORMAT: 'connect_i18n_date_format_v1',
  COUNTRY: 'connect_i18n_country_v1'
};

export const I18nProvider = ({ children }) => {
  // Detect Initial Browser Language
  const getInitialLang = () => {
    try {
      const saved = localStorage.getItem(I18N_STORAGE_KEYS.LANGUAGE);
      if (saved && LANGUAGES.some(l => l.code === saved)) return saved;
      const browserLang = navigator.language?.split('-')[0];
      if (browserLang && LANGUAGES.some(l => l.code === browserLang)) return browserLang;
    } catch (e) {}
    return 'en';
  };

  const [language, setLanguageState] = useState(getInitialLang);
  const [currency, setCurrencyState] = useState(() => {
    try {
      return localStorage.getItem(I18N_STORAGE_KEYS.CURRENCY) || 'INR';
    } catch (e) {
      return 'INR';
    }
  });

  const [timezone, setTimezoneState] = useState(() => {
    try {
      return localStorage.getItem(I18N_STORAGE_KEYS.TIMEZONE) || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    } catch (e) {
      return 'Asia/Kolkata';
    }
  });

  const [dateFormat, setDateFormatState] = useState(() => {
    try {
      return localStorage.getItem(I18N_STORAGE_KEYS.DATE_FORMAT) || 'DD/MM/YYYY';
    } catch (e) {
      return 'DD/MM/YYYY';
    }
  });

  const [countryCode, setCountryCodeState] = useState(() => {
    try {
      return localStorage.getItem(I18N_STORAGE_KEYS.COUNTRY) || 'IN';
    } catch (e) {
      return 'IN';
    }
  });

  // Current Language Object
  const currentLangObj = useMemo(() => {
    return LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  }, [language]);

  const dir = currentLangObj.isRTL ? 'rtl' : 'ltr';

  // Apply Language & Direction to Document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', dir);
      if (dir === 'rtl') {
        document.body.classList.add('rtl-layout');
      } else {
        document.body.classList.remove('rtl-layout');
      }
    }
    try {
      localStorage.setItem(I18N_STORAGE_KEYS.LANGUAGE, language);
    } catch (e) {}
  }, [language, dir]);

  const setLanguage = (langCode) => {
    if (LANGUAGES.some(l => l.code === langCode)) {
      setLanguageState(langCode);
    }
  };

  const setCurrency = (curr) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem(I18N_STORAGE_KEYS.CURRENCY, curr);
    } catch (e) {}
  };

  const setTimezone = (tz) => {
    setTimezoneState(tz);
    try {
      localStorage.setItem(I18N_STORAGE_KEYS.TIMEZONE, tz);
    } catch (e) {}
  };

  const setDateFormat = (df) => {
    setDateFormatState(df);
    try {
      localStorage.setItem(I18N_STORAGE_KEYS.DATE_FORMAT, df);
    } catch (e) {}
  };

  const setCountryCode = (cc) => {
    setCountryCodeState(cc);
    try {
      localStorage.setItem(I18N_STORAGE_KEYS.COUNTRY, cc);
    } catch (e) {}
  };

  // Translation function
  const t = useCallback((key, fallback = '') => {
    return getTranslation(language, key, fallback);
  }, [language]);

  // Date Formatter respecting user settings
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[date.getMonth()];

      if (dateFormat === 'MM/DD/YYYY') {
        return `${month}/${day}/${year}`;
      } else if (dateFormat === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
      } else if (dateFormat === 'DD-MMM-YYYY') {
        return `${day}-${monthName}-${year}`;
      }
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  }, [dateFormat]);

  // Currency Formatter
  const formatCurrencyValue = useCallback((amount) => {
    const currObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
    const num = Number(amount) || 0;
    return `${currObj.symbol} ${num.toLocaleString(language === 'hi' ? 'en-IN' : 'en-US')}`;
  }, [currency, language]);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        isRTL: dir === 'rtl',
        t,
        currentLangObj,
        LANGUAGES,
        currency,
        setCurrency,
        CURRENCIES,
        formatCurrencyValue,
        timezone,
        setTimezone,
        TIMEZONES,
        dateFormat,
        setDateFormat,
        DATE_FORMATS,
        formatDate,
        countryCode,
        setCountryCode,
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
