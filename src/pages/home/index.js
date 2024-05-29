import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './../../config';

export function Home() {
  const [username, setUsername] = useState("Eliana");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('Diversos');
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      let filteredProducts = data.products;
  
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        filteredProducts = data.products.filter(product => {
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
      } else {
        setProducts(filteredProducts.filter(product => product[2] === selectedCategory));
      }
    } catch (error) {
      // console.error('Erro ao obter produtos:', error);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().then(() => setRefreshing(false));
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const handleCategoryPress = (category) => {
    if (selectedCategory === category) {
      return;
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}/>
        }
      >
        <Text style={styles.title}>Bem-vinda, {username}!</Text>
        <View style={styles.searchArea}>
          <View style={styles.searchContainer}>
            <Image source={require('./../../assets/search-icon.png')} style={styles.searchIcon}/> 
            <TextInput
              style={styles.input}
              onChangeText={setSearchQuery}
              value={searchQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </View>
        </View>
        <Text style={styles.title}>Categorias</Text>
        <View style={styles.categoryArea}>
          <TouchableOpacity 
            style={[styles.categoryButton, selectedCategory === 'Diversos' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryPress('Diversos')}>
            <Text style={[styles.categoryText, selectedCategory === 'Diversos' && styles.selectedCategoryText]}>Diversos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryButton, selectedCategory === 'Acessórios' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryPress('Acessórios')}>
            <Text style={[styles.categoryText, selectedCategory === 'Acessórios' && styles.selectedCategoryText]}>Acessórios</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryButton, selectedCategory === 'Cestaria' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryPress('Cestaria')}>
            <Text style={[styles.categoryText, selectedCategory === 'Cestaria' && styles.selectedCategoryText]}>Cestaria</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryButton, selectedCategory === 'Cerâmica' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryPress('Cerâmica')}>
            <Text style={[styles.categoryText, selectedCategory === 'Cerâmica' && styles.selectedCategoryText]}>Cerâmica</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Produtos Diversos</Text>
        <View style={styles.productArea}>
          {products.length === 0 ? (
            <Text style={styles.noProductText}>Nenhum produto{"\n"}encontrado</Text>
          ) : (
            <View style={styles.produtosList}>
              {products.map(product => (
                <TouchableOpacity key={product[0]} style={styles.produto} onPress={() => handleProductPress(product)}>
                  <Image source={{ uri: `${API_BASE_URL}/upload/${product[0]}/1` }} style={styles.productImage}/>
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
  tela: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    marginTop: "20%",
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
    marginVertical: 20
  },
  categoryButton:{
    width: "24.5%",
    margin: 2,
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
