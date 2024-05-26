import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import DotIndicator from './../../../assets/components/DotIndicator'; // Caminho para o componente de indicador de progresso

export function Account() {
  const navigation = useNavigation();

  const [userType, setUserType] = useState("Dados da Conta");
  const [isChecked, setIsChecked] = useState(false);

  const handleNextPress = () => {
    if (isChecked) {
      navigation.navigate('Quilombo');
    } else {
      navigation.navigate('Concluded');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Address')}>
          <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.userType}>{userType}</Text>

        <Text style={styles.subTitle}>Email</Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input}/>
        </View>

        <Text style={styles.subTitle}>Senha</Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input}/>
        </View>

        <Text style={styles.subTitle}>Confirmar senha</Text>
        <View style={styles.orangeBorder}>
          <TextInput style={styles.input}/>
        </View>

        <View style={styles.checkboxContainer}>
          <Switch
            trackColor={{ false: "#6666", true: "#D86626" }}
            thumbColor={isChecked ? "#ffffff" : "#ffffff"}
            ios_backgroundColor="#6666"
            onValueChange={() => setIsChecked(!isChecked)}
            value={isChecked}
          />
          <Text style={styles.checkboxText}>Entrar como representante quilombola</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <DotIndicator totalSteps={3} currentStep={2} />
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.ButtonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    marginTop: 50,
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
});

export default Account;
