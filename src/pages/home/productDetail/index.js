import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { API_BASE_URL } from './../../../config';

export function ProductDetail({ route }) {
  const { product } = route.params;
  const [totalImages, setTotalImages] = useState(0);

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
  const renderProductImages = () => {
    const images = [];
    for (let i = 1; i <= totalImages; i++) {
      const imageUrl = `${API_BASE_URL}/upload/${product[0]}/${i}?timestamp=${new Date().getTime()}`;
      images.push(
        <Image key={i} source={{ uri: imageUrl }} style={styles.productImage} />
      );
    }

    let [fontsLoaded, fontError] = useFonts({
      Poppins_700Bold, Poppins_400Regular,
    });
  
    if (!fontsLoaded && !fontError) {
      return null;
    }

    return images;
  };

  return (
    <ScrollView style={styles.tela}>

      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {renderProductImages()}
      </ScrollView>


      <View style={styles.container}>
        <Text style={styles.productName}>{product[1]}</Text>
        <Text style={styles.productCategory}>{product[2]}</Text>
        <Text style={styles.productDescTitle}>Descrição</Text>
        <Text style={styles.productDescription}>{product[3]}</Text>
        <Text style={styles.productTimeTitle}>Tempo de Produção:  <Text style={styles.productDescription}>{product[4]}</Text></Text>
        <Text style={styles.productTimeTitle}>Estoque:  <Text style={styles.productDescription}>{product[6]}</Text></Text>
        <Text style={styles.productPrice}>R$ {product[5].toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
      </View>
  
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#FFF",
    height: 450,
    width: 'auto'
  },
  productImage: {
    width: 377,
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
    marginTop: 20,
  },
  productCategory: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
  productDescTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    marginTop: 20,
  },
  productDescription: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  },
  productTimeTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  productPrice: {
    fontSize: 20,
    color: 'green',
    fontFamily: 'Poppins_700Bold',
    marginTop: 20,
  },
});
