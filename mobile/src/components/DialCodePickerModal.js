import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { COUNTRIES } from '../data/countries';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const DialCodePickerModal = ({ visible, onClose, onSelect, selectedDialCode }) => {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter(c => {
    const q = search.toLowerCase().trim();
    return c.name.toLowerCase().includes(q) ||
           c.dialCode.includes(q) ||
           c.code.toLowerCase().includes(q);
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]}>Select Country & Dial Code</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search country name or code (+91, US...)"
              placeholderTextColor={colors.textDim}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={item => item.code + item.dialCode}
            renderItem={({ item }) => {
              const isSelected = item.dialCode === selectedDialCode;
              return (
                <TouchableOpacity
                  style={[
                    styles.countryRow,
                    { borderBottomColor: colors.divider },
                    isSelected && { backgroundColor: 'rgba(16, 185, 129, 0.15)' }
                  ]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={styles.flagEmoji}>{item.flag}</Text>
                  <View style={styles.countryInfo}>
                    <Text style={[styles.countryName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.countryCode, { color: colors.textDim }]}>{item.code}</Text>
                  </View>
                  <Text style={[styles.dialCodeText, { color: colors.primary }]}>{item.dialCode}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '75%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  flagEmoji: {
    fontSize: 26,
    marginRight: 14,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 15,
    fontWeight: '600',
  },
  countryCode: {
    fontSize: 12,
    marginTop: 2,
  },
  dialCodeText: {
    fontSize: 15,
    fontWeight: '700',
  }
});
