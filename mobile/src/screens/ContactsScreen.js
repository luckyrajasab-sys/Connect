import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useContacts } from '../context/ContactContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { ContactCard } from '../components/ContactCard';
import { CategoryFilterPills } from '../components/CategoryFilterPills';
import { Ionicons } from '@expo/vector-icons';

export const ContactsScreen = ({ navigation }) => {
  const {
    filteredContacts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSort,
    setSelectedSort,
    onlyFavorites,
    setOnlyFavorites,
    toggleFavorite
  } = useContacts();

  const { colors } = useTheme();
  const { t } = useI18n();

  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { id: 'favorites', label: t('sortFavorites') },
    { id: 'name-asc', label: t('sortNameAsc') },
    { id: 'name-desc', label: t('sortNameDesc') },
    { id: 'recent', label: t('sortRecent') },
    { id: 'updated', label: t('sortUpdated') }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{t('directoryTitle')}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {filteredContacts.length} Smart Contacts
          </Text>
        </View>

        {/* Header Action Buttons */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              { backgroundColor: onlyFavorites ? 'rgba(245, 158, 11, 0.2)' : colors.surfaceSubtle, borderColor: onlyFavorites ? '#F59E0B' : colors.border }
            ]}
            onPress={() => setOnlyFavorites(prev => !prev)}
          >
            <Ionicons
              name={onlyFavorites ? 'star' : 'star-outline'}
              size={18}
              color={onlyFavorites ? '#F59E0B' : colors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
            onPress={() => setShowSortMenu(prev => !prev)}
          >
            <Ionicons name="swap-vertical" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor={colors.textDim}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close-circle" size={18} color={colors.textDim} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Menu Dropdown if Active */}
      {showSortMenu && (
        <View style={[styles.sortDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sortTitle, { color: colors.textDim }]}>{t('sortBy')}</Text>
          {sortOptions.map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.sortOption,
                selectedSort === opt.id && { backgroundColor: 'rgba(16, 185, 129, 0.15)' }
              ]}
              onPress={() => {
                setSelectedSort(opt.id);
                setShowSortMenu(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  { color: selectedSort === opt.id ? colors.primary : colors.text }
                ]}
              >
                {opt.label}
              </Text>
              {selectedSort === opt.id && (
                <Ionicons name="checkmark" size={16} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Category Pills */}
      <CategoryFilterPills selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Contacts List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onPress={() => navigation.navigate('ContactDetail', { contactId: item.id })}
            onToggleFavorite={toggleFavorite}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconWrap, { backgroundColor: colors.surfaceSubtle }]}>
              <Ionicons name="search-outline" size={36} color={colors.textDim} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('noContactsFound')}</Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>{t('noContactsDesc')}</Text>
            <TouchableOpacity
              style={[styles.emptyAddBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AddEditContact')}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.emptyAddBtnText}>{t('addNewContact')}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddEditContact')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  sortDropdown: {
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    padding: 8,
    zIndex: 100,
  },
  sortTitle: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    textTransform: 'uppercase',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 90,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  }
});
