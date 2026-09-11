import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useContacts } from '../context/ContactContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { GlassCard } from '../components/GlassCard';
import { DialCodePickerModal } from '../components/DialCodePickerModal';
import { CATEGORIES } from '../data/categories';
import { DEFAULT_COUNTRY } from '../data/countries';
import { Ionicons } from '@expo/vector-icons';

export const AddEditContactScreen = ({ route, navigation }) => {
  const { contactId } = route.params || {};
  const isEditing = Boolean(contactId);

  const { contacts, addContact, updateContact } = useContacts();
  const { colors } = useTheme();
  const { t } = useI18n();

  const existing = isEditing ? contacts.find(c => c.id === contactId) : null;

  // Form State
  const [fullName, setFullName] = useState(existing?.fullName || '');
  const [dialCode, setDialCode] = useState('+91');
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState(existing?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(existing?.alternatePhone || '');
  const [email, setEmail] = useState(existing?.email || '');
  const [company, setCompany] = useState(existing?.company || '');
  const [jobTitle, setJobTitle] = useState(existing?.jobTitle || '');
  const [address, setAddress] = useState(existing?.address || '');
  const [city, setCity] = useState(existing?.city || '');
  const [state, setState] = useState(existing?.state || '');
  const [pincode, setPincode] = useState(existing?.pincode || '');
  const [birthday, setBirthday] = useState(existing?.birthday || '');
  const [website, setWebsite] = useState(existing?.website || '');
  const [category, setCategory] = useState(existing?.category || 'Friends');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [tagsInput, setTagsInput] = useState(existing?.tags ? existing.tags.join(', ') : '');
  const [isEmergency, setIsEmergency] = useState(Boolean(existing?.isEmergency));
  const [emergencyRelation, setEmergencyRelation] = useState(existing?.emergencyRelation || '');
  const [isVip, setIsVip] = useState(existing?.importance === 'vip');

  const [showDialPicker, setShowDialPicker] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    const errs = {};
    if (!fullName.trim()) {
      errs.fullName = t('validationNameRequired');
    }
    if (!phone.trim()) {
      errs.phone = t('validationPhoneRequired');
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      alternatePhone: alternatePhone.trim(),
      email: email.trim(),
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      country: selectedCountry?.name || 'India',
      birthday: birthday.trim(),
      website: website.trim(),
      category: category || 'Personal',
      notes: notes.trim(),
      tags: tagsArray,
      importance: isVip ? 'vip' : 'normal',
      isEmergency,
      emergencyRelation: isEmergency ? emergencyRelation.trim() : ''
    };

    if (isEditing) {
      await updateContact(contactId, payload);
    } else {
      await addContact(payload);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navIconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>
          {isEditing ? t('editContactTitle') : t('addContactTitle')}
        </Text>
        <TouchableOpacity style={[styles.saveNavBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Text style={styles.saveNavBtnText}>{t('confirm')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section: Basic Identity */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('personalInfo')}</Text>
        <GlassCard style={styles.card}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{t('fullName')} *</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surfaceSubtle, borderColor: errors.fullName ? '#EF4444' : colors.border, color: colors.text }
            ]}
            placeholder="e.g. Aarav Sharma"
            placeholderTextColor={colors.textDim}
            value={fullName}
            onChangeText={t => {
              setFullName(t);
              if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
            }}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          {/* Primary Phone with Dial Code Picker */}
          <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>{t('primaryMobile')} *</Text>
          <View style={styles.phoneInputRow}>
            <TouchableOpacity
              style={[styles.dialCodeBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
              onPress={() => setShowDialPicker(true)}
            >
              <Text style={styles.dialFlag}>{selectedCountry.flag}</Text>
              <Text style={[styles.dialCodeText, { color: colors.primary }]}>{selectedCountry.dialCode}</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textDim} />
            </TouchableOpacity>

            <TextInput
              style={[
                styles.input,
                styles.phoneInput,
                { backgroundColor: colors.surfaceSubtle, borderColor: errors.phone ? '#EF4444' : colors.border, color: colors.text }
              ]}
              placeholder="98765 43210"
              placeholderTextColor={colors.textDim}
              value={phone}
              onChangeText={t => {
                setPhone(t);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
              }}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          {/* Alternate Phone */}
          <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>{t('alternatePhone')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
            placeholder="Optional second number"
            placeholderTextColor={colors.textDim}
            value={alternatePhone}
            onChangeText={setAlternatePhone}
            keyboardType="phone-pad"
          />

          {/* Email */}
          <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>{t('emailAddress')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
            placeholder="aarav.sharma@example.com"
            placeholderTextColor={colors.textDim}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </GlassCard>

        {/* Section: Category Selection */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('categoryLabel')}</Text>
        <GlassCard style={styles.card}>
          <View style={styles.categoryChipsGrid}>
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
              const isSelected = category.toLowerCase() === cat.id.toLowerCase() || category.toLowerCase() === cat.name.toLowerCase();
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.2)' : colors.surfaceSubtle,
                      borderColor: isSelected ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Ionicons
                    name={cat.icon || 'tag'}
                    size={16}
                    color={isSelected ? colors.primary : cat.color}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.categoryChipText, { color: isSelected ? colors.primary : colors.text }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        {/* Section: Work & Organization */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('workDetails')}</Text>
        <GlassCard style={styles.card}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{t('company')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
            placeholder="e.g. Google, TechCorp"
            placeholderTextColor={colors.textDim}
            value={company}
            onChangeText={setCompany}
          />

          <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>{t('jobTitle')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
            placeholder="e.g. VP of Engineering"
            placeholderTextColor={colors.textDim}
            value={jobTitle}
            onChangeText={setJobTitle}
          />
        </GlassCard>

        {/* Section: Address & Location */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('addressDetails')}</Text>
        <GlassCard style={styles.card}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{t('address')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
            placeholder="Street, building, area"
            placeholderTextColor={colors.textDim}
            value={address}
            onChangeText={setAddress}
          />

          <View style={styles.twoColRow}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>{t('city')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
                placeholder="Bengaluru"
                placeholderTextColor={colors.textDim}
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>{t('state')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
                placeholder="Karnataka"
                placeholderTextColor={colors.textDim}
                value={state}
                onChangeText={setState}
              />
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>{t('pincode')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
            placeholder="560038"
            placeholderTextColor={colors.textDim}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
          />
        </GlassCard>

        {/* Section: Dossier Flags & Notes */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('additionalInfo')}</Text>
        <GlassCard style={styles.card}>
          {/* VIP Switch */}
          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.switchTitle, { color: colors.text }]}>Mark as VIP Priority</Text>
              <Text style={[styles.switchSub, { color: colors.textDim }]}>Highlighted in directory</Text>
            </View>
            <Switch
              value={isVip}
              onValueChange={setIsVip}
              trackColor={{ false: '#374151', true: '#A855F7' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Emergency Contact Switch */}
          <View style={[styles.switchRow, { borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 12, marginTop: 12 }]}>
            <View>
              <Text style={[styles.switchTitle, { color: '#EF4444' }]}>{t('isEmergencyContact')}</Text>
              <Text style={[styles.switchSub, { color: colors.textDim }]}>Quick access on Emergency tab</Text>
            </View>
            <Switch
              value={isEmergency}
              onValueChange={setIsEmergency}
              trackColor={{ false: '#374151', true: '#EF4444' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {isEmergency && (
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{t('emergencyRelation')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
                placeholder="e.g. Family Doctor, Spouse, Parent"
                placeholderTextColor={colors.textDim}
                value={emergencyRelation}
                onChangeText={setEmergencyRelation}
              />
            </View>
          )}

          {/* Birthday */}
          <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>{t('birthday')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
            placeholder="YYYY-MM-DD (e.g. 1990-08-15)"
            placeholderTextColor={colors.textDim}
            value={birthday}
            onChangeText={setBirthday}
          />

          {/* Tags */}
          <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>{t('tagsKeywords')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
            placeholder={t('tagsPlaceholder')}
            placeholderTextColor={colors.textDim}
            value={tagsInput}
            onChangeText={setTagsInput}
          />

          {/* Notes */}
          <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>{t('notesSummary')}</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text }]}
            placeholder="Meeting context, conversation notes, personal preferences..."
            placeholderTextColor={colors.textDim}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </GlassCard>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>{t('saveContact')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Dial Code Picker */}
      <DialCodePickerModal
        visible={showDialPicker}
        onClose={() => setShowDialPicker(false)}
        onSelect={c => {
          setSelectedCountry(c);
          setDialCode(c.dialCode);
        }}
        selectedDialCode={dialCode}
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
    paddingVertical: 12,
  },
  navIconBtn: {
    padding: 6,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  saveNavBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  saveNavBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },
  card: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dialCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    gap: 4,
  },
  dialFlag: {
    fontSize: 18,
  },
  dialCodeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  phoneInput: {
    flex: 1,
  },
  twoColRow: {
    flexDirection: 'row',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  categoryChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchSub: {
    fontSize: 12,
    marginTop: 2,
  },
  saveBtn: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
