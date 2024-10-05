import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import DotIndicator from '../../../../assets/components/DotIndicator';

export function ProductData({ route }) {
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
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios marcados por: *');
      return;
    }
  
    const dataToPass = {
      title: title,
      categoria: categoria,
      descricao: descricao,
      pdtTime: pdtTime,
      price: price,
      amount: amount,
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

        <Text style={styles.title}>Cadastre seu produto</Text>
        <Text style={styles.userType}>Representante quilombola</Text>

        <Text style={styles.subTitle}>Título<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={myProductData ? myProductData.title : title}
            onChangeText={setTitle}
          />
        </View>

        <Text style={styles.subTitle}>Categoria<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <RNPickerSelect
            onValueChange={(value) => setCategoria(value)}
            placeholder={{
              label: 'Selecione o a categoria',
              value: null,
            }}
            items={[
              { label: 'Acessórios', value: 'Acessórios' },
              { label: 'Cestarias', value: 'Cestarias' },
              { label: 'Cerâmicas', value: 'Cerâmicas' },
              { label: 'Outro', value: 'Outro' },
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

        <Text style={styles.subTitle}>Descrição<Text style={styles.required}>*</Text></Text>
        <View style={[styles.orangeBorder, styles.descriptionContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={myProductData ? myProductData.descricao : descricao}
            onChangeText={setDescricao}
            multiline={true}
            numberOfLines={4}
          />
        </View>

        <Text style={styles.subTitle}>Tempo de Produção<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <RNPickerSelect
            onValueChange={(value) => setPdtTime(value)}
            placeholder={{
              label: 'Selecione o prazo',
              value: null,
            }}
            items={[
              { label: 'Menos de 1 dia', value: 'Menos de 1 dia' },
              { label: 'De 1 a 5 dias', value: 'De 1 a 5 dias' },
              { label: 'De 6 a 10 dias', value: 'De 6 a 10 dias' },
              { label: 'De 11 a 20 dias', value: 'De 11 a 20 dias' },
              { label: 'Mais de 20 dias', value: 'Mais de 20 dias' },
              { label: 'Não se aplica', value: 'Não se aplica' },
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
            <Text style={styles.subTitle}>Preço<Text style={styles.required}>*</Text></Text>
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
            <Text style={styles.subTitle}>Quantidade<Text style={styles.required}>*</Text></Text>
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
            <Text style={styles.ButtonText}>Próximo</Text>
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
