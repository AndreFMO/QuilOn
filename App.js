import React from 'react';
import { StatusBar } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { NavigationContainer } from '@react-navigation/native';
import { Routes } from './src/routes';
import { UserProvider } from './src/UserContext';
import { CartProvider } from './src/cartContext';
import { LogBox } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import 'intl-pluralrules';

export default function App() {
  LogBox.ignoreLogs(['Clipboard has been extracted from react-native core']);

  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold, 
    Poppins_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <UserProvider>
        <CartProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Routes />
          </NavigationContainer>
        </CartProvider>
      </UserProvider>
    </I18nextProvider>
  );
}
