import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useContacts } from '../context/ContactContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { GlassCard } from '../components/GlassCard';
import { nativeContacts } from '../services/nativeContacts';
import { shareService } from '../services/shareService';
import { Ionicons } from '@expo/vector-icons';

export const ToolsSettingsScreen = () => {
  const { contacts, importContactsBatch, syncWithCloud, showToast } = useContacts();
  const { colors } = useTheme();
  const { t, language, setLanguage, isRTL, LANGUAGES } = useI18n();

  const [isImporting, setIsImporting] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Import Device Phonebook
  const handleImportDeviceContacts = async () => {
    setIsImporting(true);
    try {
      const deviceList = await nativeContacts.getDeviceContacts();
      if (deviceList.length === 0) {
        showToast('No contacts found on this device', 'info');
      } else {
        await importContactsBatch(deviceList);
      }
    } catch (err) {
      showToast(err.message || 'Could not import device contacts', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  // Export All to vCard File
  const handleExportAllVCards = async () => {
    if (contacts.length === 0) {
      showToast('No contacts to export', 'warning');
      return;
    }
    // Share first contact or bundle
    await shareService.shareVCardFile(contacts[0]);
  };

  // Duplicate Finder
  const handleCheckDuplicates = () => {
    const phoneMap = new Map();
    let duplicateCount = 0;

    contacts.forEach(c => {
      const clean = (c.phone || '').replace(/\D/g, '');
      if (clean && clean.length > 5) {
        if (phoneMap.has(clean)) {
          duplicateCount++;
        } else {
          phoneMap.set(clean, true);
        }
      }
    });

    if (duplicateCount > 0) {
      showToast(`Detected ${duplicateCount} duplicate contacts in your hub.`, 'warning');
    } else {
      showToast(t('noDuplicatesFound'), 'success');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('toolsTitle')}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Smart sync, native phonebook bridge, and international localization.
          </Text>
        </View>

        {/* Section: Native Device Contacts Bridge */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('nativeContactsSync')}</Text>
        <GlassCard glowColor="rgba(16, 185, 129, 0.25)" style={styles.card}>
          <Text style={[styles.cardDesc, { color: colors.textMuted }]}>
            {t('syncPhonebookDesc')}
          </Text>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={handleImportDeviceContacts}
            disabled={isImporting}
          >
            {isImporting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.actionBtnText}>{t('importFromDevice')}</Text>
              </>
            )}
          </TouchableOpacity>
        </GlassCard>

        {/* Section: Localization & RTL Engine */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('languageRTL')}</Text>
        <GlassCard style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={[styles.settingIconWrap, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Ionicons name="globe-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>{t('selectedLanguage')}</Text>
              <Text style={[styles.settingSub, { color: colors.primary }]}>
                {LANGUAGES.find(l => l.code === language)?.name} ({LANGUAGES.find(l => l.code === language)?.nativeName})
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </TouchableOpacity>

          {isRTL && (
            <View style={[styles.rtlIndicator, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B' }]}>
              <Ionicons name="swap-horizontal" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
              <Text style={[styles.rtlIndicatorText, { color: '#F59E0B' }]}>{t('rtlEnabled')}</Text>
            </View>
          )}
        </GlassCard>

        {/* Section: Data Maintenance & Cleaners */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Hygiene & Security</Text>
        <GlassCard style={styles.card}>
          {/* Duplicate Cleaner */}
          <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: 14 }]} onPress={handleCheckDuplicates}>
            <View style={[styles.settingIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="copy-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>{t('mergeDuplicates')}</Text>
              <Text style={[styles.settingSub, { color: colors.textDim }]}>Scan for matching phone numbers</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </TouchableOpacity>

          {/* Export vCard */}
          <TouchableOpacity style={[styles.settingRow, { paddingTop: 14 }]} onPress={handleExportAllVCards}>
            <View style={[styles.settingIconWrap, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Ionicons name="share-outline" size={20} color="#A855F7" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>{t('exportVcf')}</Text>
              <Text style={[styles.settingSub, { color: colors.textDim }]}>Native OS Share Sheet</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>

      {/* Language Picker Modal */}
      <Modal visible={showLanguageModal} transparent animationType="slide">
        <SafeAreaView style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language / اختر اللغة</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {LANGUAGES.map(lang => {
              const isSelected = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langRow,
                    { borderBottomColor: colors.divider },
                    isSelected && { backgroundColor: 'rgba(16, 185, 129, 0.15)' }
                  ]}
                  onPress={() => {
                    setLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={styles.langFlag}>{lang.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.langName, { color: colors.text }]}>{lang.name}</Text>
                    <Text style={[styles.langNative, { color: colors.textDim }]}>
                      {lang.nativeName} {lang.isRTL ? '• (RTL Direction)' : ''}
                    </Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 14,
  },
  card: {
    padding: 16,
    borderRadius: 18,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 13,
    marginTop: 2,
  },
  rtlIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
  },
  rtlIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRadius: 10,
  },
  langFlag: {
    fontSize: 24,
    marginRight: 14,
  },
  langName: {
    fontSize: 15,
    fontWeight: '600',
  },
  langNative: {
    fontSize: 12,
    marginTop: 2,
  }
});
