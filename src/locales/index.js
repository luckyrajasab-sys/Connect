import en from './en';
import hi from './hi';
import ta from './ta';
import te from './te';
import kn from './kn';
import ml from './ml';
import es from './es';
import fr from './fr';
import de from './de';
import ar from './ar';
import ja from './ja';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐', isRTL: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', isRTL: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', isRTL: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', isRTL: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', isRTL: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', isRTL: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isRTL: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isRTL: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', isRTL: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isRTL: false }
];

const dictionaries = {
  en,
  hi,
  ta,
  te,
  kn,
  ml,
  es,
  fr,
  de,
  ar,
  ja
};

export const getTranslation = (langCode, key, fallback = '') => {
  const dict = dictionaries[langCode] || dictionaries['en'] || {};
  if (dict[key]) return dict[key];
  if (dictionaries['en'] && dictionaries['en'][key]) return dictionaries['en'][key];
  return fallback || key;
};

export default dictionaries;
