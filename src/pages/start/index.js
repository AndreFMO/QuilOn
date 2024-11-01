import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { useTranslation } from 'react-i18next'; // Importando useTranslation

export function Start() {
  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false);
  const { t } = useTranslation(); // Obtendo a função de tradução

  useEffect(() => {
    async function loadAssets() {
      await Asset.loadAsync(require('./../../assets/backgound.png'));
      setIsReady(true);
    }

    loadAssets();
  }, []);

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleSignUpPress = () => {
    navigation.navigate('Personal');
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D86626" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('./../../assets/backgound.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('./../../assets/quilon.png')} style={styles.backgroundText}></Image>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.ButtonText}>{t('login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUpPress}>
            <Text style={styles.ButtonText}>{t('sign_up')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    height: "75%",
    width: "80%",
    justifyContent: 'flex-end',
    marginBottom: 36,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  backgroundText: {
    width: 300,
    height: 100,
    marginTop: 50,
  },
  loginButton: {
    backgroundColor: "#D86626",
    width: "100%",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
  },
  signUpButton: {
    width: "100%",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#FFF",
    elevation: 5,
  },
  ButtonText: {
    color: "#FFF",
    fontWeight: 'bold',
  },
});
