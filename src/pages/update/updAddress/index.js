import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DotIndicator from './../../../assets/components/DotIndicator'; 
import { API_BASE_URL } from './../../../config';
import { CartContext } from './../../../cartContext';
import { UserContext } from './../../../UserContext'; // Importa o UserContext

export function UpdAddress({ route }) {
  const navigation = useNavigation();
  const { userId } = useContext(UserContext)
  const [userType, setUserType] = useState("Atualizar Endereço");
  const [address, setAddress] = useState({
    street: '',
    neighborhood: '',
    number: '',
    city: '',
    state: '',
    complement: '',
  });
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

  // Desestruturação para obter o endereço e o idEndereco passados via route.params
  const { address: initialAddress, idEndereco } = route.params || {};

  useEffect(() => {
    // Inicializa o endereço com os dados recebidos de route.params
    if (initialAddress) {
      setAddress({
        street: initialAddress.endereco || '',
        neighborhood: initialAddress.bairro || '',
        number: initialAddress.numero || '',
        city: initialAddress.cidade || '',
        state: initialAddress.uf || '',
        complement: initialAddress.complemento || '',
      });
    }

    // Listeners do teclado
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
  }, [initialAddress]);

  const handleNextPress = async () => {
    if (!address.street || !address.neighborhood || !address.number || !address.city || !address.state) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios marcados por: *');
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/address/${idEndereco}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: userId,
          endereco: address.street,
          bairro: address.neighborhood,
          numero: address.number,
          cidade: address.city,
          uf: address.state,
          complemento: address.complement,
        }),
      });
  
      const textResponse = await response.text();
      console.log('Resposta da API como texto:', textResponse);
  
      if (textResponse.includes('Endereço atualizado com sucesso')) {
        Alert.alert('Sucesso', 'Endereço atualizado com sucesso');
        navigation.navigate('MyCart');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o endereço. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro ao atualizar o endereço:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar atualizar o endereço.');
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

        <Text style={styles.userType}>{userType}</Text>

        <Text style={styles.subTitle}>Endereço<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={address.street}
            onChangeText={text => setAddress({...address, street: text})}
          />
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.leftField}>
            <Text style={styles.subTitle}>Bairro<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TextInput 
                style={styles.input} 
                value={address.neighborhood}
                onChangeText={text => setAddress({...address, neighborhood: text})}
              />
            </View>
          </View>
          <View style={styles.rightField}>
            <Text style={styles.subTitle}>Número<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TextInput 
                style={styles.input} 
                value={address.number}
                onChangeText={text => setAddress({...address, number: text})}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.leftField}>
            <Text style={styles.subTitle}>Cidade<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TextInput 
                style={styles.input} 
                value={address.city}
                onChangeText={text => setAddress({...address, city: text})}
              />
            </View>
          </View>
          <View style={styles.rightField}>
            <Text style={styles.subTitle}>UF<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TextInput 
                style={styles.input} 
                value={address.state}
                onChangeText={text => setAddress({...address, state: text})}
              />
            </View>
          </View>
        </View>

        <Text style={styles.subTitle}>Complemento</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={address.complement}
            onChangeText={text => setAddress({...address, complement: text})}
          />
        </View>
      </ScrollView>

      {!keyboardIsVisible && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.ButtonText}>Atualizar</Text>
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
    marginTop: 50,
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
  horizontalArea: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftField: {
    width: "72%",
  },
  rightField: {
    width: "24%",
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

