import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './../../../config';
import { UserContext } from './../../../UserContext';
import { useTranslation } from 'react-i18next';

export function UpdAddress({ route }) {
  const navigation = useNavigation();
  const { userId } = useContext(UserContext)
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
  const { t } = useTranslation();

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
  
      if (textResponse.includes('Endereço atualizado com sucesso')) {
        Alert.alert('Sucesso', 'Endereço atualizado com sucesso');
        navigation.goBack();
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

        <Text style={styles.title}>{t('data_change')}</Text>
        <Text style={styles.userType}>{t('address_user')}</Text>

        <Text style={styles.subTitle}>{t('address')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={address.street}
            onChangeText={text => setAddress({...address, street: text})}
          />
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.leftField}>
            <Text style={styles.subTitle}>{t('neighborhood')}<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TextInput 
                style={styles.input} 
                value={address.neighborhood}
                onChangeText={text => setAddress({...address, neighborhood: text})}
              />
            </View>
          </View>
          <View style={styles.rightField}>
            <Text style={styles.subTitle}>{t('number')}<Text style={styles.required}>*</Text></Text>
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
            <Text style={styles.subTitle}>{t('city')}<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TextInput 
                style={styles.input} 
                value={address.city}
                onChangeText={text => setAddress({...address, city: text})}
              />
            </View>
          </View>
          <View style={styles.rightField}>
            <Text style={styles.subTitle}>{t('state')}<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TextInput 
                style={styles.input} 
                value={address.state}
                onChangeText={text => setAddress({...address, state: text})}
              />
            </View>
          </View>
        </View>

        <Text style={styles.subTitle}>{t('complement')}</Text>
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
            <Text style={styles.ButtonText}>{t('update')}</Text>
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
    height: 45,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginTop: -6,
    marginBottom: -8,
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

