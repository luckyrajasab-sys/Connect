import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const GlassCard = ({ children, style, glowColor, noBorder = false }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: glowColor ? glowColor : (noBorder ? 'transparent' : colors.glassBorder),
          borderWidth: noBorder ? 0 : 1,
          shadowColor: glowColor || colors.primary,
          shadowOpacity: glowColor ? 0.25 : 0.08,
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  }
});
