/**
 * vCard 3.0 Service for Mobile
 * Generates and parses standard compliant vCard text for QR codes & .vcf export
 */

export const generateVCard = (contact) => {
  if (!contact) return '';

  const cleanPhone = (contact.phone || '').replace(/\D/g, '');
  const cleanAltPhone = (contact.alternatePhone || '').replace(/\D/g, '');
  const displayName = contact.fullName || contact.name || 'Contact';

  let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${displayName}\r\n`;

  const parts = displayName.split(' ');
  const lastName = parts.length > 1 ? parts.pop() : '';
  const firstName = parts.join(' ');
  vcard += `N:${lastName};${firstName};;;\r\n`;

  if (contact.phone) {
    vcard += `TEL;TYPE=CELL,VOICE:${contact.phone}\r\n`;
  }

  if (contact.alternatePhone) {
    vcard += `TEL;TYPE=WORK,VOICE:${contact.alternatePhone}\r\n`;
  }

  if (contact.email) {
    vcard += `EMAIL;TYPE=PREF,INTERNET:${contact.email}\r\n`;
  }

  if (contact.company || contact.jobTitle) {
    if (contact.company) vcard += `ORG:${contact.company}\r\n`;
    if (contact.jobTitle) vcard += `TITLE:${contact.jobTitle}\r\n`;
  }

  if (contact.address || contact.city || contact.state || contact.pincode) {
    vcard += `ADR;TYPE=HOME:;;${contact.address || ''};${contact.city || ''};${contact.state || ''};${contact.pincode || ''};${contact.country || 'India'}\r\n`;
  }

  if (contact.birthday) {
    vcard += `BDAY:${contact.birthday}\r\n`;
  }

  if (contact.website) {
    vcard += `URL:${contact.website}\r\n`;
  }

  if (contact.category || contact.group) {
    vcard += `CATEGORIES:${contact.category || contact.group}\r\n`;
  }

  if (contact.notes) {
    vcard += `NOTE:${contact.notes.replace(/\r?\n/g, '\\n')}\r\n`;
  }

  vcard += `END:VCARD\r\n`;
  return vcard;
};

export const parseVCard = (vcardText) => {
  if (!vcardText || typeof vcardText !== 'string') return null;

  const contact = {
    fullName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    company: '',
    jobTitle: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    birthday: '',
    website: '',
    notes: '',
    category: 'Friends',
    favorite: false,
    tags: []
  };

  const lines = vcardText.split(/\r?\n/);
  let isVCard = false;

  lines.forEach(line => {
    const cleanLine = line.trim();
    if (!cleanLine) return;

    if (/^BEGIN:VCARD/i.test(cleanLine)) {
      isVCard = true;
      return;
    }
    if (/^END:VCARD/i.test(cleanLine)) return;

    if (/^FN:/i.test(cleanLine)) {
      contact.fullName = cleanLine.replace(/^FN:/i, '').trim();
    } else if (/^N:/i.test(cleanLine) && !contact.fullName) {
      const parts = cleanLine.replace(/^N:/i, '').split(';').filter(Boolean);
      contact.fullName = parts.reverse().join(' ').trim();
    } else if (/^TEL[;:].*/i.test(cleanLine)) {
      const val = cleanLine.split(/:(.+)/)[1]?.trim();
      if (val) {
        if (!contact.phone) {
          contact.phone = val;
        } else if (!contact.alternatePhone) {
          contact.alternatePhone = val;
        }
      }
    } else if (/^EMAIL[;:].*/i.test(cleanLine)) {
      contact.email = cleanLine.split(/:(.+)/)[1]?.trim() || '';
    } else if (/^ORG:/i.test(cleanLine)) {
      contact.company = cleanLine.replace(/^ORG:/i, '').trim();
    } else if (/^TITLE:/i.test(cleanLine)) {
      contact.jobTitle = cleanLine.replace(/^TITLE:/i, '').trim();
    } else if (/^ADR[;:].*/i.test(cleanLine)) {
      const adrVal = cleanLine.split(/:(.+)/)[1] || '';
      const parts = adrVal.split(';');
      if (parts[2]) contact.address = parts[2].trim();
      if (parts[3]) contact.city = parts[3].trim();
      if (parts[4]) contact.state = parts[4].trim();
      if (parts[5]) contact.pincode = parts[5].trim();
    } else if (/^BDAY:/i.test(cleanLine)) {
      contact.birthday = cleanLine.replace(/^BDAY:/i, '').trim();
    } else if (/^URL:/i.test(cleanLine)) {
      contact.website = cleanLine.replace(/^URL:/i, '').trim();
    } else if (/^NOTE:/i.test(cleanLine)) {
      contact.notes = cleanLine.replace(/^NOTE:/i, '').replace(/\\n/g, '\n').trim();
    } else if (/^CATEGORIES:/i.test(cleanLine)) {
      contact.category = cleanLine.replace(/^CATEGORIES:/i, '').trim() || 'Friends';
    }
  });

  return isVCard && (contact.fullName || contact.phone || contact.email) ? contact : null;
};
