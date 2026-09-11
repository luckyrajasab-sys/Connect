import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Mobile Notification Service
 * Handles sync alerts, birthday reminders, and backup notices
 */

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  async requestPermissions() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (e) {
      return false;
    }
  },

  async sendLocalAlert(title, body) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { timestamp: Date.now() },
        },
        trigger: null, // Send immediately
      });
    } catch (err) {
      console.warn('Could not send notification:', err);
    }
  }
};
