import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DotIndicator from './../../../assets/components/DotIndicator'; // Caminho para o componente de indicador de progresso

export function Address({ route }) {
  const navigation = useNavigation();
  const [userType, setUserType] = useState("Endereço do Usuário");
  const [address, setAddress] = useState({
    street: '',
    neighborhood: '',
    number: '',
    city: '',
    state: '',
    complement: '',
  });

  const { personalData } = route.params || {}; // Definindo personalData como um objeto vazio se route.params não estiver definido

  const handleNextPress = () => {
    const userData = {
      ...personalData,
      address: address,
    };
    navigation.navigate('Account', { userData });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Personal')}>
          <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.userType}>{userType}</Text>

        <Text style={styles.subTitle}>Endereço</Text>
        <View style={styles.orangeBorder}>
          <TextInput 
            style={styles.input} 
            value={address.street}
            onChangeText={text => setAddress({...address, street: text})}
          />
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.leftField}>
            <Text style={styles.subTitle}>Bairro</Text>
            <View style={styles.orangeBorder}>
              <TextInput 
                style={styles.input} 
                value={address.neighborhood}
                onChangeText={text => setAddress({...address, neighborhood: text})}
              />
            </View>
          </View>
          <View style={styles.rightField}>
            <Text style={styles.subTitle}>Número</Text>
            <View style={styles.orangeBorder}>
              <TextInput 
                style={styles.input} 
                value={address.number}
                onChangeText={text => setAddress({...address, number: text})}
              />
            </View>
          </View>
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.leftField}>
            <Text style={styles.subTitle}>Cidade</Text>
            <View style={styles.orangeBorder}>
              <TextInput 
                style={styles.input} 
                value={address.city}
                onChangeText={text => setAddress({...address, city: text})}
              />
            </View>
          </View>
          <View style={styles.rightField}>
            <Text style={styles.subTitle}>UF</Text>
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

      <View style={styles.bottomContainer}>
        <DotIndicator totalSteps={3} currentStep={1} />
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
});

export default Address;
