import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from './../../../config';

export function MyCart() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.tela}>
      <View style={styles.contentContainer}>

        <ScrollView contentContainerStyle={styles.container}>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButtonContainer}>
            <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
          </TouchableOpacity>

          <Text style={styles.title}>Meu Carrinho</Text>

          <ScrollView contentContainerStyle={styles.productsArea}>
            <TouchableOpacity style={styles.products}>
              <Image source={require('./../../../assets/product-test.png')} style={styles.productImage} />
              <View style={styles.productDetails}>
                <View>
                  <Text style={styles.productTitles}>Cestos artesanais</Text>
                </View>
                <View style={styles.productPrice}>
                  <Text style={styles.productTitles}>R$ 29,99</Text>
                  <View style={styles.qtdButton}>
                    <TouchableOpacity style={styles.qtdButtonTouchable}>
                      <Text style={styles.qtdButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtdButtonText}>1</Text>
                    <TouchableOpacity style={styles.qtdButtonTouchable}>
                      <Text style={styles.qtdButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.products}>
              <Image source={require('./../../../assets/product-test.png')} style={styles.productImage} />
              <View style={styles.productDetails}>
                <View>
                  <Text style={styles.productTitles}>Cestos artesanais</Text>
                </View>
                <View style={styles.productPrice}>
                  <Text style={styles.productTitles}>R$ 29,99</Text>
                  <View style={styles.qtdButton}>
                    <TouchableOpacity style={styles.qtdButtonTouchable}>
                      <Text style={styles.qtdButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtdButtonText}>1</Text>
                    <TouchableOpacity style={styles.qtdButtonTouchable}>
                      <Text style={styles.qtdButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.searchArea}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                returnKeyType="search"
                placeholder="Código Promocional"
              />
              <TouchableOpacity style={styles.codeButton} >
                <Text style={styles.codeButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>


          <View style={styles.totalPriceArea}>
            <Text style={styles.totalPrice}>Total (4 Itens):</Text>
            <Text style={styles.totalPrice1}>R$ 700,00</Text>
          </View>

          <TouchableOpacity style={styles.nextButton} >
            <Text style={styles.ButtonText}>Processar encomenda</Text>
            <View style={styles.processIcon}>
              <Icon name="chevron-right" size={18} color="#D86626" /> 
            </View>
          </TouchableOpacity>
        </ScrollView>



      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  returnButtonContainer: {
    marginBottom: 20,
  },
  returnButton: {
    height: 25,
    width: 30,
    marginHorizontal: "6%",
  },
  container: {
    flexGrow: 1,
    marginTop: "15%",
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginHorizontal: "6%",
  },
  productsArea:{
    paddingBottom: 20,
    paddingHorizontal: "6%",
  },
  products: {
    marginTop: 15,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    elevation: 10,
    borderRadius: 10,
  },
  productDetails:{
    width: 230,
  },
  productImage:{
    width: 80,
    height: 80,
    borderRadius: 12,
    elevation: 5,
  },
  productPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qtdButton: {
    backgroundColor: "#D86626",
    height: 38,
    width: 86,
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
  productTitles: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'Poppins_700Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    marginVertical: 25,
    marginHorizontal: "6%",
    paddingHorizontal: 25,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },
  input: {
    width: 200,
    marginHorizontal: 10,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: -6,
  },
  codeButton: {
    backgroundColor: "#D86626",
    height: 35,
    width: 70,
    marginHorizontal: '6%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: "#6666",
  },
  codeButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalPriceArea: {
    marginHorizontal: '6%',
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalPrice: {
    color: 'gray',
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },
  totalPrice1: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
  },
  nextButton: {
    backgroundColor: "#D86626",
    height: 55,
    marginHorizontal: '6%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6666",
    padding: 12,
    elevation: 5,
  },
  ButtonText: {
    marginLeft: 10,
    color: "#FFF",
    fontSize: 18,
    fontWeight: 'bold',
  },
  processIcon: {
    backgroundColor: "#fff",
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    paddingTop: 1,
    paddingLeft: 4,
  },
});
