import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Switch, Alert, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DotIndicator from '../../../assets/components/DotIndicator';
import { API_BASE_URL } from './../../../config';
import { useTranslation } from 'react-i18next';

export function Account() {
  const { t } = useTranslation(); // Hook para pegar as traduções
  const navigation = useNavigation();
  const route = useRoute();
  const { personalData = {}, addressData = {} } = route.params || {};

  const [userType, setUserType] = useState(t('account_data')); // Usando a tradução
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardIsVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardIsVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleNextPress = async () => {
    if (isSubmitting) return;

    if (password !== confirmPassword) {
      Alert.alert(t('error'), t('password_mismatch')); // Usando a tradução
      return;
    }

    if (isChecked) {
      const personalDataWithCredentials = {
        ...personalData,
        email,
        senha: password,
      };
      navigation.navigate('Quilombo', { personalData: personalDataWithCredentials, addressData });
      return;
    }

    if (!email || !password || !confirmPassword) {
      Alert.alert(t('error'), t('error_fill_required')); // Usando a tradução
      return;
    }

    for (const key in personalData) {
      if (personalData.hasOwnProperty(key) && personalData[key] === '') continue;
      if (!personalData[key]) {
        Alert.alert(t('error'), `O campo ${key} está vazio.`);
        return;
      }
    }

    for (const key in addressData) {
      if (addressData.hasOwnProperty(key) && addressData[key] === '') continue;
      if (!addressData[key]) {
        Alert.alert(t('error'), `O campo ${key} está vazio.`);
        return;
      }
    }

    const userData = {
      nome: personalData.name,
      dataNasc: personalData.birthDate,
      sexo: personalData.sex,
      cpf: personalData.cpf,
      rg: personalData.rg,
      celular: personalData.cellphone,
      telefone: personalData.phone || '',
      email: email,
      senha: password,
    };

    const addressDataToSend = {
      endereco: addressData.street,
      bairro: addressData.neighborhood,
      numero: addressData.number,
      cidade: addressData.city,
      uf: addressData.state,
      complemento: addressData.complement || '',
    };

    try {
      setIsSubmitting(true);
      const userResponse = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }

      const userResult = await userResponse.json();
      const userId = userResult.idUsuario;
      setUserId(userId);

      addressDataToSend.idUsuario = userId;

      const addressResponse = await fetch(`${API_BASE_URL}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressDataToSend),
      });

      if (!addressResponse.ok) {
        throw new Error(`HTTP error! Status: ${addressResponse.status}`);
      }

      navigation.navigate('Concluded', { userId });
    } catch (error) {
      console.error('Erro na promessa:', error);
      Alert.alert(t('error'), 'Ocorreu um erro ao realizar o cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.userType}>{userType}</Text>

        <Text style={styles.subTitle}>
          {t('email')}
          <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        </View>

        <Text style={styles.subTitle}>
          {t('password')}
          <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        </View>

        <Text style={styles.subTitle}>
          {t('confirm_password')}
          <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        </View>

        <View style={styles.checkboxContainer}>
          <Switch
            trackColor={{ false: '#6666', true: '#D86626' }}
            thumbColor={isChecked ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#6666"
            onValueChange={() => setIsChecked(!isChecked)}
            value={isChecked}
          />
          <Text style={styles.checkboxText}>{t('quilombola_representative')}</Text>
        </View>
      </ScrollView>

      {!keyboardIsVisible && (
        <View style={styles.bottomContainer}>
          <DotIndicator totalSteps={3} currentStep={2} />
          <TouchableOpacity
            style={[styles.nextButton, isSubmitting && { backgroundColor: '#ccc' }]}
            onPress={handleNextPress}
            disabled={isSubmitting}
          >
            <Text style={styles.ButtonText}>{isSubmitting ? t('submitting') : t('next')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: "#FFF",
  },
  container: {
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
  userType: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: "grey",
    marginTop: 40,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    marginTop: 15,
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
  bottomContainer: {
    paddingHorizontal: "5%",
    paddingTop: 20,
    paddingBottom: 30,
  },
  nextButton: {
    backgroundColor: "#D86626",
    height: 50,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
  },
  ButtonText: {
    color: "#FFF",
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    marginLeft: 10,
  },
  required: {
    color: 'red',
    fontSize: 16,
  },
});

export default Account;
