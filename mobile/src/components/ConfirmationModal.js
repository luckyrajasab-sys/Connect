import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}) => {
  const { colors } = useTheme();
  const isDanger = type === 'danger';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)' }]}>
            <Ionicons
              name={isDanger ? 'trash-outline' : 'help-circle-outline'}
              size={28}
              color={isDanger ? '#EF4444' : '#3B82F6'}
            />
          </View>

          <Text style={[styles.titleText, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.messageText, { color: colors.textMuted }]}>{message}</Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={onCancel}
            >
              <Text style={[styles.btnText, { color: colors.text }]}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.confirmBtn,
                { backgroundColor: isDanger ? '#EF4444' : colors.primary }
              ]}
              onPress={onConfirm}
            >
              <Text style={[styles.btnText, { color: '#FFFFFF', fontWeight: '700' }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
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
    borderWidth: 1,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {},
  confirmBtn: {},
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  }
});
