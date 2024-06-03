// App.js
import React from 'react';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { NavigationContainer } from '@react-navigation/native';
import { Routes } from './src/routes';
import { UserProvider } from './src/UserContext'; // Certifique-se de que o caminho está correto

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold, Poppins_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </UserProvider>
  );
}
