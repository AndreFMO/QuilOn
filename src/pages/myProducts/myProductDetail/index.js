import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { API_BASE_URL } from './../../../config';

export function MyProductDetail({ route }) {
  const { product } = route.params;
  const [totalImages, setTotalImages] = useState(0);

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
        <Text style={styles.productTitles}>Tempo de Produção:</Text>
        <Text style={styles.productDescription}>{product[4]}</Text>
        <Text style={styles.productTitles}>Categoria:</Text>

        <View style={styles.categoryArea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {reorderedCategories.map((category) => (
              <View key={category} style={[styles.categoryButton, product[2] === category && styles.selectedCategoryButton]}>
                <Text style={[styles.categoryText, product[2] === category && styles.selectedCategoryText]}>
                  {category}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.productTitles}>Descrição do Produto</Text>
        <Text style={styles.productDescription}>{product[3]}</Text>
        <Text style={styles.productQtd}>Quantidade: <Text style={styles.productDescription}>{product[6]}</Text></Text>

        <View style={styles.priceArea}>
          <View>
            <Text style={styles.productDescription}>Valor:</Text>
            <Text style={styles.productPrice}>R$ {product[5]}</Text>
          </View>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.ButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

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
    height: 400,
    width: 'auto'
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
    fontSize:  16,
    marginVertical: 10,
    fontFamily: 'Poppins_700Bold',
  },
  priceArea: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
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


