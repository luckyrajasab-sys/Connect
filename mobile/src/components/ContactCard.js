import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { AvatarBadge } from './AvatarBadge';
import { useTheme } from '../context/ThemeContext';
import { getCategoryTheme } from '../data/categories';
import { Ionicons } from '@expo/vector-icons';

export const ContactCard = ({ contact, onPress, onToggleFavorite }) => {
  const { colors } = useTheme();
  const categoryTheme = getCategoryTheme(contact.category);
  const displayName = contact.fullName || contact.name || 'Unnamed Contact';

  const cleanPhone = (contact.phone || '').replace(/\D/g, '');

  const handleCall = () => {
    if (cleanPhone) {
      Linking.openURL(`tel:${contact.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (cleanPhone) {
      const intl = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      Linking.openURL(`https://wa.me/${intl}`);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.glassBorder,
        }
      ]}
      onPress={onPress}
    >
      {/* Left Avatar */}
      <AvatarBadge
        name={displayName}
        size={46}
        bg={contact.avatarBg || categoryTheme.color}
        isEmergency={Boolean(contact.isEmergency)}
        isFavorite={Boolean(contact.favorite)}
      />

      {/* Center Details */}
      <View style={styles.infoCol}>
        <View style={styles.nameRow}>
          <Text style={[styles.nameText, { color: colors.text }]} numberOfLines={1}>
            {displayName}
          </Text>
          {contact.importance === 'vip' && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>VIP</Text>
            </View>
          )}
        </View>

        {(contact.jobTitle || contact.company) ? (
          <Text style={[styles.jobText, { color: colors.textMuted }]} numberOfLines={1}>
            {[contact.jobTitle, contact.company].filter(Boolean).join(' • ')}
          </Text>
        ) : (
          <Text style={[styles.phoneText, { color: colors.textDim }]} numberOfLines={1}>
            {contact.phone || 'No phone number'}
          </Text>
        )}

        {/* Category Pill */}
        <View style={styles.categoryRow}>
          <View
            style={[
              styles.categoryTag,
              { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: categoryTheme.border }
            ]}
          >
            <Text style={[styles.categoryTagText, { color: categoryTheme.color }]}>
              {categoryTheme.name}
            </Text>
          </View>
          {contact.city ? (
            <Text style={[styles.cityText, { color: colors.textDim }]}>📍 {contact.city}</Text>
          ) : null}
        </View>
      </View>

      {/* Right Quick Action Shortcuts */}
      <View style={styles.actionCol}>
        <TouchableOpacity
          onPress={() => onToggleFavorite(contact.id)}
          style={styles.actionBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={contact.favorite ? 'star' : 'star-outline'}
            size={18}
            color={contact.favorite ? '#F59E0B' : colors.textDim}
          />
        </TouchableOpacity>

        {cleanPhone ? (
          <View style={styles.phoneButtonsRow}>
            <TouchableOpacity onPress={handleCall} style={[styles.quickDialBtn, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Ionicons name="call" size={14} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleWhatsApp} style={[styles.quickDialBtn, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="logo-whatsapp" size={14} color="#10B981" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  vipBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
  },
  vipText: {
    color: '#A855F7',
    fontSize: 9,
    fontWeight: '800',
  },
  jobText: {
    fontSize: 13,
    marginTop: 2,
  },
  phoneText: {
    fontSize: 13,
    marginTop: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cityText: {
    fontSize: 11,
  },
  actionCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 48,
    marginLeft: 8,
  },
  actionBtn: {
    padding: 4,
  },
  phoneButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  quickDialBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
