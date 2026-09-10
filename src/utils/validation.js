// Validation Utilities for Global & Indian Mobile, Pincode, Email, and Contact Data

/**
 * Validates full name: required and >= 1 char, supports any language / Unicode
 */
export const validateFullName = (name) => {
  if (!name || typeof name !== 'string' || !name.trim()) return "Full name is required";
  const trimmed = name.trim();
  if (trimmed.length < 1) return "Name cannot be empty";
  return null;
};

/**
 * Cleans phone string to raw digits
 */
export const cleanPhoneDigits = (input) => {
  if (!input) return "";
  let digits = String(input).replace(/\D/g, "");
  // If starts with 91 and has 12 digits, strip 91
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  // If starts with 0 and has 11 digits, strip 0
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
};

/**
 * Validates Phone Number (Indian or International)
 */
export const validateIndianPhone = (phone, countryCode = 'IN') => {
  if (!phone || !String(phone).trim()) return "Phone number is required";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length < 4) return "Please enter a valid phone number (at least 4 digits)";
  if (countryCode === 'IN' && digits.length > 5 && digits.length < 10) {
    return "Indian phone numbers are typically 10 digits";
  }
  return null;
};

/**
 * Formats a phone string into clean display format
 */
export const formatIndianPhone = (phone) => {
  if (!phone) return "";
  const clean = String(phone).trim();
  const digits = clean.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return clean.startsWith('+') ? clean : `+${clean}`;
};

/**
 * Validates Email Address (optional or valid format)
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === "") return null; // optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Please enter a valid email address (e.g. name@domain.com)";
  return null;
};

/**
 * Validates Global Postal / PIN code (optional)
 */
export const validatePincode = (pincode) => {
  if (!pincode || pincode.trim() === "") return null; // optional
  const clean = pincode.trim();
  if (clean.length < 3) return "Postal code should have at least 3 characters";
  return null;
};

/**
 * Comprehensive Contact Form Validation
 */
export const validateContactForm = (formData) => {
  const errors = {};

  const nameError = validateFullName(formData.fullName);
  if (nameError) errors.fullName = nameError;

  const phoneError = validateIndianPhone(formData.phone, formData.countryCode);
  if (phoneError) errors.phone = phoneError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const pincodeError = validatePincode(formData.pincode);
  if (pincodeError) errors.pincode = pincodeError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates imported JSON data for backup restore
 */
export const validateImportedData = (data) => {
  if (!data) return { valid: false, message: "Empty file or invalid JSON content" };
  
  // Can be an array of contacts or a full backup object
  let contactsToValidate = [];
  if (Array.isArray(data)) {
    contactsToValidate = data;
  } else if (data.contacts && Array.isArray(data.contacts)) {
    contactsToValidate = data.contacts;
  } else {
    return { valid: false, message: "JSON must contain an array of contacts or a valid Vcontacts backup structure" };
  }

  if (contactsToValidate.length === 0) {
    return { valid: false, message: "No contacts found in this file" };
  }

  // Basic check on records
  const validContacts = contactsToValidate.filter(c => c && c.fullName && (c.phone || c.mobile));
  if (validContacts.length === 0) {
    return { valid: false, message: "Contacts in the file are missing essential fields (Full Name or Phone Number)" };
  }

  return {
    valid: true,
    contacts: validContacts,
    count: validContacts.length
  };
};
