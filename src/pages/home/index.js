import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';

export function Home() {
  const [size, setSize] = useState("Eliana");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('Diversos');
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://192.168.0.104:5000/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
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
    console.log("Pesquisar por:", searchQuery);
  };

  const handleCategoryPress = (category) => {
    if (selectedCategory === category) {
      // Se a categoria atual já estiver selecionada, não faça nada
      return;
    } else {
      setSelectedCategory(category);
    }
  };

  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold, Poppins_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}/>
        }
      >

        <Text style={styles.title}>Bem-vinda, {size}!</Text>

        <View style={styles.searchArea}>
          <View style={styles.searchContainer}>
            <Image source={require('./../../assets/search-icon.png')} style={styles.searchIcon}/> 
            <TextInput
              style={styles.input}
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
          </View>
          <TouchableOpacity style={styles.userIcon}></TouchableOpacity>
        </View>

        <Text style={styles.title}>Categorias</Text>

        <View style={styles.categoryArea}>

          <TouchableOpacity 
            style={[styles.categoryButton, selectedCategory === 'Diversos' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryPress('Diversos')}>
            <Text style={[styles.categoryText, selectedCategory === 'Diversos' && styles.selectedCategoryText]}>Diversos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryButton, selectedCategory === 'Serviços' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryPress('Serviços')}>
            <Text style={[styles.categoryText, selectedCategory === 'Serviços' && styles.selectedCategoryText]}>Loças</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryButton, selectedCategory === 'Produtos' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryPress('Produtos')}>
            <Text style={[styles.categoryText, selectedCategory === 'Produtos' && styles.selectedCategoryText]}>Tapeçaria</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.categoryButton, selectedCategory === 'Trilhas' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryPress('Trilhas')}>
            <Text style={[styles.categoryText, selectedCategory === 'Trilhas' && styles.selectedCategoryText]}>Cesto</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Produtos Diversos</Text>
        <View style={styles.productArea}>
            <View style={styles.produtosList}>
              {products.map(product => (
                <TouchableOpacity key={product[0]} style={styles.produto} onPress={() => handleProductPress(product)}>
                  <Image source={{ uri: `http://192.168.0.104:5000/upload/${product[0]}/1` }} style={styles.productImage}/>
                  <View style={styles.produtosInfo}>
                    <Text style={styles.productText1}>{product[1]}</Text>
                    <Text style={styles.productText2}>{product[2]}</Text>
                    <Text style={styles.productText3}>R$ {product[5].toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width:"80%",
    height: "70%",
    marginBottom: 10,
    paddingHorizontal: 20,
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
  userIcon: {
    backgroundColor: "#D86626",
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
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
  produtosList:{
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-between',

  },
  produtosList:{
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  produto:{
  width: "47%",
  height: "auto",
  marginBottom: 10,
  backgroundColor: "#FFF",
  alignItems: 'center',
  borderTopStartRadius: 5,
  borderTopEndRadius: 5,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#6666",
  elevation: 5,
  marginHorizontal: "1%",
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
