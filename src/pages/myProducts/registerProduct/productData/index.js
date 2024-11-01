import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import DotIndicator from '../../../../assets/components/DotIndicator';
import { useTranslation } from 'react-i18next'; // Importando o hook

export function ProductData({ route }) {
  const { t } = useTranslation(); // Usando o hook para tradução
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [pdtTime, setPdtTime] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

  const { myProductData } = route.params || {};

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardIsVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardIsVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleNextPress = () => {
    if (!title || !categoria || !descricao || !pdtTime || !price || !amount) {
      Alert.alert(t('error'), t('fill_all_fields')); // Usando traduções para mensagens de erro
      return;
    }
  
    const dataToPass = {
      title,
      categoria,
      descricao,
      pdtTime,
      price,
      amount,
    };
    
    navigation.navigate('ProductPreview', { myProductData: dataToPass });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('./../../../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.title}>{t('product_registration')}</Text>
        <Text style={styles.userType}>{t('representative_type')}</Text>

        <Text style={styles.subTitle}>{t('title')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={myProductData ? myProductData.title : title}
            onChangeText={setTitle}
          />
        </View>

        <Text style={styles.subTitle}>{t('category')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <RNPickerSelect
            onValueChange={setCategoria}
            placeholder={{
              label: t('select_category'), // Usando tradução
              value: null,
            }}
            items={[
              { label: t('accessories'), value: 'Acessórios' }, // Usando tradução
              { label: t('baskets'), value: 'Cestarias' }, // Usando tradução
              { label: t('ceramics'), value: 'Cerâmicas' }, // Usando tradução
              { label: t('other'), value: 'Outro' }, // Usando tradução
            ]}
            style={{
              inputIOS: {
                fontSize: 16,
                fontFamily: 'Poppins_400Regular',
                color: '#000',
                paddingTop: 4,
                paddingHorizontal: 10,
                paddingBottom: 4,
              },
              inputAndroid: {
                fontSize: 16,
                fontFamily: 'Poppins_400Regular',
                color: '#000',
              },
              placeholder: {
                color: '#000',
                fontFamily: 'Poppins_700Bold',
              },
            }}
          />
        </View>

        <Text style={styles.subTitle}>{t('description')}<Text style={styles.required}>*</Text></Text>
        <View style={[styles.orangeBorder, styles.descriptionContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={myProductData ? myProductData.descricao : descricao}
            onChangeText={setDescricao}
            multiline={true}
            numberOfLines={4}
          />
        </View>

        <Text style={styles.subTitle}>{t('production_time')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <RNPickerSelect
            onValueChange={setPdtTime}
            placeholder={{
              label: t('select_time'), // Usando tradução
              value: null,
            }}
            items={[
              { label: t('less_than_one_day'), value: 'Menos de 1 dia' }, // Usando tradução
              { label: t('one_to_five_days'), value: 'De 1 a 5 dias' }, // Usando tradução
              { label: t('six_to_ten_days'), value: 'De 6 a 10 dias' }, // Usando tradução
              { label: t('eleven_to_twenty_days'), value: 'De 11 a 20 dias' }, // Usando tradução
              { label: t('more_than_twenty_days'), value: 'Mais de 20 dias' }, // Usando tradução
              { label: t('not_applicable'), value: 'Não se aplica' }, // Usando tradução
            ]}
            style={{
              inputIOS: {
                fontSize: 16,
                fontFamily: 'Poppins_400Regular',
                color: '#000',
                paddingTop: 4,
                paddingHorizontal: 10,
                paddingBottom: 4,
              },
              inputAndroid: {
                fontSize: 16,
                fontFamily: 'Poppins_400Regular',
                color: '#000',
              },
              placeholder: {
                color: '#000',
                fontFamily: 'Poppins_700Bold',
              },
            }}
          />
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>{t('price')}<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TextInput
                style={styles.input}
                value={myProductData ? myProductData.price : price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>{t('quantity')}<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TextInput
                style={styles.input}
                value={myProductData ? myProductData.amount : amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {!keyboardIsVisible && (
        <View style={styles.bottomContainer}>
          <DotIndicator totalSteps={2} currentStep={0} />
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.ButtonText}>{t('next')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 10,
  },
  returnButton: {
    marginTop: 20,
    height: 25,
    width: 30,
  },
  containerLogo: {
    marginTop: -20,
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
  descriptionContainer: {
    flex: 1,
  },
  horizontalArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  contactField: {
    width: "48%",
  },
  input: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: -3,
  },
  textArea: {
    minHeight: 80,
    maxHeight: 80,
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
  required: {
    color: 'red',
    fontSize: 16,
  }
});

export default ProductData;
