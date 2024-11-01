import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './../../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next'; // Importando o hook de tradução

export function MyProductDetail({ route }) {
  const { product } = route.params;
  const navigation = useNavigation();
  const [totalImages, setTotalImages] = useState(0);
  
  const { t } = useTranslation(); // Usando o hook de tradução

  const categories = [t('acessorios'), t('cestaria'), t('ceramica'), t('diversos')]; // Usando chaves de tradução
  const reorderedCategories = [product[2], ...categories.filter(category => category !== product[2])];

  useEffect(() => {
    fetchTotalImages();
  }, []);

  const fetchTotalImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/productImage/${product[0]}/total`);
      const data = await response.json();
      setTotalImages(data.total_images);
    } catch (error) {
      // console.error('Erro ao obter o número total de imagens:', error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${product[0]}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        navigation.navigate('MyProducts'); // Voltar para a lista de produtos
      } else {
        // Alert.alert(t('error'), t('delete_failed'));
      }
    } catch (error) {
      // Alert.alert(t('error'), t('delete_error'));
    }
  };

  const renderProductImages = () => {
    const images = [];
    for (let i = 1; i <= totalImages; i++) {
      const imageUrl = `${API_BASE_URL}/productImage/${product[0]}/${i}?timestamp=${new Date().getTime()}`;
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
      <TouchableOpacity onPress={() => navigation.navigate('MyProducts')} style={styles.returnButtonContainer}>
        <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
      </TouchableOpacity>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {renderProductImages()}
      </ScrollView>

      <View style={styles.container}>
        <View style={styles.categoryArea}>
          <Text style={styles.productName}>{product[1]}</Text>
          <TouchableOpacity style={styles.removeButton} onPress={handleDeleteProduct}>
            <Icon name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.productTitles}>{t('production_time')}</Text>
        <Text style={styles.productDescription}>{product[4]}</Text>
        <Text style={styles.productTitles}>{t('category')}</Text>

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

        <Text style={styles.productTitles}>{t('product_description')}</Text>
        <Text style={styles.productDescription}>{product[3]}</Text>
        <Text style={styles.productQtd}>{t('quantity')}: <Text style={styles.productDescription}>{product[6]}</Text></Text>

        <View style={styles.priceArea}>
          <View>
            <Text style={styles.productDescription}>{t('value')}:</Text>
            <Text style={styles.productPrice}>R$ {product[5]}</Text>
          </View>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.ButtonText}>{t('edit')}</Text>
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
    paddingTop: 30,
    paddingLeft: 30,
    marginTop: -30,
    elevation: 20,
  },
  removeButton: {
    marginTop: 2,
    backgroundColor: "#D86626",
    height: 40,
    width: 40,
    alignItems: 'center',
    borderColor: "#6666",
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: 'auto',
  },
  productName: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
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
    fontSize: 16,
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
