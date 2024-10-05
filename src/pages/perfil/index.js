import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { UserContext } from './../../UserContext';
import { API_BASE_URL } from './../../config';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

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
  const [quilombo, setQuilombo] = useState(null);
  const [loadingQuilombo, setLoadingQuilombo] = useState(true);

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

  const fetchQuilomboData = async () => {
    if (userId) {
      try {
        const response = await fetch(`${API_BASE_URL}/quilombouser/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.quilombo) {
            const [id, userId, name, certificacao, latitudeLongitude, complemento] = data.quilombo;
            const [latitude, longitude] = latitudeLongitude.split(",");
            setQuilombo({
              id,
              userId,
              name,
              certificacao,
              latitude,
              longitude,
              complemento,
            });
          } else {
            console.error("Quilombo não encontrado");
            setQuilombo(null);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do quilombo:", error);
      } finally {
        setLoadingQuilombo(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAddress();
      fetchUserData();
      fetchQuilomboData();
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

  const renderUserInfo = () => (
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
              <Text style={styles.dropdownText}>Sexo: {user?.sexo}</Text>
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
  );
  
  const renderUserAddress = () => (
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
              <Text style={styles.dropdownText}>Carregando...</Text>
            ) : address ? (
              <>
                <Text style={styles.dropdownText}>{address.endereco}, nº {address.numero}, {address.bairro}</Text>
                <Text style={styles.dropdownText}>{address.cidade}-{address.uf}</Text>
                {address.complemento && <Text style={styles.dropdownText}>{address.complemento}</Text>}
              </>
            ) : (
              <Text style={styles.dropdownText}>Endereço não encontrado</Text>
            )}
          </View>
          <Icon name="angle-right" size={30} color="gray" />
        </TouchableOpacity> 
      )}
    </View>
  );
  
  const renderUserAccount = () => (
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
            <Text style={styles.dropdownText}>{user?.email || 'Email'}</Text>
            <Text style={styles.dropdownText}>{user?.senha ? '********' : 'Senha'}</Text>
          </View>
          <Icon name="angle-right" size={30} color="gray" />
        </TouchableOpacity> 
      )}
    </View>
  );
  
  const renderCommunityInfo = () => (
    <View style={styles.perfil2}>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setIsDropdownOpenPersonal(!isDropdownOpenPersonal)}
      >
        <Text style={styles.tabText}>Dados da Comunidade</Text>
        <Icon name={isDropdownOpenPersonal ? 'caret-down' : 'caret-right'} size={20} color="black" />
      </TouchableOpacity> 
  
      {isDropdownOpenPersonal && (
        <TouchableOpacity style={styles.dropdownContent} onPress={() => navigation.navigate('UpdQuilombo', { quilombo })}>
          <View>
            <View style={styles.separation}>
              <Text style={styles.dropdownText}>Nome da Comunidade: {quilombo?.name || 'Nome não disponível'}</Text>
              <Text style={styles.dropdownText}>Certificação Quilombola: {quilombo?.certificacao || 'Não disponível'}</Text>
            </View>
            <View style={styles.separation}>
              <Text style={styles.dropdownText}>Latitude: {quilombo?.latitude || 'Não disponível'}</Text>
              <Text style={styles.dropdownText}>Longitude: {quilombo?.longitude || 'Não disponível'}</Text>
            </View>
            <View style={styles.separation}>
              <Text style={styles.dropdownText}>Complemento: {quilombo?.complemento || 'Não disponível'}</Text>
            </View>
          </View>
          <Icon name="angle-right" size={30} color="gray" />
        </TouchableOpacity> 
      )}
    </View>
  );
  
  const renderCommunityInformative = () => (
    <View style={styles.perfil2}>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setIsDropdownOpenAddress(!isDropdownOpenAddress)}
      >
        <Text style={styles.tabText}>Informativo do Quilombo</Text>
        <Icon name={isDropdownOpenAddress ? 'caret-down' : 'caret-right'} size={20} color="black" />
      </TouchableOpacity> 
  
      {isDropdownOpenAddress && (
        <TouchableOpacity style={styles.dropdownContent} onPress={() => navigation.navigate('UpdCommunityInformative', { address, idEndereco: address?.idEndereco })}>
          <View style={styles.separation}>
   
          </View>
          <Icon name="angle-right" size={30} color="gray" />
        </TouchableOpacity> 
      )}
    </View>
  );
  
  const screenWidth = Dimensions.get("window").width;

  const renderCommunityPerformance = () => {
    // Simulação de dados de vendas (substitua isso pelos dados reais que você vai buscar da API)
    const salesData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          data: [450, 560, 780, 900, 850, 990],
          strokeWidth: 2, // grossura da linha
        },
      ],
    };

    return (
      <View style={styles.perfil2}>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setIsDropdownOpenAccount(!isDropdownOpenAccount)}
        >
          <Text style={styles.tabText}>Performance da Comunidade</Text>
          <Icon name={isDropdownOpenAccount ? 'caret-down' : 'caret-right'} size={20} color="black" />
        </TouchableOpacity>

        {isDropdownOpenAccount && (
          <TouchableOpacity style={styles.dropdownContent}>
            <View style={styles.chartContainer}>
              <Text style={styles.dropdownText}>Gráfico de Vendas</Text>
              <LineChart
                data={salesData}
                width={screenWidth * 0.80} // largura do gráfico
                height={220}
                yAxisLabel="R$"
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#f3f3f3',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
              <Icon
                name="angle-right"
                size={30}
                color="gray"
                style={styles.overlayIcon} // Adiciona estilo ao ícone
              />
            </View>
          </TouchableOpacity>
        
        )}
      </View>
    );
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
  
        {selectedTab === 'perfil' && ( // Renderizando a aba de Perfil
          <View style={styles.tabContent}>
            <View style={styles.perfil1}>
              <TouchableOpacity style={styles.userIcon}>
                <Icon name="user" size={50} color="#D86626" /> 
                <Image source={require('./../../assets/camera.png')} style={styles.cameraIcon} />
              </TouchableOpacity> 
              <Text style={styles.title}>{user?.nome || 'Nome de Usuario'}</Text>
              <Text style={styles.userType}>{userType}</Text>
            </View>
  
            {renderUserInfo()}
            {renderUserAddress()}
            {renderUserAccount()}
          </View>
        )}
  
        {selectedTab === 'comunidade' && ( // Renderizando a aba de Comunidade
          <View style={styles.tabContent}>
            <View style={styles.perfil1}>
              <TouchableOpacity style={styles.userIconQ}>
                <Icon name="home" size={90} color="#D86626" /> 
                <Image source={require('./../../assets/camera.png')} style={styles.cameraIconQ} />
              </TouchableOpacity> 
              <Text style={styles.title}>{quilombo?.name || 'Nome da Comunidade'}</Text>
              <Text style={styles.userType}>Comunidade Quilombola</Text>
            </View>
  
            {renderCommunityInfo()}
            {renderCommunityInformative()}
            {renderCommunityPerformance()}
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
  userIconQ: {
    backgroundColor: "#fff",
    width: '85%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
  cameraIconQ: {
    position: 'absolute',
    bottom: 5,
    right: 10,
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
  overlayIcon: {
    position: 'absolute',
    top: 110, 
    right: '1%',
  },
});
