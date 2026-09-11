import { Share, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { generateVCard } from './vcardService';

/**
 * Mobile Native Share Service
 * Shares contact details via OS Share Sheet or exports .vcf files
 */

export const shareService = {
  /**
   * Share contact text info directly to WhatsApp, SMS, or other apps
   */
  async shareContactText(contact) {
    if (!contact) return;
    const name = contact.fullName || contact.name || 'Contact';
    const lines = [
      `👤 ${name}`,
      contact.phone ? `📞 Phone: ${contact.phone}` : null,
      contact.alternatePhone ? `📱 Alt: ${contact.alternatePhone}` : null,
      contact.email ? `✉️ Email: ${contact.email}` : null,
      contact.company ? `💼 ${[contact.jobTitle, contact.company].filter(Boolean).join(' at ')}` : null,
      contact.address ? `📍 Address: ${contact.address}` : null,
      '— Shared via Connect Smart Contact Hub'
    ].filter(Boolean).join('\n');

    try {
      await Share.share({
        title: `Contact: ${name}`,
        message: lines
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  },

  /**
   * Export contact as .vcf file and open native OS Share Sheet
   */
  async shareVCardFile(contact) {
    if (!contact) return;
    const vcardStr = generateVCard(contact);
    const fileName = `${(contact.fullName || 'contact').replace(/[^a-zA-Z0-9]/g, '_')}.vcf`;
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;

    try {
      await FileSystem.writeAsStringAsync(filePath, vcardStr, {
        encoding: FileSystem.EncodingType.UTF8
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/vcard',
          dialogTitle: `Share ${contact.fullName || 'Contact'}`,
          UTI: 'public.vcard'
        });
      } else {
        await Share.share({
          title: `vCard: ${contact.fullName}`,
          message: vcardStr
        });
      }
    } catch (err) {
      console.warn('vCard share error:', err);
      // Fallback to text share
      await this.shareContactText(contact);
    }
  }
};
