import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from './../../../config';
import { CartContext } from './../../../cartContext';
import { UserContext } from './../../../UserContext';

export function MyCart() {
  const navigation = useNavigation();
  const { cart, incrementQuantity, decrementQuantity, removeFromCart } = useContext(CartContext);
  const { userId } = useContext(UserContext);

  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddress = async () => {
    if (userId) {
      try {
        const response = await fetch(`${API_BASE_URL}/addresses`);
        const data = await response.json();
        const addresses = data.addresses.map(addr => ({
          idEndereco: addr[0],
          idUsuario: addr[1],
          endereco: addr[2],
          bairro: addr[3],
          numero: addr[4],
          cidade: addr[5],
          uf: addr[6],
          complemento: addr[7]
        }));
        const userAddress = addresses.find(addr => addr.idUsuario === userId);

        setAddress(userAddress || null);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar o endereço:", error);
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [userId])
  );

  return (
    <View style={styles.tela}>
      <View style={styles.contentContainer}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButtonContainer}>
          <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>

        <Text style={styles.title}>Meu Carrinho</Text>

        <View style={styles.productsArea}>
          {cart.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCart}>Seu carrinho está vazio.</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.productsList}>
              {cart.map((item, index) => (
                <TouchableOpacity key={index} style={styles.products}>
                  <Image source={{ uri: `${API_BASE_URL}/upload/${item.product[0]}/1` }} style={styles.productImage} />
                  <View style={styles.productDetails}>

                    <View style={styles.productPrice}>
                      <Text style={StyleSheet.flatten([styles.productTitles, { width: '85%' }])} numberOfLines={1} ellipsizeMode="tail">{item.product[1]}</Text>
                      <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(index)}>
                        <Icon name="trash" size={24} color="#ffff" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.productPrice}>
                      <Text style={styles.productTitles}>R$ {item.product[5]}</Text>
                      <View style={styles.qtdButton}>
                        <TouchableOpacity style={styles.qtdButtonTouchable} onPress={() => decrementQuantity(index)}>
                          <Text style={styles.qtdButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtdButtonText}>{item.quantity}</Text>
                        <TouchableOpacity style={styles.qtdButtonTouchable} onPress={() => incrementQuantity(index)}>
                          <Text style={styles.qtdButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

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

        <TouchableOpacity style={styles.address} onPress={() => navigation.navigate('UpdAddress', { address, idEndereco: address.idEndereco })}>
          <View>
            <Text style={StyleSheet.flatten([styles.productTitles])}>Endereço de Entrega</Text>
            {loading ? (
              <Text style={StyleSheet.flatten([styles.addressDescription])}>Carregando...</Text>
            ) : address ? (
              <>
                <Text style={StyleSheet.flatten([styles.addressDescription])}>{address.endereco}, nº {address.numero}, {address.bairro}</Text>
                <Text style={StyleSheet.flatten([styles.addressDescription])}>{address.cidade}-{address.uf}</Text>
                {address.complemento && <Text style={StyleSheet.flatten([styles.addressDescription])}>{address.complemento}</Text>}
              </>
            ) : (
              <Text style={StyleSheet.flatten([styles.addressDescription])}>Endereço não encontrado</Text>
            )}
          </View>
          <Icon name="chevron-right" size={20} color="black" />
        </TouchableOpacity>


        <View style={styles.totalPriceArea}>
          <Text style={styles.totalPrice}>Total ({cart.length} Itens):</Text>
          <Text style={styles.totalPrice1}>R$ {cart.reduce((acc, item) => acc + item.product[5] * item.quantity, 0).toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.ButtonText}>Processar encomenda</Text>
          <View style={styles.processIcon}>
            <Icon name="chevron-right" size={18} color="#D86626" />
          </View>
        </TouchableOpacity>

      </View>
    </View>
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
    marginTop: 50,
    paddingBottom: 30,
  },
  returnButtonContainer: {
    marginBottom: 20,
  },
  returnButton: {
    height: 25,
    width: 30,
    marginHorizontal: "6%",
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginHorizontal: "6%",
  },
  productsArea:{
    flex: 1,
  },
  productsList: {
    paddingHorizontal: "6%",
  },
  products: {
    marginVertical: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    borderRadius: 10,
  },
  productDetails:{
    width: '72%',
    justifyContent: 'space-between',
  },
  productImage:{
    width: 80,
    height: 80,
    borderRadius: 12,
    elevation: 5,
  },
  removeButton: {
    marginTop: 2,
    backgroundColor: "#D86626",
    height: 30,
    width: 30,
    alignItems: 'center',
    borderColor: "#6666",
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
  },
  productPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qtdButton: {
    backgroundColor: "#D86626",
    height: 34,
    width: 86,
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
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
    marginTop: 5,
    fontFamily: 'Poppins_700Bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyCart: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 50,
  },
  address: {
    marginTop: 8,
    marginHorizontal: "6%",
    paddingHorizontal: "6%",
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF',
    elevation: 5,
    borderRadius: 10,
    marginBottom: 15,
  },
  
  addressDescription: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Poppins_400Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    marginTop: 15,
    marginBottom: 15,
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
    marginBottom: 16,
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
