import en from './en';
import hi from './hi';
import ar from './ar';
import es from './es';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐', isRTL: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', isRTL: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isRTL: false }
];

const dictionaries = {
  en,
  hi,
  ar,
  es
};

export const getTranslation = (langCode, key, fallback = '') => {
  const dict = dictionaries[langCode] || dictionaries['en'] || {};
  if (dict[key]) return dict[key];
  if (dictionaries['en'] && dictionaries['en'][key]) return dictionaries['en'][key];
  return fallback || key;
};

export default dictionaries;
