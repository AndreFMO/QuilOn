// Concluded.js
import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserContext } from '../../../../UserContext';

export function ConcludedProduct() {
  const navigation = useNavigation();
  const route = useRoute();

  const handleNextPress = () => {
    navigation.navigate('MyProducts');
  };

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../../assets/check-icon.png')} style={styles.check}></Image>
          <Text style={styles.subTitle}>Cadastrado com sucesso!</Text>
          <Text style={styles.description}>O cadastro do seu produto foi realizado com sucesso!</Text>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.ButtonText}>Próximo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: "5%",
    paddingBottom: 60,
    paddingTop: 100,
    justifyContent: "space-between"
  },
  containerLogo: {
    marginTop: "20%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  check: {
    marginTop: 20,
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
  },
  subTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    marginTop: 20,
  },
  description: {
    fontSize: 18,
    width: "85%",
    fontFamily: 'Poppins_400Regular',
    color: "grey",
    marginTop: 8,
    textAlign: "center"
  },
  nextButton: {
    backgroundColor: "#D86626",
    width: "100%",
    height: 50,
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
