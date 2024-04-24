import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Personal() {
  const navigation = useNavigation();

  const [userType, setUserType] = useState("Dados do Usuário");

  const handleNextPress = () => {
    navigation.navigate('Address');
  };
  const handleReturnPress = () => {
    navigation.navigate('Start');
  };

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={handleReturnPress}><Image source={require('./../../../assets/return.png')} style={styles.returnButton}></Image></TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/quilon.png')} style={styles.backgroundText}></Image>
        </View>

        <Text style={styles.title}>Cadastre-se</Text>
        <Text style={styles.userType}>{userType}</Text>

        <Text style={styles.subTitle}>Nome</Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input}/>
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>Data de Nascimento</Text>
            <View style={styles.orangeBorder}>
              <TextInput style={styles.input}/>
            </View>
          </View>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>Sexo</Text>
            <View style={styles.orangeBorder}>
              <TextInput style={styles.input}/>
            </View>
          </View>
        </View>

        <Text style={styles.subTitle}>CPF</Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input}/>
        </View>

        <Text style={styles.subTitle}>RG</Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input}/>
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>Celular</Text>
            <View style={styles.orangeBorder}>
              <TextInput style={styles.input}/>
            </View>
          </View>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>Telefone</Text>
            <View style={styles.orangeBorder}>
              <TextInput style={styles.input}/>
            </View>
          </View>
        </View>

        <View style={styles.progressIndicatorContainer}>
          <View style={styles.progressIndicatorActive} />
          <View style={styles.progressIndicator} />
          <View style={styles.progressIndicator} />
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
    marginTop: 40,
    paddingHorizontal: "5%",
    paddingBottom: 100,
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
  contactField: {
    width: "48%",
  },
  input: {
    height: 30,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: -3,
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
  progressIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  progressIndicator: {
    width: 10,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 5,
  },
  progressIndicatorActive: {
    width: 20,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#BF8B6E',
    marginHorizontal: 5,
  },
});
