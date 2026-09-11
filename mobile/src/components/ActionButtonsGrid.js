import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { shareService } from '../services/shareService';
import { Ionicons } from '@expo/vector-icons';

export const ActionButtonsGrid = ({ contact, onOpenQR }) => {
  const { colors } = useTheme();
  const cleanPhone = (contact.phone || '').replace(/\D/g, '');
  const intlPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const handleCall = () => {
    if (contact.phone) {
      Linking.openURL(`tel:${contact.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (cleanPhone) {
      Linking.openURL(`https://wa.me/${intlPhone}`);
    }
  };

  const handleSMS = () => {
    if (contact.phone) {
      Linking.openURL(`sms:${contact.phone}`);
    }
  };

  const handleEmail = () => {
    if (contact.email) {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };

  const handleShare = () => {
    shareService.shareVCardFile(contact);
  };

  const actions = [
    { label: 'Call', icon: 'call', color: '#3B82F6', onPress: handleCall, disabled: !contact.phone },
    { label: 'WhatsApp', icon: 'logo-whatsapp', color: '#10B981', onPress: handleWhatsApp, disabled: !contact.phone },
    { label: 'SMS', icon: 'chatbubble', color: '#06B6D4', onPress: handleSMS, disabled: !contact.phone },
    { label: 'Email', icon: 'mail', color: '#A855F7', onPress: handleEmail, disabled: !contact.email },
    { label: 'QR vCard', icon: 'qr-code', color: '#F59E0B', onPress: onOpenQR, disabled: false },
    { label: 'Share', icon: 'share-social', color: '#EC4899', onPress: handleShare, disabled: false },
  ];

  return (
    <View style={styles.grid}>
      {actions.map((act, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.btn,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.border,
              opacity: act.disabled ? 0.35 : 1
            }
          ]}
          onPress={act.onPress}
          disabled={act.disabled}
        >
          <View style={[styles.iconWrap, { backgroundColor: `${act.color}20` }]}>
            <Ionicons name={act.icon} size={20} color={act.color} />
          </View>
          <Text style={[styles.label, { color: colors.text }]}>{act.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 14,
  },
  btn: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  }
});
