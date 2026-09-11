import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/context/ThemeContext';
import { I18nProvider } from './src/context/I18nContext';
import { ContactProvider } from './src/context/ContactContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ToastNotification } from './src/components/ToastNotification';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <ContactProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <AppNavigator />
              <ToastNotification />
            </NavigationContainer>
          </ContactProvider>
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
