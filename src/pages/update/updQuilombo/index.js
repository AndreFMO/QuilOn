import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from './../../../config';

export function UpdQuilombo() {
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

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleNextPress = async () => {
    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!quilomboData.name || !quilomboData.certificationNumber || !quilomboData.latAndLng) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios marcados por: *');
      return;
    }
  
    // Se todas as verificações passarem, continuar com o envio dos dados
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
    };
  
    const addressDataToSend = {
      endereco: addressData.street,
      bairro: addressData.neighborhood,
      numero: addressData.number,
      cidade: addressData.city,
      uf: addressData.state,
      complemento: addressData.complement || ''
    };

    const quilomboDataToSend = {
      name: quilomboData.name,
      certificationNumber: quilomboData.certificationNumber,
      latAndLng: quilomboData.latAndLng,
      kmAndComplement: quilomboData.kmAndComplement,
    };

    try {
      const userResponse = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
  
      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }
  
      const userResult = await userResponse.json();
      const userId = userResult.idUsuario;

      addressDataToSend.idUsuario = userId;
      quilomboDataToSend.idUsuario = userId;
      
      // Envia endereço
      const addressResponse = await fetch(`${API_BASE_URL}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressDataToSend)
      });
  
      if (!addressResponse.ok) {
        throw new Error(`HTTP error! Status: ${addressResponse.status}`);
      }

      // Envia quilombo
      const quilomboResponse = await fetch(`${API_BASE_URL}/quilombo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quilomboDataToSend)
      });
  
      if (!quilomboResponse.ok) {
        throw new Error(`HTTP error! Status: ${quilomboResponse.status}`);
      }
  
      navigation.navigate('Concluded', { userId }); // Passa o ID do usuário como parâmetro

    } catch (error) {
      console.error("Erro na promessa:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao realizar o cadastro.');
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

        <Text style={styles.title}>Dados do Quilombo</Text>

        <Text style={styles.subTitle}>Nome da comunidade</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.name}
            onChangeText={text => setQuilomboData({...quilomboData, name: text})}
          />
        </View>

        <Text style={styles.subTitle}>Número de certificação do Quilombo</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.certificationNumber}
            onChangeText={text => setQuilomboData({...quilomboData, certificationNumber: text})}
          />
        </View>

        <Text style={styles.subTitle}>Latitude e Longitude</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.latAndLng}
            onChangeText={text => setQuilomboData({...quilomboData, latAndLng: text})}
          />
        </View>

        <Text style={styles.subTitle}>Quilometro e complemento</Text>
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
            <Text style={styles.ButtonText}>Próximo</Text>
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
});

