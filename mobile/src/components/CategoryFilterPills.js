import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { CATEGORIES } from '../data/categories';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const CategoryFilterPills = ({ selected, onSelect }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map(category => {
          const isSelected = selected.toLowerCase() === category.id.toLowerCase();
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.pill,
                {
                  backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.2)' : colors.surfaceSubtle,
                  borderColor: isSelected ? colors.primary : colors.glassBorder,
                }
              ]}
              onPress={() => onSelect(category.id)}
            >
              <Ionicons
                name={category.icon || 'tag-outline'}
                size={14}
                color={isSelected ? colors.primary : category.color || colors.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.pillText,
                  {
                    color: isSelected ? colors.primary : colors.textMuted,
                    fontWeight: isSelected ? '700' : '500',
                  }
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
  }
});
