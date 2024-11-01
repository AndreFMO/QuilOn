import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './../../../config';
import { UserContext } from './../../../UserContext';
import { useTranslation } from 'react-i18next';

export function UpdAccount() {
  const navigation = useNavigation();
  const { userId } = useContext(UserContext)
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setUserData(data);
          setEmail(data.email || '');
          setPassword(data.senha || '');
          setConfirmPassword(data.senha || '');
        } else {
          Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      }
    };

    fetchUserData();

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
  }, [userId]);

  const handleNextPress = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
  
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios marcados por: *');
      return;
    }
  
    try {
      const updatedUserData = {
        ...userData,
        email: email,
        senha: password,
      };
  
      const updateResponse = await fetch(`${API_BASE_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });
  
      const updateData = await updateResponse.json();
  
      if (updateResponse.ok) {
        Alert.alert('Sucesso', 'Usuário atualizado com sucesso.');
        navigation.goBack();
      } else {
        Alert.alert('Erro', updateData.message || 'Erro ao atualizar os dados do usuário.');
      }
    } catch (error) {
      console.error('Erro ao atualizar os dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados do usuário.');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.title}>{t('data_change')}</Text>
        <Text style={styles.userType}>{t('account_data')}</Text>

        <Text style={styles.subTitle}>{t('email')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        </View>

        <Text style={styles.subTitle}>{t('password')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        </View>

        <Text style={styles.subTitle}>{t('confirm_password')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        </View>
      </ScrollView>

      {!keyboardIsVisible && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.ButtonText}>{t('update')}</Text>
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
  required: {
    color: 'red',
    fontSize: 16,
  },
});
