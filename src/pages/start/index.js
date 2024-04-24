import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Start() {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate('MainTabNavigator');
  };

  const handleSignUpPress = () => {
    navigation.navigate('Personal');
  };

  return (
    <ImageBackground source={require('./../../assets/backgound.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('./../../assets/quilon.png')} style={styles.backgroundText}></Image>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.ButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUpPress}>
            <Text style={styles.ButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  signUpButton:{
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
