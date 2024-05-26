import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Importando o DateTimePicker
import RNPickerSelect from 'react-native-picker-select';
import DotIndicator from './../../../assets/components/DotIndicator'; // Caminho para o componente de indicador de progresso

export function Personal() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date()); // Defina a data inicial para o estado birthDate
  const [sex, setSex] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [phone, setPhone] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para controlar a visibilidade do DatePicker

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios'); // Oculta o DatePicker no iOS quando uma data é selecionada
    setBirthDate(currentDate);
  };

  const handleNextPress = () => {
    if (!name || !birthDate || !sex || !cpf || !rg || !cellphone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    navigation.navigate('Address');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Start')}>
          <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>
        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/quilon.png')} style={styles.backgroundText} />
        </View>

        <Text style={styles.title}>Cadastre-se</Text>
        <Text style={styles.userType}>Dados do Usuário</Text>

        <Text style={styles.subTitle}>Nome</Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.horizontalArea}>
          <View style={styles.contactField}>
            <Text style={styles.subTitle}>Data de Nascimento</Text>
            <View style={styles.orangeBorder}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.input}>{birthDate.toLocaleDateString()}</Text>
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
            <Text style={styles.subTitle}>Sexo</Text>
            <View style={styles.orangeBorder}>
              <RNPickerSelect
                onValueChange={(value) => setSex(value)}
                placeholder={{
                  label: 'Selecione o sexo',
                  value: null,
                  color: '#c7c7cd',
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
                    color: '#c7c7cd',
                  },
                }}
              />
            </View>
          </View>
        </View>

        <Text style={styles.subTitle}>CPF</Text>
        <View style={styles.orangeBorder}>
          <TextInput
            style={styles.input}
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subTitle}>RG</Text>
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
            <Text style={styles.subTitle}>Celular</Text>
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
            <Text style={styles.subTitle}>Telefone</Text>
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

      <View style={styles.bottomContainer}>
        <DotIndicator totalSteps={3} currentStep={0} />
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.ButtonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    marginTop: 50,
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
});

export default Personal;
