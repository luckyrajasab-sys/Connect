import React, { useState, useEffect } from 'react';
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
import QRCode from 'react-native-qrcode-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useContacts } from '../context/ContactContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { GlassCard } from '../components/GlassCard';
import { generateVCard, parseVCard } from '../services/vcardService';
import { shareService } from '../services/shareService';
import { Ionicons } from '@expo/vector-icons';

export const QRHubScreen = ({ route, navigation }) => {
  const { selectedContactId } = route.params || {};
  const { contacts, currentUser, addContact, showToast } = useContacts();
  const { colors } = useTheme();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState('generate'); // 'generate' | 'scan'
  const [selectedContact, setSelectedContact] = useState(() => {
    if (selectedContactId) {
      return contacts.find(c => c.id === selectedContactId) || null;
    }
    return contacts[0] || null;
  });

  // Camera permissions for scanner
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [scannedContact, setScannedContact] = useState(null);

  useEffect(() => {
    if (selectedContactId) {
      const found = contacts.find(c => c.id === selectedContactId);
      if (found) {
        setSelectedContact(found);
        setActiveTab('generate');
      }
    }
  }, [selectedContactId, contacts]);

  const qrPayload = selectedContact
    ? generateVCard(selectedContact)
    : generateVCard({
        fullName: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
        company: currentUser.company || 'Connect Smart Hub',
        jobTitle: currentUser.jobTitle || 'Member'
      });

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    const parsed = parseVCard(data);
    if (parsed) {
      setScannedContact(parsed);
    } else {
      showToast(t('invalidQr'), 'warning');
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const handleConfirmImport = async () => {
    if (scannedContact) {
      await addContact(scannedContact);
      setScannedContact(null);
      setScanned(false);
      showToast(t('contactImported'), 'success');
      navigation.navigate('Contacts');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('qrHubTitle')}</Text>
        
        {/* Tab Switcher */}
        <View style={[styles.tabBar, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'generate' && { backgroundColor: colors.primary }]}
            onPress={() => {
              setActiveTab('generate');
              setScanned(false);
            }}
          >
            <Ionicons
              name="qr-code-outline"
              size={16}
              color={activeTab === 'generate' ? '#FFFFFF' : colors.textMuted}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabBtnText, { color: activeTab === 'generate' ? '#FFFFFF' : colors.textMuted }]}>
              {t('generateTab')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'scan' && { backgroundColor: colors.primary }]}
            onPress={() => {
              setActiveTab('scan');
              setScanned(false);
            }}
          >
            <Ionicons
              name="camera-outline"
              size={16}
              color={activeTab === 'scan' ? '#FFFFFF' : colors.textMuted}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabBtnText, { color: activeTab === 'scan' ? '#FFFFFF' : colors.textMuted }]}>
              {t('scanTab')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* GENERATE TAB */}
      {activeTab === 'generate' && (
        <ScrollView contentContainerStyle={styles.generateScroll} showsVerticalScrollIndicator={false}>
          {/* Contact Selector Strip */}
          <Text style={[styles.sectionLabel, { color: colors.textDim }]}>{t('selectContactToShare')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contactChipsRow}>
            {/* My Profile Option */}
            <TouchableOpacity
              style={[
                styles.contactChip,
                !selectedContact && { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: colors.primary }
              ]}
              onPress={() => setSelectedContact(null)}
            >
              <Text style={[styles.chipText, { color: !selectedContact ? colors.primary : colors.text }]}>
                👤 My Digital Card
              </Text>
            </TouchableOpacity>

            {/* Contact Options */}
            {contacts.map(c => {
              const isSelected = selectedContact?.id === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.contactChip,
                    isSelected && { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: colors.primary }
                  ]}
                  onPress={() => setSelectedContact(c)}
                >
                  <Text style={[styles.chipText, { color: isSelected ? colors.primary : colors.text }]}>
                    {c.fullName || c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* QR Code Presentation Box */}
          <GlassCard glowColor="rgba(16, 185, 129, 0.3)" style={styles.qrCard}>
            <Text style={[styles.qrContactTitle, { color: colors.text }]}>
              {selectedContact ? (selectedContact.fullName || selectedContact.name) : currentUser.name}
            </Text>
            <Text style={[styles.qrContactSub, { color: colors.textMuted }]}>
              {selectedContact ? (selectedContact.phone || selectedContact.email) : currentUser.email}
            </Text>

            {/* QR View */}
            <View style={styles.qrWhiteBox}>
              <QRCode
                value={qrPayload || 'Connect Hub'}
                size={220}
                color="#0B0F19"
                backgroundColor="#FFFFFF"
              />
            </View>

            <Text style={[styles.qrInstruction, { color: colors.textDim }]}>
              {t('shareQrInstruction')}
            </Text>

            {/* Share vCard Sheet Action */}
            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: colors.primary }]}
              onPress={() => shareService.shareVCardFile(selectedContact || { fullName: currentUser.name, email: currentUser.email, phone: currentUser.phone })}
            >
              <Ionicons name="share-social-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.shareBtnText}>{t('exportVCard')}</Text>
            </TouchableOpacity>
          </GlassCard>
        </ScrollView>
      )}

      {/* SCAN CAMERA TAB */}
      {activeTab === 'scan' && (
        <View style={styles.cameraContainer}>
          {!permission ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : !permission.granted ? (
            <View style={styles.centerBox}>
              <Ionicons name="camera-off-outline" size={56} color={colors.textDim} />
              <Text style={[styles.permissionTitle, { color: colors.text }]}>{t('cameraPermissionNeeded')}</Text>
              <TouchableOpacity style={[styles.permissionBtn, { backgroundColor: colors.primary }]} onPress={requestPermission}>
                <Text style={styles.permissionBtnText}>{t('grantCameraAccess')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraWrap}>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                enableTorch={torch}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              />

              {/* Scanning Overlay Box */}
              <View style={styles.overlay}>
                <View style={styles.targetReticle}>
                  <View style={[styles.corner, styles.cornerTL, { borderColor: colors.primary }]} />
                  <View style={[styles.corner, styles.cornerTR, { borderColor: colors.primary }]} />
                  <View style={[styles.corner, styles.cornerBL, { borderColor: colors.primary }]} />
                  <View style={[styles.corner, styles.cornerBR, { borderColor: colors.primary }]} />
                </View>

                <Text style={styles.scanInstructionText}>{t('scanInstruction')}</Text>

                {/* Torch Toggle */}
                <TouchableOpacity
                  style={[styles.torchBtn, { backgroundColor: torch ? colors.primary : 'rgba(0,0,0,0.6)' }]}
                  onPress={() => setTorch(prev => !prev)}
                >
                  <Ionicons name={torch ? 'flash' : 'flash-off'} size={22} color="#FFFFFF" />
                </TouchableOpacity>

                {scanned && (
                  <TouchableOpacity
                    style={[styles.rescanBtn, { backgroundColor: colors.primary }]}
                    onPress={() => setScanned(false)}
                  >
                    <Text style={styles.rescanBtnText}>Tap to Scan Again</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Scanned Contact Import Preview Modal */}
      <Modal visible={Boolean(scannedContact)} transparent animationType="slide">
        <SafeAreaView style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.scannedIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <Ionicons name="person-add" size={32} color={colors.primary} />
            </View>

            <Text style={[styles.scannedTitle, { color: colors.text }]}>vCard Contact Detected</Text>
            <Text style={[styles.scannedName, { color: colors.text }]}>{scannedContact?.fullName}</Text>
            {scannedContact?.phone ? (
              <Text style={[styles.scannedDetail, { color: colors.primary }]}>📞 {scannedContact.phone}</Text>
            ) : null}
            {scannedContact?.email ? (
              <Text style={[styles.scannedDetail, { color: colors.textMuted }]}>✉️ {scannedContact.email}</Text>
            ) : null}
            {scannedContact?.company ? (
              <Text style={[styles.scannedDetail, { color: colors.textDim }]}>🏢 {scannedContact.company}</Text>
            ) : null}

            <View style={styles.modalBtnsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.surfaceSubtle }]}
                onPress={() => {
                  setScannedContact(null);
                  setScanned(false);
                }}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleConfirmImport}
              >
                <Text style={[styles.modalBtnText, { color: '#FFFFFF', fontWeight: '700' }]}>Import Contact</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  generateScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  contactChipsRow: {
    gap: 8,
    marginBottom: 16,
  },
  contactChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  qrCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
  },
  qrContactTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  qrContactSub: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 16,
  },
  qrWhiteBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  qrInstruction: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 18,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  cameraContainer: {
    flex: 1,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cameraWrap: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  targetReticle: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderWidth: 4,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanInstructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
    paddingHorizontal: 32,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 4,
  },
  torchBtn: {
    position: 'absolute',
    bottom: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rescanBtn: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  rescanBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  scannedIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  scannedTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scannedName: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 8,
  },
  scannedDetail: {
    fontSize: 14,
    marginTop: 2,
  },
  modalBtnsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '600',
  }
});
