import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import DotIndicator from '../../../assets/components/DotIndicator';
import { useTranslation } from 'react-i18next'; // Importando useTranslation

export function Personal({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation(); // Usando useTranslation para tradução

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [sex, setSex] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [phone, setPhone] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

  const { personalData } = route.params || {};

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

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  const handleNextPress = () => {
    if (!name || !birthDate || !sex || !cpf || !rg || !cellphone) {
      Alert.alert(t('error'), t('fill_all_fields')); // Usando chaves de tradução
      return;
    }
  
    const dataToPass = {
      name: name,
      birthDate: birthDate.toLocaleDateString(),
      sex: sex,
      cpf: cpf,
      rg: rg,
      cellphone: cellphone,
      phone: phone,
    };
    
    navigation.navigate('Address', { personalData: dataToPass });
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

        <Text style={styles.title}>{t('register')}</Text>
        <Text style={styles.userType}>{t('user_data')}</Text>
        <Text style={styles.subTitle}>{t('name')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={personalData ? personalData.name : name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>{t('birth_date')}<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.input}>{personalData ? personalData.birthDate : birthDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={personalData ? new Date(personalData.birthDate) : birthDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                />
              )}
            </View>
          </View>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>{t('sex')}<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <RNPickerSelect
                onValueChange={(value) => setSex(value)}
                placeholder={{
                  label: t('select_sex'), // Usando chave de tradução
                  value: null,
                }}
                items={[
                  { label: t('male'), value: 'Masculino' }, // Usando chave de tradução
                  { label: t('female'), value: 'Feminino' }, // Usando chave de tradução
                  { label: t('other'), value: 'Outro' }, // Usando chave de tradução
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
          </View>
        </View>

        <Text style={styles.subTitle}>{t('cpf')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={personalData ? personalData.cpf : cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subTitle}>{t('rg')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={personalData ? personalData.rg : rg}
            onChangeText={setRg}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>{t('cellphone')}<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TextInput
                style={styles.input}
                value={personalData ? personalData.cellphone : cellphone}
                onChangeText={setCellphone}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>{t('phone')}</Text>
            <View style={styles.orangeBorder}>
              <TextInput
                style={styles.input}
                value={personalData ? personalData.phone : phone}
                onChangeText={setPhone}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {!keyboardIsVisible && (
        <View style={styles.bottomContainer}>
          <DotIndicator totalSteps={3} currentStep={0} />
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.ButtonText}>{t('next')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    backgroundColor: "#FFF",
    flex: 1,
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
  horizontalArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  contactField: {
    width: "48%",
  },
  input: {
    height: 30,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: -3,
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

export default Personal;
