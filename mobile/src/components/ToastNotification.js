import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useContacts } from '../context/ContactContext';
import { Ionicons } from '@expo/vector-icons';

export const ToastNotification = () => {
  const { toast } = useContacts();

  if (!toast) return null;

  const getIconAndColor = () => {
    switch (toast.type) {
      case 'success':
        return { icon: 'checkmark-circle', color: '#10B981', bg: 'rgba(16, 185, 129, 0.95)' };
      case 'error':
        return { icon: 'alert-circle', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.95)' };
      case 'warning':
        return { icon: 'warning', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.95)' };
      default:
        return { icon: 'information-circle', color: '#3B82F6', bg: 'rgba(30, 41, 59, 0.95)' };
    }
  };

  const { icon, color, bg } = getIconAndColor();

  return (
    <SafeAreaView pointerEvents="none" style={styles.container}>
      <View style={[styles.toastBox, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.messageText}>{toast.message}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    marginRight: 8,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  }
});
