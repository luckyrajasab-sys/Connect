import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useContacts } from '../context/ContactContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { GlassCard } from '../components/GlassCard';
import { AvatarBadge } from '../components/AvatarBadge';
import { shareService } from '../services/shareService';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen = ({ navigation }) => {
  const { currentUser, isCloudConnected, isSyncing, syncWithCloud, stats, loginUser, logoutUser } = useContacts();
  const { colors } = useTheme();
  const { t, formatDate } = useI18n();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');

  const handleAuthSubmit = () => {
    if (authEmail.trim()) {
      loginUser(authEmail, authName);
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthName('');
    }
  };

  const handleShareMyCard = () => {
    shareService.shareVCardFile({
      fullName: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || '',
      company: currentUser.company || 'Connect Smart Hub',
      jobTitle: currentUser.jobTitle || 'Member',
      notes: 'Smart Contact Hub Digital Identity Card'
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{t('userProfile')}</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>{t('myDossier')}</Text>
          </View>
          <TouchableOpacity
            style={[styles.syncHeaderBtn, { backgroundColor: isSyncing ? colors.primaryDark : 'rgba(16, 185, 129, 0.15)', borderColor: colors.primary }]}
            onPress={syncWithCloud}
            disabled={isSyncing}
          >
            <Ionicons
              name={isSyncing ? 'sync' : 'cloud-done-outline'}
              size={18}
              color={colors.primary}
            />
            <Text style={[styles.syncHeaderText, { color: colors.primary }]}>
              {isSyncing ? t('syncing') : (isCloudConnected ? 'Cloud Synced' : 'Sync Local')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Identity Card */}
        <GlassCard glowColor="rgba(16, 185, 129, 0.3)" style={styles.heroCard}>
          <View style={styles.avatarRow}>
            <AvatarBadge name={currentUser.name} size={64} bg={colors.primary} />
            <View style={styles.heroInfo}>
              <Text style={[styles.heroName, { color: colors.text }]}>{currentUser.name}</Text>
              <Text style={[styles.heroRole, { color: colors.primary }]}>
                {[currentUser.jobTitle, currentUser.company].filter(Boolean).join(' • ') || 'Smart Hub Member'}
              </Text>
              <Text style={[styles.heroEmail, { color: colors.textDim }]}>{currentUser.email}</Text>
            </View>
          </View>

          {/* Cloud Sync Status Banner */}
          <View style={[styles.statusBadge, { backgroundColor: isCloudConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)', borderColor: isCloudConnected ? colors.primary : colors.accentBlue }]}>
            <Ionicons
              name={isCloudConnected ? 'shield-checkmark' : 'lock-closed'}
              size={16}
              color={isCloudConnected ? colors.primary : colors.accentBlue}
            />
            <Text style={[styles.statusText, { color: isCloudConnected ? colors.primary : colors.accentBlue }]}>
              {isCloudConnected ? t('cloudConnected') : t('offlineMode')}
            </Text>
          </View>

          {/* Quick Share My vCard Card */}
          <TouchableOpacity
            style={[styles.shareCardBtn, { backgroundColor: colors.primary }]}
            onPress={handleShareMyCard}
          >
            <Ionicons name="share-social-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.shareCardBtnText}>Share My Digital vCard</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Storage & Hub Statistics */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Directory Intelligence</Text>
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statBox}>
            <Ionicons name="people" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.total}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t('totalContacts')}</Text>
          </GlassCard>

          <GlassCard style={styles.statBox}>
            <Ionicons name="star" size={24} color="#F59E0B" />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.favorites}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t('favoriteContacts')}</Text>
          </GlassCard>

          <GlassCard style={styles.statBox}>
            <Ionicons name="shield-alert" size={24} color="#EF4444" />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.emergency}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t('emergencyContactsCount')}</Text>
          </GlassCard>
        </View>

        {/* Cloud & Account Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('accountSettings')}</Text>
        <GlassCard style={styles.settingsMenu}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.divider }]}
            onPress={() => setShowAuthModal(true)}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Ionicons name="person-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>{t('switchAccount')}</Text>
              <Text style={[styles.menuSub, { color: colors.textDim }]}>{currentUser.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.divider }]}
            onPress={syncWithCloud}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>{t('syncNow')}</Text>
              <Text style={[styles.menuSub, { color: colors.textDim }]}>
                {t('lastSynced')}: {formatDate(currentUser.lastSync) || 'Just now'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={logoutUser}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuTitle, { color: '#EF4444' }]}>{t('signOut')}</Text>
              <Text style={[styles.menuSub, { color: colors.textDim }]}>Switch to Offline Guest Vault</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>

      {/* Auth / Account Switcher Modal */}
      <Modal visible={showAuthModal} transparent animationType="slide">
        <SafeAreaView style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('signIn')}</Text>
              <TouchableOpacity onPress={() => setShowAuthModal(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDesc, { color: colors.textMuted }]}>
              Connect with your verified email to sync contacts across web and mobile.
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
              placeholder={t('fullName')}
              placeholderTextColor={colors.textDim}
              value={authName}
              onChangeText={setAuthName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
              placeholder={t('emailAddress')}
              placeholderTextColor={colors.textDim}
              value={authEmail}
              onChangeText={setAuthEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.authSubmitBtn, { backgroundColor: colors.primary }]}
              onPress={handleAuthSubmit}
            >
              <Text style={styles.authSubmitText}>{t('signIn')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  syncHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  syncHeaderText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    padding: 20,
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroInfo: {
    marginLeft: 16,
    flex: 1,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '800',
  },
  heroRole: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
  heroEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 16,
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  shareCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  shareCardBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  settingsMenu: {
    padding: 6,
    borderRadius: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  menuSub: {
    fontSize: 12,
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalDesc: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  authSubmitBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  authSubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
