import React, { useState, useEffect, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './../../../config';
import { CartContext } from './../../../cartContext';

export function ProductDetail({ route }) {
  const { product } = route.params;
  const navigation = useNavigation();
  const [totalImages, setTotalImages] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  const categories = ['Acessórios', 'Cestarias', 'Cerâmicas', 'Outros'];
  const reorderedCategories = [product[2], ...categories.filter(category => category !== product[2])];

  useEffect(() => {
    fetchTotalImages();
  }, []);

  const fetchTotalImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/upload/${product[0]}/total`);
      const data = await response.json();
      setTotalImages(data.total_images);
    } catch (error) {
      // console.error('Erro ao obter o número total de imagens:', error);
    }
  };

  const images = useMemo(() => {
    const imgs = [];
    for (let i = 1; i <= totalImages; i++) {
      const imageUrl = `${API_BASE_URL}/upload/${product[0]}/${i}?timestamp=${new Date().getTime()}`;
      imgs.push(
        <Image key={i} source={{ uri: imageUrl }} style={styles.productImage} />
      );
    }
    return imgs;
  }, [totalImages]);

  const [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold, Poppins_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const incrementQuantity = () => {
    if (quantity < product[6]) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCartAndNavigate = () => {
    addToCart(product, quantity);
    navigation.navigate('MyCart');
  };

  return (
    <ScrollView style={styles.tela}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButtonContainer}>
        <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
      </TouchableOpacity>

      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {images}
      </ScrollView>

      <View style={styles.container}>
        <Text style={styles.productName}>{product[1]}</Text>
        <View style={styles.priceArea}>
          <View>
            <Text style={styles.productQtd}>Disponível: <Text style={styles.productDescription}>{product[6]} unidades</Text></Text>
            <Text style={styles.productPriceUnity}>R$ {product[5]}</Text>
            <Text style={styles.productTitles}>Tempo de Produção:</Text>
            <Text style={styles.productDescription}>{product[4]}</Text>
          </View>
          <View>
            <View style={styles.qtdButton}>
              <TouchableOpacity onPress={decrementQuantity} style={styles.qtdButtonTouchable}>
                <Text style={styles.qtdButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtdButtonText}>{quantity}</Text>
              <TouchableOpacity onPress={incrementQuantity} style={styles.qtdButtonTouchable}>
                <Text style={styles.qtdButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cartPlusButton} onPress={addToCartAndNavigate}>
              <Icon name="cart-plus" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.productTitles}>Descrição do Produto</Text>
        <Text style={styles.productDescription}>{product[3]}</Text>

        <View style={styles.priceArea}>
          <View>
            <Text style={styles.productDescription}>Valor Total:</Text>
            <Text style={styles.productPrice}>R$ {(product[5] * quantity).toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.ButtonText} onPress={addToCartAndNavigate}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    top: 25,
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
