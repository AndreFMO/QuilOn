import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { API_BASE_URL } from './../../../config';
import { useTranslation } from 'react-i18next'; // Importa o hook de tradução

export function Quilombo() {
  const { t } = useTranslation(); // Inicializa a tradução
  const navigation = useNavigation();
  const route = useRoute();
  const { personalData, addressData } = route.params || {};

  const [quilomboData, setQuilomboData] = useState({
    name: '',
    certificationNumber: '',
    latAndLng: '',
    kmAndComplement: '',
  });

  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardIsVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardIsVisible(false);
    });

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Erro', t('error_location_permission')); // Usa a tradução
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setQuilomboData({
          ...quilomboData,
          latAndLng: `${location.coords.latitude},${location.coords.longitude}`
        });
      } catch (error) {
        Alert.alert('Erro', t('error_location')); // Usa a tradução
        console.error(error);
      }
    };

    getLocation();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleNextPress = async () => {
    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!quilomboData.name || !quilomboData.certificationNumber || !quilomboData.latAndLng) {
      Alert.alert('Erro', t('error_fill_fields')); // Usa a tradução
      return;
    }

    // Dados do usuário
    const userData = {
      nome: personalData.name,
      dataNasc: personalData.birthDate,
      sexo: personalData.sex,
      cpf: personalData.cpf,
      rg: personalData.rg,
      celular: personalData.cellphone,
      telefone: personalData.phone || '',
      email: personalData.email,
      senha: personalData.senha,
      representante: 1,
    };

    // Dados de endereço
    const addressDataToSend = {
      endereco: addressData.street,
      bairro: addressData.neighborhood,
      numero: addressData.number,
      cidade: addressData.city,
      uf: addressData.state,
      complemento: addressData.complement || ''
    };

    // Dados do Quilombo
    const quilomboDataToSend = {
      name: quilomboData.name,
      certificationNumber: quilomboData.certificationNumber,
      latAndLng: quilomboData.latAndLng,
      kmAndComplement: quilomboData.kmAndComplement,
    };

    try {
      // Envia dados do usuário
      const userResponse = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!userResponse.ok) {
        throw new Error(`Erro no cadastro de usuário! Status: ${userResponse.status}`);
      }

      const userResult = await userResponse.json();
      const userId = userResult.idUsuario;

      addressDataToSend.idUsuario = userId;
      quilomboDataToSend.idUsuario = userId;

      // Envia dados de endereço
      const addressResponse = await fetch(`${API_BASE_URL}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressDataToSend),
      });

      if (!addressResponse.ok) {
        throw new Error(`Erro no cadastro de endereço! Status: ${addressResponse.status}`);
      }

      // Envia dados do quilombo
      const quilomboResponse = await fetch(`${API_BASE_URL}/quilombo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quilomboDataToSend),
      });

      if (!quilomboResponse.ok) {
        throw new Error(`Erro no cadastro do Quilombo! Status: ${quilomboResponse.status}`);
      }

      navigation.navigate('Concluded', { userId, representante: 1 });

    } catch (error) {
      console.error("Erro na promessa:", error);
      Alert.alert('Erro', t('registration_error')); // Usa a tradução
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>

        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.title}>{t('community_data')}</Text>
        
        <Text style={styles.subTitle}>{t('community_name')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.name}
            onChangeText={text => setQuilomboData({...quilomboData, name: text})}
          />
        </View>

        <Text style={styles.subTitle}>{t('certification_number')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.certificationNumber}
            onChangeText={text => setQuilomboData({...quilomboData, certificationNumber: text})}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subTitle}>{t('kilometer_and_complement')}</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.kmAndComplement}
            onChangeText={text => setQuilomboData({...quilomboData, kmAndComplement: text})}
          />
        </View>
      </ScrollView>

      {!keyboardIsVisible && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.ButtonText}>{t('next')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    backgroundColor: "#FFF",
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

export default Quilombo;
