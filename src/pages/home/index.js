import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from './../../config';
import { UserContext } from '../../UserContext';
import { CartContext } from './../../cartContext';
import { useTranslation } from 'react-i18next';

export function Home() {
  const { t, i18n } = useTranslation();
  const { userId, username, usersex, setUsername, setUserSex } = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('Diversos');
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
      fetchProducts();
      fetchRecommendedProducts();
    }, [selectedCategory, cart])
  );

  // Obtém o idioma atual
  const currentLanguage = i18n.language;

  // Lógica para determinar a saudação
  let greeting;
  if (currentLanguage === 'pt') {
    greeting = usersex === 'Feminino' ? 'Bem-vinda' : 'Bem-vindo';
  } else {
    greeting = t('welcome'); // Use a tradução padrão para outros idiomas
  }

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}`);
      const data = await response.json();
      if (response.ok) {
        const firstName = data.nome.split(' ')[0];
        setUsername(firstName);
        setUserSex(data.sexo);
      } else {
        //console.error('Erro ao obter detalhes do usuário:', response.status);
      }
    } catch (error) {
      //console.error('Erro ao obter detalhes do usuário:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      const allProducts = data.products;
  
      let filteredProducts = allProducts;
  
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        filteredProducts = allProducts.filter(product => {
          const productName = product[1].toLowerCase();
          const productCategory = product[2].toLowerCase();
          const productDescription = product[3].toLowerCase();
          return (
            productName.includes(searchTerm) ||
            productCategory.includes(searchTerm) ||
            productDescription.includes(searchTerm)
          );
        });
      }
  
      if (selectedCategory === 'Diversos') {
        setProducts(filteredProducts);
      } else if (selectedCategory === 'Recomendados') {
        setProducts(recommendedProducts);
      } else if (selectedCategory === 'Cestaria') {
        setProducts(filteredProducts.filter(product => 
          product[2].toLowerCase() === 'cestaria' || product[2].toLowerCase() === 'baskets'
        ));
      } else if (selectedCategory === 'Acessórios') {
        setProducts(filteredProducts.filter(product => 
          product[2].toLowerCase() === 'acessórios' || product[2].toLowerCase() === 'accessories'
        ));
      } else if (selectedCategory === 'Cerâmica') {
        setProducts(filteredProducts.filter(product => 
          product[2].toLowerCase() === 'cerâmica' || product[2].toLowerCase() === 'ceramics'
        ));
      } else {
        setProducts(filteredProducts.filter(product => product[2] === selectedCategory));
      }
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setRecommendedProducts(data.recommended_products);
      } else {
        //console.error('Erro ao obter produtos recomendados:', response.status);
      }
    } catch (error) {
      //console.error('Erro ao obter produtos recomendados:', error);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([fetchProducts(), fetchRecommendedProducts()]).then(() => setRefreshing(false));
  };

  const handleSearch = async () => {
    if (searchQuery.trim() !== "") {
      try {
        const response = await fetch(`${API_BASE_URL}/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idUsuario: userId,
            conteudoBuscado: searchQuery,
          }),
        });

        if (response.ok) {
          console.log('Busca cadastrada com sucesso!');
          fetchRecommendedProducts();
        } else {
          console.error('Erro ao cadastrar busca:', response.status);
        }

        fetchProducts();
      } catch (error) {
        console.error('Erro ao cadastrar busca:', error);
      }
    } else {
      console.log('A barra de busca está vazia.');
      fetchProducts();
      fetchRecommendedProducts();
    }
  };

  const handleCategoryPress = (category) => {
    if (selectedCategory === category) {
      return;
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>{greeting}, {username}!</Text>
        <View style={styles.searchArea}>
          <View style={styles.searchContainer}>
            <Image source={require('./../../assets/search-icon.png')} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              onChangeText={setSearchQuery}
              value={searchQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </View>
        </View>
        <Text style={styles.title}>{t('categories')}</Text>
        <View style={styles.categoryArea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.categoryButton, selectedCategory === 'Diversos' && styles.selectedCategoryButton]}
              onPress={() => handleCategoryPress('Diversos')}>
              <Text style={[styles.categoryText, selectedCategory === 'Diversos' && styles.selectedCategoryText]}>{t('diversos')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.categoryButton, selectedCategory === 'Acessórios' && styles.selectedCategoryButton]}
              onPress={() => handleCategoryPress('Acessórios')}>
              <Text style={[styles.categoryText, selectedCategory === 'Acessórios' && styles.selectedCategoryText]}>{t('acessorios')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.categoryButton, selectedCategory === 'Cestaria' && styles.selectedCategoryButton]}
              onPress={() => handleCategoryPress('Cestaria')}>
              <Text style={[styles.categoryText, selectedCategory === 'Cestaria' && styles.selectedCategoryText]}>{t('cestaria')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.categoryButton, selectedCategory === 'Cerâmica' && styles.selectedCategoryButton]}
              onPress={() => handleCategoryPress('Cerâmica')}>
              <Text style={[styles.categoryText, selectedCategory === 'Cerâmica' && styles.selectedCategoryText]}>{t('ceramica')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.categoryButton, selectedCategory === 'Recomendados' && styles.selectedCategoryButton]}
              onPress={() => handleCategoryPress('Recomendados')}>
              <Text style={[styles.categoryText, selectedCategory === 'Recomendados' && styles.selectedCategoryText]}>{t('recommended_products')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <Text style={styles.title}>
          {selectedCategory === 'Diversos' 
            ? i18n.language === 'en'
              ? `${t('various')} ${t('products')}`
              : `${t('products')} ${t('diversos')}`
            : selectedCategory === 'Recomendados' 
            ? `${t('recommended_products')}` 
            : `${t('products_of')} "${t(selectedCategory === 'Acessórios' ? 'acessorios' : selectedCategory === 'Cestaria' ? 'cestaria' : selectedCategory === 'Cerâmica' ? 'ceramica' : selectedCategory.toLowerCase())}"`}
        </Text>


        <View style={styles.productArea}>
          {products.length === 0 ? (
            <Text style={styles.noProductText}>{t('no_products_found')}</Text>
          ) : (
            <View style={styles.produtosList}>
              {products.map(product => (
                <TouchableOpacity key={product[0]} style={styles.produto} onPress={() => handleProductPress(product)}>
                  <Image source={{ uri: `${API_BASE_URL}/productImage/${product[0]}/1` }} style={styles.productImage} />
                  <View style={styles.produtosInfo}>
                    <Text style={styles.productText1}>{product[1]}</Text>
                    <Text style={styles.productText2}>{product[2]}</Text>
                    <Text style={styles.productText3}>R$ {product[5].toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollViewContent: {
    flexGrow: 1,
    marginTop: 60,
    paddingHorizontal: "5%",
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold'
  },
  searchArea: {
    marginBottom: 10,
    marginTop: 20,
    paddingRight: 5,
    height: 74,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width:"100%",
    height: "70%",
    marginBottom: 10,
    paddingHorizontal: 25,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    elevation: 5
  },
  searchIcon: {
    marginHorizontal: 2,
    width: 18,
    height: 18,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    marginBottom: -3,
  },
  categoryArea: {
    flexDirection: 'row',
    justifyContent: "center",
    marginVertical: 20,
  },
  categoryButton:{
    margin: 2,
    paddingHorizontal: 12,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 2,
    backgroundColor: "#FFF"
  },
  selectedCategoryButton: {
    backgroundColor: "#D86626",
  },
  categoryText:{
    fontSize: 13.5,
    marginBottom: -3,
    fontFamily: 'Poppins_700Bold'
  },
  selectedCategoryText: {
    color: 'white',
  },
  productArea:{
    marginBottom: 90,
    marginTop: 15,
  },
  noProductText: {
    fontSize: 19,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop: 60,
  },
  produtosList:{
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  produto:{
    width: "47.5%",
    height: "auto",
    minHeight: 260,
    backgroundColor: "#FFF",
    alignItems: 'center',
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
    marginLeft: "0.5%",
    marginBottom: 15,
  },
  productImage:{
    width: "100%",
    height: 180,
    borderRadius: 5,
  },
  produtosInfo:{
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  productText1:{
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: -3,
  },
  productText2:{
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginBottom: -3,
  },
  productText3:{
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
  },
});
