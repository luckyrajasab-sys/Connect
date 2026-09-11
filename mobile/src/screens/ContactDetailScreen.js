import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking
} from 'react-native';
import { useContacts } from '../context/ContactContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { GlassCard } from '../components/GlassCard';
import { AvatarBadge } from '../components/AvatarBadge';
import { CompletenessBar } from '../components/CompletenessBar';
import { ActionButtonsGrid } from '../components/ActionButtonsGrid';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { getCategoryTheme } from '../data/categories';
import { shareService } from '../services/shareService';
import { Ionicons } from '@expo/vector-icons';

export const ContactDetailScreen = ({ route, navigation }) => {
  const { contactId } = route.params || {};
  const { contacts, deleteContact, toggleFavorite } = useContacts();
  const { colors } = useTheme();
  const { t, formatDate } = useI18n();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const contact = contacts.find(c => c.id === contactId);

  if (!contact) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={56} color={colors.textDim} />
          <Text style={[styles.notFoundTitle, { color: colors.text }]}>Contact Not Found</Text>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Back to Directory</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const categoryTheme = getCategoryTheme(contact.category);
  const displayName = contact.fullName || contact.name || 'Unnamed Contact';

  const handleOpenMaps = () => {
    const query = [contact.address, contact.city, contact.state, contact.pincode, contact.country || 'India']
      .filter(Boolean)
      .join(', ');
    if (query) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
    }
  };

  const handleOpenQR = () => {
    navigation.navigate('QRHub', { selectedContactId: contact.id });
  };

  const handleDelete = () => {
    deleteContact(contact.id);
    setShowDeleteModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navIconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.navRightActions}>
          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={() => toggleFavorite(contact.id)}
          >
            <Ionicons
              name={contact.favorite ? 'star' : 'star-outline'}
              size={22}
              color={contact.favorite ? '#F59E0B' : colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={() => navigation.navigate('AddEditContact', { contactId: contact.id })}
          >
            <Ionicons name="create-outline" size={22} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={() => setShowDeleteModal(true)}
          >
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Dossier Card */}
        <GlassCard glowColor={categoryTheme.glow} style={styles.heroCard}>
          <View style={styles.avatarCenterWrap}>
            <AvatarBadge
              name={displayName}
              size={84}
              bg={contact.avatarBg || categoryTheme.color}
              isEmergency={Boolean(contact.isEmergency)}
              isFavorite={Boolean(contact.favorite)}
            />
          </View>

          <Text style={[styles.heroName, { color: colors.text }]}>{displayName}</Text>

          {(contact.jobTitle || contact.company) && (
            <Text style={[styles.heroJob, { color: colors.textMuted }]}>
              {[contact.jobTitle, contact.company].filter(Boolean).join(' at ')}
            </Text>
          )}

          {contact.phone && (
            <Text style={[styles.heroPhone, { color: colors.primary }]}>{contact.phone}</Text>
          )}

          {/* Badges Row */}
          <View style={styles.badgesRow}>
            <View style={[styles.badge, { borderColor: categoryTheme.color, backgroundColor: `${categoryTheme.color}15` }]}>
              <Text style={[styles.badgeText, { color: categoryTheme.color }]}>{categoryTheme.name}</Text>
            </View>

            {contact.importance === 'vip' && (
              <View style={[styles.badge, { borderColor: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Text style={[styles.badgeText, { color: '#A855F7' }]}>VIP Priority</Text>
              </View>
            )}

            {contact.isEmergency && (
              <View style={[styles.badge, { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Text style={[styles.badgeText, { color: '#EF4444' }]}>
                  🚨 Emergency ({contact.emergencyRelation || 'Contact'})
                </Text>
              </View>
            )}
          </View>

          {/* Quick Action Grid */}
          <ActionButtonsGrid contact={contact} onOpenQR={handleOpenQR} />
        </GlassCard>

        {/* Completeness Breakdown */}
        <CompletenessBar contact={contact} />

        {/* Section: Contact Coordinates */}
        <Text style={[styles.sectionHeading, { color: colors.text }]}>{t('contactInfo')}</Text>

        {/* Phone Info */}
        <GlassCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Ionicons name="call" size={20} color="#3B82F6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textDim }]}>{t('primaryMobile')}</Text>
              <Text style={[styles.infoVal, { color: colors.text }]}>{contact.phone || '—'}</Text>
              <Text style={[styles.infoSub, { color: colors.textDim }]}>{contact.country || 'Global Phone'}</Text>
            </View>
          </View>

          {contact.alternatePhone ? (
            <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 12, marginTop: 12 }]}>
              <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
                <Ionicons name="call-outline" size={20} color="#06B6D4" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textDim }]}>{t('alternatePhone')}</Text>
                <Text style={[styles.infoVal, { color: colors.text }]}>{contact.alternatePhone}</Text>
              </View>
            </View>
          ) : null}
        </GlassCard>

        {/* Email Info */}
        {contact.email ? (
          <GlassCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Ionicons name="mail" size={20} color="#A855F7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textDim }]}>{t('emailInfo')}</Text>
                <Text style={[styles.infoVal, { color: colors.primary }]}>{contact.email}</Text>
              </View>
            </View>
          </GlassCard>
        ) : null}

        {/* Work & Organization */}
        {(contact.company || contact.jobTitle) ? (
          <GlassCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Ionicons name="briefcase" size={20} color="#F59E0B" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textDim }]}>{t('workInfo')}</Text>
                <Text style={[styles.infoVal, { color: colors.text }]}>
                  {[contact.jobTitle, contact.company].filter(Boolean).join(' at ')}
                </Text>
              </View>
            </View>
          </GlassCard>
        ) : null}

        {/* Location & Maps Launcher */}
        {(contact.address || contact.city || contact.state) ? (
          <GlassCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="location" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textDim }]}>{t('locationAddress')}</Text>
                <Text style={[styles.infoVal, { color: colors.text }]}>
                  {[contact.address, contact.city, contact.state].filter(Boolean).join(', ')}
                  {contact.pincode ? ` - ${contact.pincode}` : ''}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.mapsBtn, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: colors.primary }]}
              onPress={handleOpenMaps}
            >
              <Ionicons name="map-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.mapsBtnText, { color: colors.primary }]}>{t('getDirections')}</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : null}

        {/* Birthday */}
        {contact.birthday ? (
          <GlassCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                <Ionicons name="calendar" size={20} color="#EC4899" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textDim }]}>{t('birthday')}</Text>
                <Text style={[styles.infoVal, { color: colors.text }]}>{contact.birthday}</Text>
              </View>
            </View>
          </GlassCard>
        ) : null}

        {/* Tags Cloud */}
        {Array.isArray(contact.tags) && contact.tags.length > 0 ? (
          <GlassCard style={styles.infoCard}>
            <Text style={[styles.infoLabel, { color: colors.textDim, marginBottom: 8 }]}>{t('tagsKeywords')}</Text>
            <View style={styles.tagsWrap}>
              {contact.tags.map((tag, idx) => (
                <View key={idx} style={[styles.tagChip, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                  <Text style={[styles.tagChipText, { color: colors.primaryLight }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        ) : null}

        {/* Notes & Summary */}
        {contact.notes ? (
          <GlassCard style={styles.infoCard}>
            <Text style={[styles.infoLabel, { color: colors.textDim, marginBottom: 6 }]}>{t('notesSummary')}</Text>
            <Text style={[styles.notesText, { color: colors.text }]}>{contact.notes}</Text>
          </GlassCard>
        ) : null}

        {/* vCard Share Sheet Export CTA */}
        <TouchableOpacity
          style={[styles.exportVCardBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.primary }]}
          onPress={() => shareService.shareVCardFile(contact)}
        >
          <Ionicons name="share-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.exportVCardBtnText, { color: colors.primary }]}>{t('exportVCard')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Delete Confirmation */}
      <ConfirmationModal
        visible={showDeleteModal}
        title={t('confirmDeleteTitle')}
        message={t('confirmDeleteMsg')}
        confirmText={t('deleteContact')}
        cancelText={t('cancel')}
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navIconBtn: {
    padding: 6,
  },
  navRightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  avatarCenterWrap: {
    marginBottom: 14,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroJob: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  heroPhone: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },
  infoCard: {
    padding: 14,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  infoSub: {
    fontSize: 12,
    marginTop: 1,
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
  },
  mapsBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  exportVCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
  },
  exportVCardBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  }
});
