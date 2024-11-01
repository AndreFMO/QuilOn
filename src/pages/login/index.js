import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './../../UserContext';
import { API_BASE_URL } from './../../config';
import { useTranslation } from 'react-i18next'; // Importando useTranslation

export function Login() {
  const navigation = useNavigation();
  const { setUserId, setRepresentante } = useContext(UserContext);
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation(); // Obtendo a função de tradução

  const handleLogin = () => {
    fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          const userId = data.idUsuario;
          const representante = data.representante;
          
          setRepresentante(representante);
          setUserId(userId);
          
          navigation.navigate('MainTabNavigator');
        });
      } else {
        Alert.alert(t('error'), t('invalid_credentials')); // Usando tradução para erro
      }
    })
    .catch(error => {
      console.error('Error logging in:', error);
      Alert.alert(t('error'), t('login_error')); // Usando tradução para erro
    });
  };

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
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('./../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.title}>{t('login')}</Text>
        <Text style={styles.userType}>{t('account_data')}</Text>

        <Text style={styles.subTitle}>{t('email')}</Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={text => setEmail(text)}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.subTitle}>{t('password')}</Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.redfSenha}>{t('forgot_password')}</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.newHereText}>{t('new_here')}</Text>
          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.signupButtonText} onPress={() => navigation.navigate('Personal')}>{t('create_account')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {!keyboardIsVisible && (
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleLogin}>
          <Text style={styles.ButtonText}>{t('login')}</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>ou</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Image source={require('./../../assets/google.png')} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>{t('continue_with_google')}</Text>
        </TouchableOpacity>
      </View>
      )}
    </KeyboardAvoidingView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: "#FFF",
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
