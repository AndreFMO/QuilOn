import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { API_BASE_URL } from './../../../config';
import { UserContext } from './../../../UserContext';
import { useTranslation } from 'react-i18next';

export function UpdPersonal() {
  const navigation = useNavigation();
  const { userId, } = useContext(UserContext);

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [sex, setSex] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setName(data.nome || '');
          setCpf(data.cpf || '');
          setRg(data.rg || '');
          setCellphone(data.celular || '');
          setPhone(data.telefone || '');
          setSex(data.sexo || '');
          setEmail(data.email || '');
          setSenha(data.senha || '');

          const birthDateArray = data.dataNasc.split('/');
          setBirthDate(new Date(birthDateArray[2], birthDateArray[1] - 1, birthDateArray[0]));
        } else {
          Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      }
    };

    fetchUserData();

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
  }, [userId]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  const handleUpdatePress = async () => {
    if (!name || !birthDate || !sex || !cpf || !rg || !cellphone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios marcados por: *');
      return;
    }
  
    const updatedData = {
      nome: name,
      dataNasc: birthDate.toLocaleDateString('pt-BR'), // Formato: DD/MM/YYYY
      sexo: sex,
      cpf,
      rg,
      celular: cellphone,
      telefone: phone,
      email, // Adiciona o email
      senha, // Adiciona a senha
      idUsuario: userId, // Adiciona o idUsuario
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      const jsonResponse = await response.json();
  
      if (response.ok && jsonResponse.message === 'Usuário atualizado com sucesso') {
        Alert.alert('Sucesso', 'Dados atualizados com sucesso');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar os dados. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro ao atualizar os dados do usuário:', error);
      Alert.alert('Erro', `Ocorreu um erro ao tentar atualizar os dados: ${error.message}`);
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

        <Text style={styles.title}>{t('data_change')}</Text>
        <Text style={styles.userType}>{t('user_data')}</Text>

        <Text style={styles.subTitle}>{t('name')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>{t('birth_date')}<Text style={styles.required}>*</Text></Text>
            <View style={styles.orangeBorder}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.input}>{birthDate.toLocaleDateString('pt-BR')}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={birthDate}
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
                value={sex}
                placeholder={{
                  label: 'Selecione o sexo',
                  value: null,
                }}
                items={[
                  { label: 'Masculino', value: 'Masculino' },
                  { label: 'Feminino', value: 'Feminino' },
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
          </View>
        </View>

        <Text style={styles.subTitle}>{t('cpf')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subTitle}>{t('rg')}<Text style={styles.required}>*</Text></Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={rg}
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
                value={cellphone}
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
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {!keyboardIsVisible && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleUpdatePress}>
            <Text style={styles.ButtonText}>{t('update')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}


// Estilos
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
