// vCard & CSV Generation / Parsing Engine

export const generateVCardString = (contact) => {
  let cleanPhone = (contact.phone || '').replace(/\D/g, '');
  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    cleanPhone = cleanPhone.slice(2);
  }
  let cleanAltPhone = (contact.alternatePhone || '').replace(/\D/g, '');
  if (cleanAltPhone.startsWith('91') && cleanAltPhone.length === 12) {
    cleanAltPhone = cleanAltPhone.slice(2);
  }

  let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${contact.fullName || 'Contact'}\r\n`;

  if (contact.fullName) {
    const parts = contact.fullName.split(' ');
    const lastName = parts.length > 1 ? parts.pop() : '';
    const firstName = parts.join(' ');
    vcard += `N:${lastName};${firstName};;;\r\n`;
  }

  if (cleanPhone) {
    vcard += `TEL;TYPE=CELL,VOICE:+91${cleanPhone}\r\n`;
  }

  if (cleanAltPhone) {
    vcard += `TEL;TYPE=WORK,VOICE:+91${cleanAltPhone}\r\n`;
  }

  if (contact.email) {
    vcard += `EMAIL;TYPE=PREF,INTERNET:${contact.email}\r\n`;
  }

  if (contact.company || contact.jobTitle) {
    if (contact.company) vcard += `ORG:${contact.company}\r\n`;
    if (contact.jobTitle) vcard += `TITLE:${contact.jobTitle}\r\n`;
  }

  if (contact.address || contact.city || contact.state || contact.pincode) {
    vcard += `ADR;TYPE=HOME:;;${contact.address || ''};${contact.city || ''};${contact.state || ''};${contact.pincode || ''};India\r\n`;
  }

  if (contact.birthday) {
    vcard += `BDAY:${contact.birthday}\r\n`;
  }

  if (contact.website) {
    vcard += `URL:${contact.website}\r\n`;
  }

  if (contact.group) {
    vcard += `CATEGORIES:${contact.group}\r\n`;
  }

  if (contact.notes) {
    vcard += `NOTE:${contact.notes.replace(/\r?\n/g, '\\n')}\r\n`;
  }

  vcard += `END:VCARD\r\n`;
  return vcard;
};

export const parseVCardString = (vcardText) => {
  const contacts = [];
  const cards = vcardText.split(/BEGIN:VCARD/i).slice(1);

  cards.forEach(card => {
    const lines = card.split(/\r?\n/);
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
      group: 'friends',
      isFavorite: false
    };

    lines.forEach(line => {
      const cleanLine = line.trim();
      if (!cleanLine || cleanLine.startsWith('END:VCARD')) return;

      if (/^FN:/i.test(cleanLine)) {
        contact.fullName = cleanLine.replace(/^FN:/i, '').trim();
      } else if (/^TEL[;:].*/i.test(cleanLine)) {
        const phoneMatch = cleanLine.match(/[:](\+?[0-9\s\-()]+)$/);
        if (phoneMatch) {
          const digits = phoneMatch[1].replace(/\D/g, '').slice(-10);
          if (!contact.phone) {
            contact.phone = digits;
          } else if (!contact.alternatePhone) {
            contact.alternatePhone = digits;
          }
        }
      } else if (/^EMAIL[;:].*/i.test(cleanLine)) {
        const emailMatch = cleanLine.match(/[:]([^\s]+)$/);
        if (emailMatch) contact.email = emailMatch[1].trim();
      } else if (/^ORG:/i.test(cleanLine)) {
        contact.company = cleanLine.replace(/^ORG:/i, '').trim();
      } else if (/^TITLE:/i.test(cleanLine)) {
        contact.jobTitle = cleanLine.replace(/^TITLE:/i, '').trim();
      } else if (/^URL:/i.test(cleanLine)) {
        contact.website = cleanLine.replace(/^URL:/i, '').trim();
      } else if (/^BDAY:/i.test(cleanLine)) {
        contact.birthday = cleanLine.replace(/^BDAY:/i, '').trim();
      } else if (/^NOTE:/i.test(cleanLine)) {
        contact.notes = cleanLine.replace(/^NOTE:/i, '').replace(/\\n/g, '\n').trim();
      } else if (/^ADR[;:].*/i.test(cleanLine)) {
        const parts = cleanLine.split(':').slice(1).join(':').split(';');
        if (parts.length >= 6) {
          contact.address = parts[2] || '';
          contact.city = parts[3] || '';
          contact.state = parts[4] || '';
          contact.pincode = parts[5] || '';
        }
      } else if (/^CATEGORIES:/i.test(cleanLine)) {
        const cat = cleanLine.replace(/^CATEGORIES:/i, '').trim().toLowerCase();
        contact.group = cat || 'friends';
      }
    });

    if (contact.fullName || contact.phone) {
      contacts.push(contact);
    }
  });

  return contacts;
};

export const exportToCSV = (contacts) => {
  const headers = ['Full Name', 'Phone', 'Alt Phone', 'Email', 'Company', 'Job Title', 'Address', 'City', 'State', 'PIN Code', 'Birthday', 'Website', 'Category', 'Favorite', 'Emergency', 'Notes'];

  const rows = contacts.map(c => [
    `"${(c.fullName || '').replace(/"/g, '""')}"`,
    `"${(c.phone || '').replace(/"/g, '""')}"`,
    `"${(c.alternatePhone || '').replace(/"/g, '""')}"`,
    `"${(c.email || '').replace(/"/g, '""')}"`,
    `"${(c.company || '').replace(/"/g, '""')}"`,
    `"${(c.jobTitle || '').replace(/"/g, '""')}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    `"${(c.city || '').replace(/"/g, '""')}"`,
    `"${(c.state || '').replace(/"/g, '""')}"`,
    `"${(c.pincode || '').replace(/"/g, '""')}"`,
    `"${(c.birthday || '').replace(/"/g, '""')}"`,
    `"${(c.website || '').replace(/"/g, '""')}"`,
    `"${(c.group || '').replace(/"/g, '""')}"`,
    `"${c.isFavorite ? 'Yes' : 'No'}"`,
    `"${c.isEmergency ? 'Yes' : 'No'}"`,
    `"${(c.notes || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
};

export const parseCSVString = (csvText) => {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const parseRow = (line) => {
    const values = [];
    let insideQuotes = false;
    let currentValue = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          currentValue += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    return values;
  };

  const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/[^a-z]/g, ''));
  const parsedContacts = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseRow(lines[i]);
    if (row.length === 0) continue;

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
      group: 'friends',
      isFavorite: false,
      isEmergency: false
    };

    headers.forEach((h, idx) => {
      const val = row[idx] || '';
      if (h.includes('name')) contact.fullName = val;
      else if (h.includes('altphone')) contact.alternatePhone = val.replace(/\D/g, '').slice(-10);
      else if (h.includes('phone') || h.includes('mobile')) contact.phone = val.replace(/\D/g, '').slice(-10);
      else if (h.includes('email') || h.includes('mail')) contact.email = val;
      else if (h.includes('company') || h.includes('org')) contact.company = val;
      else if (h.includes('title') || h.includes('role')) contact.jobTitle = val;
      else if (h.includes('address') || h.includes('street')) contact.address = val;
      else if (h.includes('city')) contact.city = val;
      else if (h.includes('state')) contact.state = val;
      else if (h.includes('pin') || h.includes('zip')) contact.pincode = val;
      else if (h.includes('birth') || h.includes('dob')) contact.birthday = val;
      else if (h.includes('web') || h.includes('site')) contact.website = val;
      else if (h.includes('cat') || h.includes('group')) contact.group = val.toLowerCase();
      else if (h.includes('fav') || h.includes('star')) contact.isFavorite = val.toLowerCase().startsWith('y');
      else if (h.includes('emer')) contact.isEmergency = val.toLowerCase().startsWith('y');
      else if (h.includes('note')) contact.notes = val;
    });

    if (contact.fullName || contact.phone) {
      parsedContacts.push(contact);
    }
  }

  return parsedContacts;
};
