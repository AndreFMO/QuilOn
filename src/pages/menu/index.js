import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Menu = ({ visible, onClose, navigation }) => {
  if (!visible) return null;

  const myProducts = () => {
    navigation.navigate('User');
  };

  const handleOverlayClick = (event) => {
    // Verificar se o clique foi dentro do menu ou fora dele (na parte cinza)
    if (event.target === event.currentTarget) {
      // Se o clique foi na parte cinza (overlay), feche o menu
      onClose();
    }
  };

  return (
    <View style={styles.overlay} onTouchEnd={handleOverlayClick}>
      <View style={styles.container}>
        <Text style={styles.menuItem}>Perfil</Text>
        <Text style={styles.menuItem}>Configurações</Text>
        <TouchableOpacity onPress={myProducts}>
          <Text style={styles.menuItem}>Meus Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.menuItem}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  container: {
    width: 250,
    height: '100%',
    backgroundColor: '#D86626',
    padding: 20,
  },
  menuItem: {
    fontSize: 16,
    marginVertical: 10,
    color: "#fff",
    fontFamily: 'Poppins_700Bold'
  },
});

export default Menu;
