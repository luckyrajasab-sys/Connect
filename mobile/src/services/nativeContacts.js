import * as Contacts from 'expo-contacts';

/**
 * Native Contacts Service
 * Integrates directly with iOS & Android Address Books via expo-contacts
 */

export const nativeContacts = {
  /**
   * Check & Request Contacts Read/Write Permissions
   */
  async requestPermission() {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.warn('Native Contacts Permission Error:', err);
      return false;
    }
  },

  /**
   * Import all contacts from device address book
   */
  async getDeviceContacts() {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      throw new Error('Device contacts permission was denied.');
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Name,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Emails,
        Contacts.Fields.Company,
        Contacts.Fields.JobTitle,
        Contacts.Fields.Addresses,
        Contacts.Fields.Birthday,
        Contacts.Fields.Note
      ],
      sort: Contacts.SortTypes.FirstName
    });

    if (!data || data.length === 0) return [];

    return data.map(c => {
      const fullName = c.name || [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Device Contact';
      const phone = c.phoneNumbers && c.phoneNumbers[0] ? c.phoneNumbers[0].number : '';
      const altPhone = c.phoneNumbers && c.phoneNumbers[1] ? c.phoneNumbers[1].number : '';
      const email = c.emails && c.emails[0] ? c.emails[0].email : '';
      
      let address = '';
      let city = '';
      let state = '';
      let pincode = '';
      if (c.addresses && c.addresses[0]) {
        address = c.addresses[0].street || '';
        city = c.addresses[0].city || '';
        state = c.addresses[0].region || '';
        pincode = c.addresses[0].postalCode || '';
      }

      return {
        id: `device_${c.id || Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        fullName,
        phone,
        alternatePhone: altPhone,
        email,
        company: c.company || '',
        jobTitle: c.jobTitle || '',
        address,
        city,
        state,
        pincode,
        notes: c.note || '',
        category: 'Personal',
        favorite: false,
        tags: ['device-import']
      };
    });
  },

  /**
   * Export single contact into phone's native address book
   */
  async exportContactToPhone(contact) {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      throw new Error('Device contacts permission was denied.');
    }

    const nameParts = (contact.fullName || contact.name || 'Contact').split(' ');
    const lastName = nameParts.length > 1 ? nameParts.pop() : '';
    const firstName = nameParts.join(' ');

    const newContact = {
      [Contacts.Fields.FirstName]: firstName,
      [Contacts.Fields.LastName]: lastName,
      [Contacts.Fields.Company]: contact.company || undefined,
      [Contacts.Fields.JobTitle]: contact.jobTitle || undefined,
      [Contacts.Fields.Note]: contact.notes || undefined
    };

    if (contact.phone) {
      newContact[Contacts.Fields.PhoneNumbers] = [
        {
          label: 'mobile',
          number: contact.phone
        }
      ];
      if (contact.alternatePhone) {
        newContact[Contacts.Fields.PhoneNumbers].push({
          label: 'work',
          number: contact.alternatePhone
        });
      }
    }

    if (contact.email) {
      newContact[Contacts.Fields.Emails] = [
        {
          label: 'home',
          email: contact.email
        }
      ];
    }

    if (contact.address || contact.city || contact.state) {
      newContact[Contacts.Fields.Addresses] = [
        {
          label: 'home',
          street: contact.address || '',
          city: contact.city || '',
          region: contact.state || '',
          postalCode: contact.pincode || '',
          country: contact.country || 'India'
        }
      ];
    }

    const contactId = await Contacts.addContactAsync(newContact);
    return contactId;
  }
};
