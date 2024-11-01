import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from './../../../UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from './../../../config';
import { useTranslation } from 'react-i18next';

export function UpdCommunityInformative() {
  const { quilomboId } = useContext(UserContext);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [quilomboData, setQuilomboData] = useState({
    population: '',
    history: '',
  });

  const [images, setImages] = useState([null, null, null]);

  const fetchInformativeData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/informative/${quilomboId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do informativo');
      }
  
      const data = await response.json();
      if (data) {
        setQuilomboData({
          population: data.population !== null ? String(data.population) : '', // Conversão para string
          history: data.history || '',
        });
      }
    } catch (error) {
    }
  };

  // Função para buscar as imagens já cadastradas
  const fetchImages = async () => {
    const imagePromises = [1, 2, 3].map(async (index) => {
      try {
        const response = await fetch(`${API_BASE_URL}/informativeImages/${quilomboId}/${index}?t=${new Date().getTime()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          return response.url; // Se a imagem existir, retornamos o URL da imagem
        } else {
          return null; // Se a imagem não existir, retornamos `null`
        }
      } catch (error) {
        return null; // Em caso de erro, retornamos `null`
      }
    });

    const fetchedImages = await Promise.all(imagePromises);
    setImages(fetchedImages);
  };

  useEffect(() => {
    fetchInformativeData();
    fetchImages(); // Busca as imagens ao carregar a tela
  }, []);

  // Função para selecionar uma imagem do dispositivo
  const pickImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedImages = [...images];
      updatedImages[index] = result.assets[0].uri;
      setImages(updatedImages);
    }
  };

  // Função para enviar as imagens
  const uploadImages = async () => {
    const formData = new FormData();

    images.forEach((image, index) => {
      if (image && !image.startsWith('http')) { // Verifica se a imagem foi selecionada e não é a já existente
        const fileName = `image_${index + 1}.png`;
        formData.append('images', {
          uri: image,
          name: fileName,
          type: 'image/png',
        });
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/informativeImages/${quilomboId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar as imagens');
      }

      Alert.alert('Sucesso', 'Imagens carregadas com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar as imagens');
    }
  };

  // Função para enviar os dados do informativo e as imagens
  const handleSubmit = async () => {
    const { population, history } = quilomboData;

    try {
      // Enviar os dados do informativo
      const response = await fetch(`${API_BASE_URL}/informative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idQuilombo: quilomboId,
          population,
          history,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao cadastrar o informativo');
      }

      // Após enviar o informativo, enviar as imagens
      await uploadImages();

      Alert.alert('Sucesso', 'Informativo atualizado com sucesso');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao cadastrar o informativo');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>

        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.title}>{t('quilombo_newsletter')}</Text>
        <Text style={styles.userType}>{t('more_details')}</Text>

        <Text style={styles.subTitle}>{t('population')}</Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={quilomboData.population}
            onChangeText={(text) => setQuilomboData({ ...quilomboData, population: text })}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subTitle}>{t('quilombo_images')}</Text>
        <View style={styles.imagesContainer}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageButton}
              onPress={() => pickImage(index)}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
              ) : (
                <Icon name="upload" size={22} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subTitle}>{t('quilombo_history')}</Text>
        <View style={[styles.orangeBorder, styles.descriptionContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline={true}
            numberOfLines={4}
            value={quilomboData.history}
            onChangeText={(text) => setQuilomboData({ ...quilomboData, history: text })}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
          <Text style={styles.ButtonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 10,
  },
  returnButton: {
    height: 25,
    width: 30,
  },
  containerLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundText: {
    marginTop: 20,
    width: 230,
    height: 50,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginTop: 40,
  },
  userType: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: "grey",
  },
  subTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    marginTop: 15,
  },
  orangeBorder: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: '#BF8B6E',
  },
  input: {
    height: 30,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: -3,
  },
  textArea: {
    minHeight: 150,
    maxHeight: 150,
    textAlignVertical: 'top',
  },
  bottomContainer: {
    paddingHorizontal: "5%",
    paddingTop: 20,
    paddingBottom: 30,
  },
  nextButton: {
    backgroundColor: "#D86626",
    height: 50,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#6666",
    elevation: 5,
  },
  ButtonText: {
    color: "#FFF",
    fontWeight: 'bold',
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  imageButton: {
    width: 100,
    height: 100,
    backgroundColor: '#D2C6BF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imageText: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
});
