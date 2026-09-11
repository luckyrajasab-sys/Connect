import React from 'react';
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
import { EMERGENCY_CONTACTS } from '../data/emergencyContacts';
import { Ionicons } from '@expo/vector-icons';

export const EmergencyScreen = ({ navigation }) => {
  const { contacts } = useContacts();
  const { colors } = useTheme();
  const { t } = useI18n();

  const personalEmergencyList = contacts.filter(c => Boolean(c.isEmergency));

  const handleDial = (number) => {
    if (number) {
      Linking.openURL(`tel:${number}`);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('emergencyDirectory')}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {t('emergencySubtitle')}
          </Text>
        </View>

        {/* Big Universal SOS 112 Beacon Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.sosBanner, { backgroundColor: '#DC2626' }]}
          onPress={() => handleDial('112')}
        >
          <View style={styles.sosIconCircle}>
            <Ionicons name="call" size={32} color="#DC2626" />
          </View>
          <View style={styles.sosTextWrap}>
            <Text style={styles.sosMainNumber}>DIAL 112</Text>
            <Text style={styles.sosDesc}>National All-in-One Emergency Response (ERSS)</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Section: Personal Emergency Contacts */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('personalEmergency')} ({personalEmergencyList.length})
        </Text>

        {personalEmergencyList.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="shield-alert-outline" size={36} color={colors.textDim} />
            <Text style={[styles.emptyCardTitle, { color: colors.text }]}>No Personal SOS Contacts</Text>
            <Text style={[styles.emptyCardDesc, { color: colors.textMuted }]}>
              Edit any contact in your directory and mark them as an Emergency Contact (Doctor, Spouse, Parent).
            </Text>
            <TouchableOpacity
              style={[styles.emptyAddBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Contacts')}
            >
              <Text style={styles.emptyAddBtnText}>Go to Directory</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : (
          personalEmergencyList.map(contact => (
            <GlassCard key={contact.id} glowColor="rgba(239, 68, 68, 0.25)" style={styles.personalCard}>
              <View style={styles.personalRow}>
                <AvatarBadge
                  name={contact.fullName || contact.name}
                  size={46}
                  bg={contact.avatarBg || '#EF4444'}
                  isEmergency={true}
                />
                <View style={styles.personalInfo}>
                  <Text style={[styles.personalName, { color: colors.text }]}>
                    {contact.fullName || contact.name}
                  </Text>
                  <Text style={[styles.personalRelation, { color: '#EF4444' }]}>
                    🚨 {contact.emergencyRelation || 'Emergency Contact'}
                  </Text>
                  <Text style={[styles.personalPhone, { color: colors.textDim }]}>
                    {contact.phone}
                  </Text>
                </View>

                {/* Call Button */}
                <TouchableOpacity
                  style={[styles.callCircleBtn, { backgroundColor: '#EF4444' }]}
                  onPress={() => handleDial(contact.phone)}
                >
                  <Ionicons name="call" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))
        )}

        {/* Section: National Helpline Directory */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          {t('nationalHelplines')}
        </Text>

        {EMERGENCY_CONTACTS.map(item => (
          <GlassCard key={item.id} style={styles.helplineCard}>
            <View style={styles.helplineRow}>
              <View style={[styles.helplineIconWrap, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name="shield-outline" size={22} color={item.color} />
              </View>

              <View style={styles.helplineInfo}>
                <View style={styles.helplineNameRow}>
                  <Text style={[styles.helplineName, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={[styles.badgeTag, { backgroundColor: `${item.color}15`, borderColor: item.color }]}>
                    <Text style={[styles.badgeTagText, { color: item.color }]}>{item.badge}</Text>
                  </View>
                </View>
                <Text style={[styles.helplineDesc, { color: colors.textMuted }]} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              {/* Number CTA Dial */}
              <TouchableOpacity
                style={[styles.dialTagBtn, { backgroundColor: item.color }]}
                onPress={() => handleDial(item.number)}
              >
                <Ionicons name="call" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.dialTagText}>{item.number}</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
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
  sosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  sosIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  sosTextWrap: {
    flex: 1,
  },
  sosMainNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sosDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyCardDesc: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    marginBottom: 14,
  },
  emptyAddBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  personalCard: {
    padding: 14,
    marginBottom: 10,
  },
  personalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  personalName: {
    fontSize: 16,
    fontWeight: '700',
  },
  personalRelation: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  personalPhone: {
    fontSize: 12,
    marginTop: 2,
  },
  callCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helplineCard: {
    padding: 14,
    marginBottom: 10,
  },
  helplineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helplineIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helplineInfo: {
    flex: 1,
    marginRight: 10,
  },
  helplineNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helplineName: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  badgeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  helplineDesc: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  dialTagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dialTagText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  }
});
