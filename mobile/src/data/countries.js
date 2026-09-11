/**
 * Global Countries and Dialing Codes Dataset for Mobile
 * Supports ISO-3166 alpha-2, international dial codes, flag emojis, and primary currencies
 */

export const COUNTRIES = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', currency: 'INR', symbol: '₹', format: 'XXXXX XXXXX' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', currency: 'USD', symbol: '$', format: '(XXX) XXX-XXXX' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', currency: 'GBP', symbol: '£', format: 'XXXX XXXXXX' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', currency: 'CAD', symbol: 'CA$', format: '(XXX) XXX-XXXX' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', currency: 'AUD', symbol: 'A$', format: 'XXXX XXX XXX' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', currency: 'AED', symbol: 'د.إ', format: 'XX XXX XXXX' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', currency: 'EUR', symbol: '€', format: 'XXXX XXXXXXX' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', currency: 'EUR', symbol: '€', format: 'X XX XX XX XX' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', currency: 'JPY', symbol: '¥', format: 'XX XXXX XXXX' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', currency: 'SGD', symbol: 'S$', format: 'XXXX XXXX' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', currency: 'NZD', symbol: 'NZ$', format: 'XX XXX XXXX' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', currency: 'ZAR', symbol: 'R', format: 'XX XXX XXXX' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', currency: 'BRL', symbol: 'R$', format: '(XX) XXXXX-XXXX' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', currency: 'EUR', symbol: '€', format: 'XXX XXX XXXX' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', currency: 'EUR', symbol: '€', format: 'XXX XX XX XX' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', currency: 'EUR', symbol: '€', format: 'X XX XX XX XX' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', currency: 'CHF', symbol: 'CHF', format: 'XX XXX XX XX' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', currency: 'SEK', symbol: 'kr', format: 'XX-XXX XX XX' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', currency: 'MYR', symbol: 'RM', format: 'XX-XXX XXXX' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', currency: 'IDR', symbol: 'Rp', format: 'XXX-XXXX-XXXX' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', currency: 'PHP', symbol: '₱', format: 'XXX XXX XXXX' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', currency: 'SAR', symbol: '﷼', format: 'XX XXX XXXX' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', currency: 'QAR', symbol: '﷼', format: 'XXXX XXXX' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', currency: 'OMR', symbol: '﷼', format: 'XXXX XXXX' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', currency: 'KWD', symbol: 'KD', format: 'XXXX XXXX' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', currency: 'BHD', symbol: 'BD', format: 'XXXX XXXX' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', currency: 'EGP', symbol: 'E£', format: 'XXX XXX XXXX' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', currency: 'NGN', symbol: '₦', format: 'XXX XXX XXXX' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', currency: 'KES', symbol: 'KSh', format: 'XXX XXXXXX' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰', currency: 'LKR', symbol: 'Rs', format: 'XX XXX XXXX' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵', currency: 'NPR', symbol: 'Rs', format: 'XX-XXXXXXX' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', currency: 'BDT', symbol: '৳', format: 'XXXX-XXXXXX' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', currency: 'MXN', symbol: '$', format: 'XXX XXX XXXX' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', currency: 'ARS', symbol: '$', format: 'XX XXXX-XXXX' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', currency: 'EUR', symbol: '€', format: 'XX XXX XXXX' }
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // India (+91)

export const findCountryByDialCode = (dialCode) => {
  if (!dialCode) return DEFAULT_COUNTRY;
  const clean = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  return COUNTRIES.find(c => c.dialCode === clean) || DEFAULT_COUNTRY;
};

export const findCountryByCode = (code) => {
  if (!code) return DEFAULT_COUNTRY;
  return COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase()) || DEFAULT_COUNTRY;
};

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' }
];

export const DATE_FORMATS = [
  { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY (India, UK, Europe, Global)', example: '10/09/2026' },
  { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY (United States)', example: '09/10/2026' },
  { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO 8601 International)', example: '2026-09-10' },
  { id: 'DD-MMM-YYYY', label: 'DD-MMM-YYYY (e.g. 10-Sep-2026)', example: '10-Sep-2026' }
];

export const TIMEZONES = [
  { id: 'Asia/Kolkata', label: 'India Standard Time (IST, UTC+5:30)' },
  { id: 'America/New_York', label: 'Eastern Time (US & Canada, UTC-5)' },
  { id: 'America/Chicago', label: 'Central Time (US & Canada, UTC-6)' },
  { id: 'America/Los_Angeles', label: 'Pacific Time (US & Canada, UTC-8)' },
  { id: 'Europe/London', label: 'London, Edinburgh, Dublin (GMT/BST, UTC+0)' },
  { id: 'Europe/Paris', label: 'Paris, Berlin, Rome, Madrid (CET, UTC+1)' },
  { id: 'Asia/Dubai', label: 'Dubai, Abu Dhabi, Muscat (GST, UTC+4)' },
  { id: 'Asia/Singapore', label: 'Singapore, Kuala Lumpur (SGT, UTC+8)' },
  { id: 'Asia/Tokyo', label: 'Tokyo, Osaka (JST, UTC+9)' },
  { id: 'Australia/Sydney', label: 'Sydney, Melbourne (AEST, UTC+10)' }
];
