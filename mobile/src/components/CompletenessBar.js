import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateCompleteness } from '../utils/completeness';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const CompletenessBar = ({ contact, showMissing = true }) => {
  const { colors } = useTheme();
  const { score, missingFields } = calculateCompleteness(contact);

  const getScoreColor = () => {
    if (score >= 80) return colors.primary;
    if (score >= 50) return colors.accentAmber;
    return colors.accentRed;
  };

  const scoreColor = getScoreColor();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles-outline" size={16} color={scoreColor} style={{ marginRight: 6 }} />
          <Text style={[styles.title, { color: colors.text }]}>Profile Dossier Completeness</Text>
        </View>
        <Text style={[styles.scorePercent, { color: scoreColor }]}>{score}%</Text>
      </View>

      {/* Progress Track */}
      <View style={[styles.track, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${score}%`,
              backgroundColor: scoreColor,
            }
          ]}
        />
      </View>

      {/* Missing suggestions */}
      {showMissing && missingFields.length > 0 && (
        <View style={styles.missingRow}>
          <Text style={[styles.missingLabel, { color: colors.textDim }]}>
            Tip: Add {missingFields.slice(0, 2).join(', ')} to strengthen identity dossier.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
  scorePercent: {
    fontSize: 14,
    fontWeight: '800',
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  missingRow: {
    marginTop: 8,
  },
  missingLabel: {
    fontSize: 11,
    lineHeight: 15,
  }
});
