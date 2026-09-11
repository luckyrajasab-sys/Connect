import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getInitials } from '../utils/avatarHelper';
import { Ionicons } from '@expo/vector-icons';

export const AvatarBadge = ({ name, size = 48, bg, isEmergency = false, isFavorite = false }) => {
  const initials = getInitials(name);
  const bgColor = bg || '#10B981';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.avatarCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
          }
        ]}
      >
        <Text style={[styles.initialsText, { fontSize: size * 0.4 }]}>
          {initials}
        </Text>
      </View>

      {isEmergency && (
        <View style={styles.emergencyBadge}>
          <Ionicons name="warning" size={10} color="#FFFFFF" />
        </View>
      )}

      {isFavorite && !isEmergency && (
        <View style={styles.starBadge}>
          <Ionicons name="star" size={10} color="#F59E0B" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  initialsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emergencyBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0B0F19',
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1E293B',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0B0F19',
  }
});
