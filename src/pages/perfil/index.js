import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './../../UserContext';

export function Perfil({ route }) {
  const navigation = useNavigation();
  const { userId } = useContext(UserContext);
  const [userType, setUserType] = useState("Representante Quilombola");
  const [selectedTab, setSelectedTab] = useState('perfil');

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

        {selectedTab === 'perfil' && (
          <View style={styles.tabContent}>
            <View style={styles.perfil1}>
              <View style={styles.profileImageContainer}>

                <TouchableOpacity style={styles.userIcon}> 
                  <Icon name="user" size={50} color="#D86626" /> 
                  <Ionicons name="camera-outline" size={40} color="#D86626" style={styles.cameraIcon} />
                </TouchableOpacity> 
     
              </View>
              <Text style={styles.title}>Nome de Usuario</Text>
              <Text style={styles.userType}>{userType}</Text>
            </View>

            <View style={styles.perfil2}>
              {/* Adicione mais conteúdo aqui se necessário */}
            </View>

            <View style={styles.perfil2}>
              {/* Adicione mais conteúdo aqui se necessário */}
            </View>
          </View>
        )}

        {selectedTab === 'comunidade' && (
          <View style={styles.tabContent}>
            <Text>Informações sobre o Quilombo</Text>
            {/* Exemplo de dados da comunidade */}
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
    backgroundColor: '#FFF'
  },
  contentContainer: {
    marginTop: 50,
    paddingBottom: 10,
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
    paddingVertical: 10,
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
    color: '#000', // Cor padrão do texto
  },
  activeTabText: {
    color: '#FFF', // Cor do texto quando o botão está ativo
  },
  tabContent: {
    paddingVertical: 5,
  },
  perfil1: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    marginBottom: 5,
  },
  profileImageContainer: {
    position: 'relative',
  },
  userIcon: {
    backgroundColor: "#fff",
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "#6666",
    marginBottom: 15,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    elevation: 5,
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
    width: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    marginBottom: 5,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: "center",
  },
});
