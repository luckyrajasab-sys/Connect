import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

// Screens
import { ProfileScreen } from '../screens/ProfileScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { ContactDetailScreen } from '../screens/ContactDetailScreen';
import { AddEditContactScreen } from '../screens/AddEditContactScreen';
import { QRHubScreen } from '../screens/QRHubScreen';
import { EmergencyScreen } from '../screens/EmergencyScreen';
import { ToolsSettingsScreen } from '../screens/ToolsSettingsScreen';

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Bottom Tab Navigator (Profile is 1st nav item as requested)
const MainTabNavigator = () => {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.glassBorder,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'ContactsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'QRHubTab') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'EmergencyTab') {
            iconName = focused ? 'shield-alert' : 'shield-alert-outline';
          } else if (route.name === 'ToolsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: t('profileTab') }}
      />
      <Tab.Screen
        name="ContactsTab"
        component={ContactsScreen}
        options={{ tabBarLabel: t('contactsTab') }}
      />
      <Tab.Screen
        name="QRHubTab"
        component={QRHubScreen}
        options={{ tabBarLabel: t('qrHubTab') }}
      />
      <Tab.Screen
        name="EmergencyTab"
        component={EmergencyScreen}
        options={{ tabBarLabel: t('emergencyTab') }}
      />
      <Tab.Screen
        name="ToolsTab"
        component={ToolsSettingsScreen}
        options={{ tabBarLabel: t('toolsTab') }}
      />
    </Tab.Navigator>
  );
};

// 2. Main Root Stack Navigator
export const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />
      <Stack.Screen
        name="AddEditContact"
        component={AddEditContactScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal'
        }}
      />
      <Stack.Screen name="QRHub" component={QRHubScreen} />
    </Stack.Navigator>
  );
};
