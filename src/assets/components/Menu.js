import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDrawerContent = ({ navigation }) => {
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigateToScreen('Home')}
      >
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigateToScreen('Settings')}
      >
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>
      {/* Adicione mais itens de menu conforme necessário */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Ajuste conforme necessário para o espaço do cabeçalho
    backgroundColor: '#FFF', // Cor de fundo do menu
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD', // Cor da linha separadora
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Cor do texto do menu
  },
});

export default CustomDrawerContent;
