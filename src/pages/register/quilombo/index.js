import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from './../../../config';

export function Quilombo() {
  const navigation = useNavigation();
  const route = useRoute();

  const { personalData, addressData } = route.params || {};

  useEffect(() => {
    console.log("Dados recebidos:", personalData, addressData);
  }, []);

  const [userType, setUserType] = useState("Estamos quase lá, insira os dados da sua comunidade");
  const [quilomboData, setQuilomboData] = useState({
    name: '',
    certificationNumber: '',
    latAndLng: '',
    kmAndComplement: '',
  });

  const handleNextPress = async () => {
    try {
      // Primeiro, envia os dados do usuário
      const userResponse = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalData),
      });

      if (!userResponse.ok) throw new Error('Erro ao cadastrar usuário');

      const userData = await userResponse.json();
      const userId = userData.id;

      // Em seguida, envia os dados do endereço
      const addressResponse = await fetch(`${API_BASE_URL}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...addressData, idUsuario: userId }),
      });

      if (!addressResponse.ok) throw new Error('Erro ao cadastrar endereço');

      // Finalmente, envia os dados do quilombo
      const quilomboResponse = await fetch(`${API_BASE_URL}/quilombo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...quilomboData, idUsuario: userId }),
      });

      if (!quilomboResponse.ok) throw new Error('Erro ao cadastrar quilombo');

      navigation.navigate('Concluded');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.title}>Dados do Quilombo</Text>
        <Text style={styles.userType}>{userType}</Text>

        <Text style={styles.subTitle}>Nome da comunidade</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.name}
            onChangeText={(text) => setQuilomboData({ ...quilomboData, name: text })}
          />
        </View>

        <Text style={styles.subTitle}>Número de certificação do Quilombo</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.certificationNumber}
            onChangeText={(text) => setQuilomboData({ ...quilomboData, certificationNumber: text })}
          />
        </View>

        <Text style={styles.subTitle}>Latitude e Longitude</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.latAndLng}
            onChangeText={(text) => setQuilomboData({ ...quilomboData, latAndLng: text })}
          />
        </View>

        <Text style={styles.subTitle}>Quilometro e complemento</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={quilomboData.kmAndComplement}
            onChangeText={(text) => setQuilomboData({ ...quilomboData, kmAndComplement: text })}
          />
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.ButtonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
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

export default Quilombo;
