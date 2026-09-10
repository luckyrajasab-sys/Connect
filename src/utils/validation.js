// Validation Utilities for Indian Mobile, Pincode, Email, and Contact Data

/**
 * Validates full name: required and >= 2 chars
 */
export const validateFullName = (name) => {
  if (!name || typeof name !== 'string') return "Full name is required";
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return "Name can only contain letters, spaces, and standard punctuation";
  return null;
};

/**
 * Cleans phone string to 10 raw digits (removes +91, spaces, hyphens, leading 0)
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
  return digits.slice(0, 10);
};

/**
 * Validates 10-digit Indian Mobile Number
 * Must start with 6, 7, 8, or 9 and have exactly 10 digits
 */
export const validateIndianPhone = (phone) => {
  if (!phone) return "Indian mobile number is required";
  const digits = cleanPhoneDigits(phone);
  if (digits.length === 0) return "Mobile number cannot be empty";
  if (digits.length !== 10) return "Please enter a complete 10-digit mobile number";
  if (!/^[6-9]/.test(digits)) return "Valid Indian mobile numbers must start with 6, 7, 8, or 9";
  return null;
};

/**
 * Formats a 10-digit string into +91 98765 43210
 */
export const formatIndianPhone = (phone) => {
  const digits = cleanPhoneDigits(phone);
  if (!digits) return "+91 ";
  if (digits.length <= 5) {
    return `+91 ${digits}`;
  }
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
};

/**
 * Validates Email Address (optional or valid format)
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === "") return null; // optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Please enter a valid email address (e.g. name@domain.in)";
  return null;
};

/**
 * Validates Indian PIN code (6 digits, first digit between 1-9)
 */
export const validatePincode = (pincode) => {
  if (!pincode || pincode.trim() === "") return null; // optional
  const clean = pincode.replace(/\D/g, "");
  if (clean.length !== 6) return "Indian PIN Code must be exactly 6 digits";
  if (clean.startsWith("0")) return "PIN Code cannot start with 0";
  return null;
};

/**
 * Comprehensive Contact Form Validation
 */
export const validateContactForm = (formData) => {
  const errors = {};

  const nameError = validateFullName(formData.fullName);
  if (nameError) errors.fullName = nameError;

  const phoneError = validateIndianPhone(formData.phone);
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
