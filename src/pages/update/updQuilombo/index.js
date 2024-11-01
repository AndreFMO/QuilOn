import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from './../../../config';
import { useTranslation } from 'react-i18next';

export function UpdQuilombo() {
  const navigation = useNavigation();
  const route = useRoute();
  const { quilombo } = route.params || {};
  const { t } = useTranslation();

  const [quilomboData, setQuilomboData] = useState({
    name: '',
    certificationNumber: '',
    latitude: '',
    longitude: '',
    kmAndComplement: '',
  });

  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

  useEffect(() => {
    if (quilombo) {
      console.log("Dados recebidos no prompt:", quilombo);
    
      setQuilomboData({
        name: quilombo.name || '',
        certificationNumber: quilombo.certificacao || '',
        latitude: quilombo.latitude || '',
        longitude: quilombo.longitude || '',
        kmAndComplement: quilombo.complemento || '',
      });
    }

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
  }, [quilombo]);

  const handleNextPress = async () => {
    // Verifica se todos os campos estão preenchidos
    const { name, certificationNumber, latitude, longitude, kmAndComplement } = quilomboData;
    if (!name || !certificationNumber || !latitude || !longitude || !kmAndComplement) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios marcados por: *');
      return;
    }

    // Cria a string de latitude e longitude no formato esperado
    const latAndLng = `${latitude},${longitude}`;

    try {
      const quilomboResponse = await fetch(`${API_BASE_URL}/quilombo/${quilombo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name, 
          certificationNumber, 
          latAndLng, // Envia a latitude e longitude como uma string
          kmAndComplement 
        })
      });
  
      if (!quilomboResponse.ok) {
        throw new Error(`HTTP error! Status: ${quilomboResponse.status}`);
      }
  
      navigation.goBack();
    } catch (error) {
      console.error("Erro na promessa:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar os dados do quilombo.');
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
        <Text style={styles.userType}>{t('community_data')}</Text>

        <Text style={styles.subTitle}>{t('community_name')}</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.name}
            onChangeText={text => setQuilomboData({ ...quilomboData, name: text })}
          />
        </View>

        <Text style={styles.subTitle}>{t('certification_number')}</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.certificationNumber}
            onChangeText={text => setQuilomboData({ ...quilomboData, certificationNumber: text })}
          />
        </View>

        <Text style={styles.subTitle}>Latitude</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.latitude}
            onChangeText={text => setQuilomboData({ ...quilomboData, latitude: text })}
            keyboardType="numeric" // Permitir apenas números
          />
        </View>

        <Text style={styles.subTitle}>Longitude</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.longitude}
            onChangeText={text => setQuilomboData({ ...quilomboData, longitude: text })}
            keyboardType="numeric" // Permitir apenas números
          />
        </View>

        <Text style={styles.subTitle}>{t('kilometer_and_complement')}</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.kmAndComplement}
            onChangeText={text => setQuilomboData({ ...quilomboData, kmAndComplement: text })}
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
