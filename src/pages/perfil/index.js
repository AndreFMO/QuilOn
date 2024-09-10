import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { UserContext } from './../../UserContext';
import { API_BASE_URL } from './../../config';

export function Perfil() {
  const navigation = useNavigation();
  const { userId } = useContext(UserContext);
  const [userType, setUserType] = useState("Representante Quilombola");
  const [selectedTab, setSelectedTab] = useState('perfil');
  const [isDropdownOpenPersonal, setIsDropdownOpenPersonal] = useState(false);
  const [isDropdownOpenAddress, setIsDropdownOpenAddress] = useState(false);
  const [isDropdownOpenAccount, setIsDropdownOpenAccount] = useState(false);

  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddress = async () => {
    if (userId) {
      try {
        const response = await fetch(`${API_BASE_URL}/addresses`);
        const data = await response.json();
        const addresses = data.addresses.map(addr => ({
          idEndereco: addr[0],
          idUsuario: addr[1],
          endereco: addr[2],
          bairro: addr[3],
          numero: addr[4],
          cidade: addr[5],
          uf: addr[6],
          complemento: addr[7]
        }));
        const userAddress = addresses.find(addr => addr.idUsuario === userId);
        setAddress(userAddress || null);
      } catch (error) {
        console.error("Erro ao buscar o endereço:", error);
      }
    }
  };

  const fetchUserData = async () => {
    if (userId) {
      try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAddress();
      fetchUserData();
      setLoading(false);
    }, [userId])
  );

  const calculateAge = (birthDateStr) => {
    const [day, month, year] = birthDateStr.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatCPF = (cpf) => {
    return cpf
      ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      : '';
  };

  const formatRG = (rg) => {
    return rg
      ? rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
      : '';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('./../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'perfil' && styles.activeTab]}
            onPress={() => setSelectedTab('perfil')}
          >
            <Text style={[styles.tabText, selectedTab === 'perfil' && styles.activeTabText]}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'comunidade' && styles.activeTab]}
            onPress={() => setSelectedTab('comunidade')}
          >
            <Text style={[styles.tabText, selectedTab === 'comunidade' && styles.activeTabText]}>Comunidade</Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'perfil' && ( // Perfil
          <View style={styles.tabContent}>
            
            <View style={styles.perfil1}>
              <TouchableOpacity style={styles.userIcon}>
                <Icon name="user" size={50} color="#D86626" /> 
                <Image source={require('./../../assets/camera.png')} style={styles.cameraIcon} />
              </TouchableOpacity> 
              <Text style={styles.title}>{user?.nome || 'Nome de Usuario'}</Text>
              <Text style={styles.userType}>{userType}</Text>
            </View>

            <View style={styles.perfil2}>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setIsDropdownOpenPersonal(!isDropdownOpenPersonal)}
              >
                <Text style={styles.tabText}>Dados Pessoais</Text>
                <Icon name={isDropdownOpenPersonal ? 'caret-down' : 'caret-right'} size={20} color="black" />
              </TouchableOpacity> 

              {isDropdownOpenPersonal && (
              <TouchableOpacity style={styles.dropdownContent} onPress={() => navigation.navigate('UpdPersonal', { user })}>
                <View>
                  <View style={styles.separation}>
                    <View style={styles.username}>
                      <Text style={styles.dropdownText}>{user?.nome || 'Nome'}</Text>
                      <Text style={styles.dropdownText}>{user?.dataNasc ? `${calculateAge(user.dataNasc)} anos` : 'Data de nascimento não disponível'}</Text>
                    </View>
                    <Text style={styles.dropdownText}>Sexo {user?.sexo}</Text>
                  </View>
                  <View style={styles.separation}>
                    <Text style={styles.dropdownText}>CPF: {user?.cpf ? formatCPF(user.cpf) : 'Não disponível'}</Text>
                    <Text style={styles.dropdownText}>RG: {user?.rg ? formatRG(user.rg) : 'Não disponível'}</Text>
                  </View>
                  <View style={styles.separation}>
                    <Text style={styles.dropdownText}>Celular: {user?.celular || 'Não disponível'}</Text>
                    <Text style={styles.dropdownText}>Telefone: {user?.telefone || 'Não disponível'}</Text>
                  </View>
                </View>
                <Icon name="angle-right" size={30} color="gray" />
              </TouchableOpacity> 
              )}
            </View>

            <View style={styles.perfil2}>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setIsDropdownOpenAddress(!isDropdownOpenAddress)}
              >
                <Text style={styles.tabText}>Endereço do Usuário</Text>
                <Icon name={isDropdownOpenAddress ? 'caret-down' : 'caret-right'} size={20} color="black" />
              </TouchableOpacity> 

              {isDropdownOpenAddress && (
              <TouchableOpacity style={styles.dropdownContent} onPress={() => navigation.navigate('UpdAddress', { address, idEndereco: address?.idEndereco })}>
                <View style={styles.separation}>
                  {loading ? (
                    <Text style={StyleSheet.flatten([styles.dropdownText])}>Carregando...</Text>
                  ) : address ? (
                    <>
                      <Text style={StyleSheet.flatten([styles.dropdownText])}>{address.endereco}, nº {address.numero}, {address.bairro}</Text>
                      <Text style={StyleSheet.flatten([styles.dropdownText])}>{address.cidade}-{address.uf}</Text>
                      {address.complemento && <Text style={StyleSheet.flatten([styles.dropdownText])}>{address?.complemento || ''}</Text>}
                    </>
                  ) : (
                    <Text style={StyleSheet.flatten([styles.dropdownText])}>Endereço não encontrado</Text>
                  )}
                </View>
                <Icon name="angle-right" size={30} color="gray" />
              </TouchableOpacity> 
              )}
            </View>

            <View style={styles.perfil2}>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setIsDropdownOpenAccount(!isDropdownOpenAccount)}
              >
                <Text style={styles.tabText}>Conta</Text>
                <Icon name={isDropdownOpenAccount ? 'caret-down' : 'caret-right'} size={20} color="black" />
              </TouchableOpacity> 

              {isDropdownOpenAccount && (
              <TouchableOpacity style={styles.dropdownContent} onPress={() => navigation.navigate('UpdAccount', { user })}>
                <View style={styles.separation}>
                  <Text style={StyleSheet.flatten([styles.dropdownText])}>{user?.email || 'Email'}</Text>
                  <Text style={StyleSheet.flatten([styles.dropdownText])}>{user?.senha ? '********' : 'Senha'}</Text>
                </View>
                <Icon name="angle-right" size={30} color="gray" />
              </TouchableOpacity> 
              )}
            </View>

          </View>
        )}

        {selectedTab === 'comunidade' && ( // Comunidade
          <View style={styles.tabContent}>
            <View style={styles.perfil1}>
              <Text style={styles.title}>Dados da Comunidade</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainer: {
    marginTop: 25,
    paddingBottom: 10,
    paddingBottom: 60
  },
  returnButton: {
    marginHorizontal: '5%',
    height: 25,
    width: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: '5%',
  },
  tabButton: {
    backgroundColor: '#FFF',
    marginVertical: 10,
    paddingTop: 10,
    paddingBottom: 8,
    width: 160,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 5,
  },
  activeTab: {
    backgroundColor: '#E07F48',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#000',
  },
  activeTabText: {
    color: '#FFF',
  },
  tabContent: {
    paddingVertical: 5,
  },
  perfil1: {
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    marginBottom: 5,
  },
  userIcon: {
    backgroundColor: "#fff",
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    marginBottom: 15,
    elevation: 2,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold'
  },
  userType: {
    marginTop: -5,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: "grey",
  },
  perfil2: {
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 5,
    paddingHorizontal: '5%',
  },
  separation: {
    marginVertical: 10,
  },
  username: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: "black", 
  },
  infoButton: {
    backgroundColor: '#FFF',
    paddingTop: 10,
    paddingBottom: 8,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    elevation: 5,
    marginHorizontal: "6%",
    paddingHorizontal: "6%",
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  dropdownContent: {
    marginTop: 5,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: "6%",
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
});
