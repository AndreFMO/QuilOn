import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Switch, Alert, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DotIndicator from './../../../assets/components/DotIndicator';
import { API_BASE_URL } from './../../../config';

export function Account() {
  const navigation = useNavigation();
  const route = useRoute();
  const { personalData = {}, addressData = {} } = route.params || {};

  const [userType, setUserType] = useState("Dados da Conta");
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário
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

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleNextPress = async () => {
    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    // Verificar se a opção de entrar como representante quilombola está marcada
   if (isChecked) {
     // Adicionar email e senha aos dados pessoais
     const personalDataWithCredentials = {
       ...personalData,
       email,
       senha: password
     };
     
     // Passar todos os dados (incluindo email e senha) para a tela Quilombo
     navigation.navigate('Quilombo', { personalData: personalDataWithCredentials, addressData });
     return; // Retorna para evitar a execução do restante do código
   }
 

    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios marcados por: *');
      return;
    }
  
    // Verificar se os dados pessoais foram preenchidos
    for (const key in personalData) {
      if (personalData.hasOwnProperty(key) && personalData[key] === '') {
        continue; // Ignora os campos vazios
      }
      if (!personalData[key]) {
        Alert.alert('Erro', `O campo ${key} está vazio.`);
        return;
      }
    }
    
    // Verificar se os dados de endereço foram preenchidos
    for (const key in addressData) {
      if (addressData.hasOwnProperty(key) && addressData[key] === '') {
        continue; // Ignora os campos vazios
      }
      if (!addressData[key]) {
        Alert.alert('Erro', `O campo ${key} está vazio.`);
        return;
      }
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
      email: email,
      senha: password,
    };
  
    const addressDataToSend = {
      endereco: addressData.street,
      bairro: addressData.neighborhood,
      numero: addressData.number,
      cidade: addressData.city,
      uf: addressData.state,
      complemento: addressData.complement || ''
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
      setUserId(userId); // Atualiza o estado do ID do usuário

      addressDataToSend.idUsuario = userId;
  
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
  
      navigation.navigate('Concluded', { userId }); // Passa o ID do usuário como parâmetro

    } catch (error) {
      console.error("Erro na promessa:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao realizar o cadastro.');
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

        <Text style={styles.userType}>{userType}</Text>

        <Text style={styles.subTitle}>Email<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        </View>

        <Text style={styles.subTitle}>Senha<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        </View>

        <Text style={styles.subTitle}>Confirmar senha<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        </View>


        <View style={styles.checkboxContainer}>
          <Switch
            track            trackColor={{ false: "#6666", true: "#D86626" }}
            thumbColor={isChecked ? "#ffffff" : "#ffffff"}
            ios_backgroundColor="#6666"
            onValueChange={() => setIsChecked(!isChecked)}
            value={isChecked}
          />
          <Text style={styles.checkboxText}>Entrar como representante quilombola</Text>
        </View>
      </ScrollView>

      {!keyboardIsVisible && (
        <View style={styles.bottomContainer}>
          <DotIndicator totalSteps={3} currentStep={2} />
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.ButtonText}>Próximo</Text>
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
