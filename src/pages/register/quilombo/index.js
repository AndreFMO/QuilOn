import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image } from 'react-native';

export function Quilombo() {
  const [userType, setUserType] = useState("Representante Quilombola");

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity><Image source={require('./../../../assets/return.png')} style={styles.returnButton}></Image></TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/quilon.png')} style={styles.backgroundText}></Image>
        </View>

        <Text style={styles.title}>Cadastre-se</Text>
        <Text style={styles.userType}>{userType}</Text>

        <Text style={styles.subTitle}>Nome</Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input}/>
        </View>

        <View style={styles.contactArea}>
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

        <View style={styles.contactArea}>
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

        <TouchableOpacity style={styles.loginButton}>
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
    marginTop: 10,
  },
  orangeBorder: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: '#BF8B6E',
  },
  contactArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
  loginButton: {
    backgroundColor: "#D86626",
    width: "100%",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
    marginTop: 60,
  },
  ButtonText: {
    color: "#FFF",
    fontWeight: 'bold',
  },
});
