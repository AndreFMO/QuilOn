import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './../../../config';

export function MyCart({ route }) {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.tela}>
      
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  returnButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 1,
  },
  returnButton: {
    height: 25,
    width: 30,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#FFF",
    height: 380,
    width: 'auto',
  },
  productImage: {
    width: 394,
    height: '100%',
  },
  container: {
    backgroundColor: "#FFF",
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    width: '100%',
    padding: 20,
    paddingLeft: 30,
    marginTop: -30,
    elevation: 20,
  },
  productName: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginTop: 10,
    marginBottom: -5,
  },
  productPriceUnity: {
    color: '#D86626',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
  qtdButton: {
    backgroundColor: "#D86626",
    height: 38,
    width: 86,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  qtdButtonTouchable: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  qtdButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartPlusButton: {
    backgroundColor: "#D86626",
    height: 38,
    width: 85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
  },
  productCategory: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
  productTitles: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'Poppins_700Bold',
  },
  categoryArea: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 2,
  },
  categoryButton: {
    margin: 2,
    paddingHorizontal: 12,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 2,
    backgroundColor: "#FFF",
  },
  categoryText: {
    fontSize: 13.5,
    marginBottom: -3,
    fontFamily: 'Poppins_700Bold',
    color: 'grey',
  },
  selectedCategoryButton: {
    borderColor: '#D86626',
  },
  selectedCategoryText: {
    color: '#D86626',
  },
  productDescription: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Poppins_400Regular',
  },
  productQtd: {
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 10,
  },
  priceArea: {
    marginTop: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
  },
  nextButton: {
    backgroundColor: "#D86626",
    height: 60,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
  },
  ButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: 'bold',
  },
});
