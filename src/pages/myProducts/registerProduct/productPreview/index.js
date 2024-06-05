import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

export function ProductPreview({ route }) {
  const navigation = useNavigation();
  const { myProductData } = route.params;
  const [image, setImage] = useState(null);

  useEffect(() => {
    console.log("Dados recebidos:", myProductData);
  }, []);

  const categories = ['Acessórios', 'Cestarias', 'Cerâmicas', 'Outros'];

  // Reordenar as categorias para que a recebida seja a primeira
  const reorderedCategories = [myProductData.categoria, ...categories.filter(category => category !== myProductData.categoria)];

  // Função para selecionar uma imagem da galeria
  // Função para selecionar uma imagem da galeria
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permissão necessária', 'Permissão para acessar a galeria é necessária!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      //console.error('Erro ao solicitar permissão:', error);
      // Trate o erro adequadamente, como exibindo uma mensagem de erro para o usuário
    }
  };


  return (
    <ScrollView style={styles.tela}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductData')} style={styles.returnButtonContainer}>
        <Image source={require('./../../../../assets/return.png')} style={styles.returnButton} />
      </TouchableOpacity>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <TouchableOpacity style={styles.productImage} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <>
              <Icon name="upload" size={22} />
              <Text style={styles.productPhoto}>Adicione uma foto!</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.container}>
        <Text style={styles.productName}>{myProductData.title}</Text>
        <Text style={styles.productTitles}>Tempo de Produção:</Text>
        <Text style={styles.productDescription}>{myProductData.pdtTime}</Text>
        <Text style={styles.productTitles}>Categoria:</Text>

        <View style={styles.categoryArea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {reorderedCategories.map((category) => (
              <View key={category} style={[styles.categoryButton, myProductData.categoria === category && styles.selectedCategoryButton]}>
                <Text style={[styles.categoryText, myProductData.categoria === category && styles.selectedCategoryText]}>
                  {category}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.productTitles}>Descrição do Produto</Text>
        <Text style={styles.productDescription}>{myProductData.descricao}</Text>
        <Text style={styles.productQtd}>Quantidade: <Text style={styles.productDescription}>{myProductData.amount}</Text></Text>

        <View style={styles.priceArea}>
          <View>
            <Text style={styles.productDescription}>Valor:</Text>
            <Text style={styles.productPrice}>R$ {myProductData.price}</Text>
          </View>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.ButtonText}>Finalizar</Text>
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
    height: 400,
    width: '100%',
  },
  productPhoto: {
    marginLeft: 6,
    marginTop: 3,
    fontSize: 17,
    fontFamily: 'Poppins_700Bold',
  },
  productImage: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    backgroundColor: '#D2C6BF',
    alignItems: 'center',
    justifyContent: 'center',
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

export default ProductPreview;
