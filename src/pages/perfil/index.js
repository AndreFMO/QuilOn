import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { UserContext } from './../../UserContext';
import { API_BASE_URL } from './../../config';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export function Perfil() {
  const navigation = useNavigation();
  const {userId, representante, setQuilomboId} = useContext(UserContext);
  const [selectedTab, setSelectedTab] = useState('perfil');
  const [isDropdownOpenPersonal, setIsDropdownOpenPersonal] = useState(false);
  const [isDropdownOpenAddress, setIsDropdownOpenAddress] = useState(false);
  const [isDropdownOpenAccount, setIsDropdownOpenAccount] = useState(false);
  const [isDropdownOpenCommunityInfo, setIsDropdownOpenCommunityInfo] = useState(false);
  const [isDropdownOpenCommunityInformative, setIsDropdownOpenCommunityInformative] = useState(false);
  const [isDropdownOpenCommunityPerformance, setIsDropdownOpenCommunityPerformance] = useState(false);
  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quilombo, setQuilombo] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [noSalesAvailable, setNoSalesAvailable] = useState(false);
  const [monthlySalesData, setMonthlySalesData] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const [quilomboImage, setQuilomboImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const { t } = useTranslation();

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

  const fetchSalesData = async () => {
    if (userId) {
      try {
        const response = await fetch(`${API_BASE_URL}/vendas/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            processSalesData(data);
            processMonthlySalesData(data);
            setNoSalesAvailable(false);
          } else {
            setNoSalesAvailable(true);
          }
        } else {
          setNoSalesAvailable(true);
        }
      } catch (error) {
        setNoSalesAvailable(true);
      }
    }
  };

  const processSalesData = (data) => {
    const salesByCategory = {};

    data.forEach(item => {
      const { category, quantity, totalSaleValue } = item;

      if (!salesByCategory[category]) {
        salesByCategory[category] = { totalQuantity: 0, totalValue: 0 };
      }

      salesByCategory[category].totalQuantity += quantity;
      salesByCategory[category].totalValue += totalSaleValue;
    });

    const labels = Object.keys(salesByCategory);
    const values = labels.map(label => salesByCategory[label].totalValue);

    setSalesData({
      labels,
      datasets: [{
        data: values,
        strokeWidth: 2,
      }]
    });
  };

  const processMonthlySalesData = (data) => {
    const monthlyData = {};
    const monthlyQuantity = {};
    
    // Obtemos os nomes dos meses traduzidos
    const monthNames = [
      t('month_jan'), 
      t('month_feb'), 
      t('month_mar'), 
      t('month_apr'), 
      t('month_may'), 
      t('month_jun'), 
      t('month_jul'), 
      t('month_aug'), 
      t('month_sep'), 
      t('month_oct'), 
      t('month_nov'), 
      t('month_dec')
    ];
  
    data.forEach(item => {
      const purchaseDate = new Date(item.purchaseDate);
      const month = monthNames[purchaseDate.getMonth()]; 
  
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
        monthlyQuantity[month] = 0;
      }
  
      monthlyData[month] += item.totalSaleValue;
      monthlyQuantity[month] += item.quantity;
    });
  
    const labels = monthNames; 
    const salesValues = labels.map(label => monthlyData[label] || 0);
    const quantityValues = labels.map(label => monthlyQuantity[label] || 0);
  
    setMonthlySalesData({
      salesData: {
        labels,
        datasets: [{ data: salesValues }]
      },
      quantityData: {
        labels,
        datasets: [{ data: quantityValues }]
      }
    });
  };  

  const fetchUserImage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/userImage/${userId}`);
      if (response.ok) {
        setProfileImage(`${API_BASE_URL}/userImage/${userId}?t=${new Date().getTime()}`);
      }
    } catch (error) {
      console.error('Erro ao buscar a imagem do usuário:', error);
    }
  };

  const fetchQuilomboImage = async (quilomboId) => {
    if (representante === 1) { // Verificação adicional
      try {
        const response = await fetch(`${API_BASE_URL}/quilomboImage/${quilomboId}`);
        if (response.ok) {
          setQuilomboImage(`${API_BASE_URL}/quilomboImage/${quilomboId}?t=${new Date().getTime()}`);
        }
      } catch (error) {
        console.error('Erro ao buscar a imagem do quilombo:', error);
      }
    }
  };

  const fetchQuilomboData = async () => {
    if (userId && representante === 1) {
      try {
        const response = await fetch(`${API_BASE_URL}/quilombouser/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.quilombo) {
            const [id, userId, name, certificacao, latitudeLongitude, complemento] = data.quilombo;
            const [latitude, longitude] = latitudeLongitude.split(",");
            setQuilombo({ id, userId, name, certificacao, latitude, longitude, complemento });
            setQuilomboId(id)        
            fetchQuilomboImage(id);
          } else {
            console.error("Quilombo não encontrado");
            setQuilombo(null);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do quilombo:", error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        await fetchUserImage();
        await fetchAddress();
        await fetchUserData();
        await fetchSalesData();
        if (representante === 1) {
          await fetchQuilomboData();
        }
        setLoading(false);
      };
      fetchData();
    }, [userId, representante]) 
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

  const pickImage = async (type) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "É necessário permitir o acesso à galeria para selecionar uma imagem.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (type === 'user') {
        setProfileImage(uri);
        await uploadImage('userImage', uri);
      } else if (type === 'quilombo') {
        setQuilomboImage(uri);
        await uploadImage('quilomboImage', uri);
      }
    }
  };

  const uploadImage = async (type, uri) => {
    const formData = new FormData();
    formData.append('image', {
        uri,
        type: 'image/png',
        name: `${type}_${userId}.png`,
    });

    try {
        await axios.post(`${API_BASE_URL}/${type}/${type === 'userImage' ? userId : quilombo?.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        //Alert.alert('Imagem enviada com sucesso');

    } catch (error) {
        console.error(error);
        //Alert.alert(`Erro ao enviar a imagem do ${type}.`);
    }
};

  const renderUserInfo = () => (
    <View style={styles.perfil2}>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setIsDropdownOpenPersonal(!isDropdownOpenPersonal)}
      >
        <Text style={styles.tabText}>{t('personal_data')}</Text>
        <Icon name={isDropdownOpenPersonal ? 'caret-down' : 'caret-right'} size={20} color="black" />
      </TouchableOpacity>

      {isDropdownOpenPersonal && (
        <TouchableOpacity style={styles.dropdownContent} onPress={() => navigation.navigate('UpdPersonal', { user })}>
          <View>
            <View style={styles.separation}>
              <View style={styles.username}>
                <Text style={styles.dropdownText}>{user?.nome || t('name')}</Text>
                <Text style={styles.dropdownText}>{user?.dataNasc ? `${calculateAge(user.dataNasc)} ${t('years')}` : t('birth_date_not_available')}</Text> 
              </View>
              <Text style={styles.dropdownText}>{t('sex')}: {user?.sexo}</Text>
            </View>
            <View style={styles.separation}>
              <Text style={styles.dropdownText}>{t('cpf')}: {user?.cpf ? formatCPF(user.cpf) : t('not_available')}</Text>
              <Text style={styles.dropdownText}>{t('rg')}: {user?.rg ? formatRG(user.rg) : t('not_available')}</Text>
            </View>
            <View style={styles.separation}>
              <Text style={styles.dropdownText}>{t('cellphone')}: {user?.celular || t('not_available')}</Text>
              <Text style={styles.dropdownText}>{t('phone')}: {user?.telefone || t('not_available')}</Text>
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
        <Text style={styles.tabText}>{t('address_user')}</Text> 
        <Icon name={isDropdownOpenAddress ? 'caret-down' : 'caret-right'} size={20} color="black" />
      </TouchableOpacity>

      {isDropdownOpenAddress && (
        <TouchableOpacity style={styles.dropdownContent} onPress={() => navigation.navigate('UpdAddress', { address, idEndereco: address?.idEndereco })}>
          <View style={styles.separation}>
            {loading ? (
              <Text style={styles.dropdownText}>{t('loading')}</Text> 
            ) : address ? (
              <>
                <Text style={styles.dropdownText}>
                  {`${address.endereco}, nº ${address.numero}, ${address.bairro}`}
                </Text>
                <Text style={styles.dropdownText}>
                  {`${address.cidade}-${address.uf}`}
                </Text>
                {address.complemento && <Text style={styles.dropdownText}>{address.complemento}</Text>}
              </>
            ) : (
              <Text style={styles.dropdownText}>{t('address_not_found')}</Text> 
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
        <Text style={styles.tabText}>{t('account')}</Text>
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
        onPress={() => setIsDropdownOpenCommunityInfo(!isDropdownOpenCommunityInfo)}
      >
        <Text style={styles.tabText}>{t("community_data")}</Text>
        <Icon name={isDropdownOpenCommunityInfo ? 'caret-down' : 'caret-right'} size={20} color="black" />
      </TouchableOpacity> 
  
      {isDropdownOpenCommunityInfo && (
        <TouchableOpacity style={styles.dropdownContent} onPress={() => navigation.navigate('UpdQuilombo', { quilombo })}>
          <View>
            <View style={styles.separation}>
              <Text style={styles.dropdownText}>{t("community_name")}: {quilombo?.name || 'Nome não disponível'}</Text>
              <Text style={styles.dropdownText}>{t("certification_number")}: {quilombo?.certificacao || 'Não disponível'}</Text>
            </View>
            <View style={styles.separation}>
              <Text style={styles.dropdownText}>Latitude: {quilombo?.latitude || 'Não disponível'}</Text>
              <Text style={styles.dropdownText}>Longitude: {quilombo?.longitude || 'Não disponível'}</Text>
            </View>
            <View style={styles.separation}>
              <Text style={styles.dropdownText}>{t("complement")}: {quilombo?.complemento || 'Não disponível'}</Text>
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
        onPress={() => setIsDropdownOpenCommunityInformative(!isDropdownOpenCommunityInformative)}
      >
        <Text style={styles.tabText}>{t("quilombo_newsletter")}</Text>
        <Icon name={isDropdownOpenCommunityInformative ? 'caret-down' : 'caret-right'} size={20} color="black" />
      </TouchableOpacity> 
  
      {isDropdownOpenCommunityInformative && (
        <TouchableOpacity style={styles.dropdownContent} onPress={() => {navigation.navigate('UpdCommunityInformative')}}>
          <View style={styles.separation}>
            <Text style={styles.dropdownText}>{t("update_newsletter")}</Text>
          </View>
          <Icon name="angle-right" size={30} color="gray" />
        </TouchableOpacity> 
      )}
    </View>
  );
  
  const renderCommunityPerformance = () => {
    if (loading) {
      return (
        <View style={styles.perfil2}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setIsDropdownOpenCommunityPerformance(!isDropdownOpenCommunityPerformance)}
          >
            <Text style={styles.tabText}>{t('community_performance')}</Text>
            <Icon name={isDropdownOpenCommunityPerformance ? 'caret-down' : 'caret-right'} size={20} color="black" />
          </TouchableOpacity>
          
          {isDropdownOpenCommunityPerformance && (
            <View style={styles.dropdownContent}>
              <Text style={styles.dropdownText}>{t('loading_sales_data')}</Text>
            </View>
          )}
        </View>
      );
    }
  
    if (noSalesAvailable) {
      return (
        <View style={styles.perfil2}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setIsDropdownOpenCommunityPerformance(!isDropdownOpenCommunityPerformance)}
          >
            <Text style={styles.tabText}>{t('community_performance')}</Text>
            <Icon name={isDropdownOpenCommunityPerformance ? 'caret-down' : 'caret-right'} size={20} color="black" />
          </TouchableOpacity>
  
          {isDropdownOpenCommunityPerformance && (
            <View style={styles.dropdownContent}>
              <Text style={styles.dropdownText}>{t('no_sales_made')}</Text>
            </View>
          )}
        </View>
      );
    }
  
    return (
      <View style={styles.perfil2}>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setIsDropdownOpenCommunityPerformance(!isDropdownOpenCommunityPerformance)}
        >
          <Text style={styles.tabText}>{t('community_performance')}</Text>
          <Icon name={isDropdownOpenCommunityPerformance ? 'caret-down' : 'caret-right'} size={20} color="black" />
        </TouchableOpacity>
  
        {isDropdownOpenCommunityPerformance && (
          <TouchableOpacity style={styles.dropdownContent} onPress={() => navigation.navigate('CommunityPerformance')}>
            <View style={styles.chartContainer}>
              <Text style={[styles.dropdownText, { textAlign: 'center' }]}>{t('monthly_profit')}</Text>
              <LineChart
                data={monthlySalesData.salesData}
                width={screenWidth * 0.87}
                height={220}
                yAxisLabel="R$"
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#f3f3f3',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `grey`, 
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                  },
                  strokeWidth: 1, 
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
                style={styles.overlayIcon} 
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

        {representante === 1 && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'perfil' && styles.activeTab]}
            onPress={() => setSelectedTab('perfil')}
          >
            <Text style={[styles.tabText, selectedTab === 'perfil' && styles.activeTabText]}>{t('profile')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'comunidade' && styles.activeTab]}
            onPress={() => setSelectedTab('comunidade')}
          >
            <Text style={[styles.tabText, selectedTab === 'comunidade' && styles.activeTabText]}>{t('community')}</Text>
          </TouchableOpacity>
        </View>
        )}
        {selectedTab === 'perfil' && (
          <View style={styles.tabContent}>
            <View style={styles.perfil1}>
              <TouchableOpacity style={styles.userIcon} onPress={() => pickImage('user')}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.fullImage} resizeMode="cover" />
                ) : (
                  <Icon name="user" size={50} color="#D86626" />
                )}
              </TouchableOpacity>
              <Text style={styles.title}>{user?.nome || 'Nome de Usuario'}</Text>
              <Text style={styles.userType}>{t('quilombola_representative')}</Text>
            </View>

            {renderUserInfo()}
            {renderUserAddress()}
            {renderUserAccount()}
          </View>
        )}

        {/* Conteúdo da aba 'Comunidade' apenas se o representante for 1 */}
        {selectedTab === 'comunidade' && representante === 1 && (
          <View style={styles.tabContent}>
            <View style={styles.perfil1}>
              <TouchableOpacity style={styles.userIconQ} onPress={() => pickImage('quilombo')}>
                {quilomboImage ? (
                  <Image source={{ uri: quilomboImage }} style={styles.fullImageQ} resizeMode="cover" />
                ) : (
                  <Icon name="home" size={90} color="#D86626" />
                )}
              </TouchableOpacity>
              <Text style={styles.title}>{quilombo?.name || 'Nome da Comunidade'}</Text>
              <Text style={styles.userType}>{t('quilombola_community')}</Text>
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
    marginBottom: 20,
    height: 25,
    width: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
  },
  fullImageQ: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
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
  chartContainer: {
    marginHorizontal: -15,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  quilomboImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  }, 
});
