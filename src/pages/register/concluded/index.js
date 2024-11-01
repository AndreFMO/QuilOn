import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; // Import do hook de tradução
import { UserContext } from '../../../UserContext';

export function Concluded() {
  const { t } = useTranslation(); // Hook para pegar a função de tradução
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, representante } = route.params;
  const { setUserId, setRepresentante } = useContext(UserContext);

  useEffect(() => {
    setUserId(userId);
    setRepresentante(representante);
    console.log("Novo usuário cadastrado! ID:", userId);
  }, [userId, setUserId, representante, setRepresentante]);

  const handleNextPress = () => {
    navigation.navigate('MainTabNavigator');
  };

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/check-icon.png')} style={styles.check}></Image>
          <Text style={styles.subTitle}>{t('registration_successful')}</Text>
          <Text style={styles.description}>{t('product_registration_success')}</Text>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.ButtonText}>{t('next')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flexGrow: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    marginTop: 25,
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
    width: "80%",
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
