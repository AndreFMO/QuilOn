import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Login() {
  const navigation = useNavigation();

  const [userType, setUserType] = useState("Dados da conta");
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardIsVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardIsVisible(false);
      }
    );

    // Remove os listeners quando o componente for desmontado
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleNextPress = () => {
    navigation.navigate('MainTabNavigator');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Start')}>
          <Image source={require('./../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.title}>Faça seu login</Text>
        <Text style={styles.userType}>{userType}</Text>

        <Text style={styles.subTitle}>Email</Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} />
        </View>

        <Text style={styles.subTitle}>Senha</Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} />
        </View>

        <TouchableOpacity>
          <Text style={styles.redfSenha}>Esqueci minha senha?</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.newHereText}>Novo por aqui?</Text>
          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Crie sua conta!</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {!keyboardIsVisible && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.ButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Image source={require('./../../assets/google.png')} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Continue com Google</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 10,
  },
  returnButton: {
    height: 25,
    width: 30,
  },
  containerLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundText: {
    marginTop: 20,
    width: 230,
    height: 50,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginTop: 40,
  },
  userType: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: "grey",
  },
  subTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    marginTop: 40,
  },
  orangeBorder: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: '#BF8B6E',
  },
  input: {
    height: 30,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: -3,
  },
  redfSenha: {
    paddingTop: 20,
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
    color: "#D86626",
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  newHereText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: "#4D4D4D",
    marginRight: 5,
  },
  signupButtonText: {
    color: "#D86626",
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },
  bottomContainer: {
    paddingHorizontal: "5%",
    paddingTop: 20,
    paddingBottom: 30,
  },
  nextButton: {
    backgroundColor: "#D86626",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
  },
  ButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#4D4D4D",
  },
  orText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: "#4D4D4D",
    marginHorizontal: 10,
  },
  googleButton: {
    backgroundColor: "#FFF",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 0.2,
    borderColor: "#4D4D4D",
    elevation: 5,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#4D4D4D",
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
    marginLeft: -25,
  },
});

export default Login;
