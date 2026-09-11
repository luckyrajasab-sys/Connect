// Input Sanitization & Validation Helpers

export const cleanPhoneDigits = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const digits = cleanPhoneDigits(phone);
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
};

export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase().trim());
};
