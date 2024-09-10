import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../../UserContext';
import { CartContext } from '../../cartContext';

const Menu = ({ visible, onClose, navigation }) => {
  if (!visible) return null;

  const home = () => {
    onClose();
    navigation.navigate('Home');
  };

  const perfil = () => {
    onClose();
    navigation.navigate('Perfil');
  };

  const myProducts = () => {
    onClose();
    navigation.navigate('MyProducts');
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const { setUserId, username } = useContext(UserContext);
  const { clearCart } = useContext(CartContext); // Utilize o CartContext

  const handleLogout = () => {
    clearCart(); // Limpa o carrinho
    setUserId(0);
    onClose(); // Fecha o menu
    navigation.navigate('Start');
  };

  return (
    <View style={styles.overlay} onTouchEnd={handleOverlayClick}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttons} onPress={perfil}>
          <View style={styles.userIcon}>
            <Icon name="user" size={24} color="#D86626" /> 
          </View>
          <Text style={styles.menuItem}>{username}</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.buttons} onPress={home}>
          <Icon name="home" size={25} color="#fff" style={[styles.icon, styles.homeIcon]}/> 
          <Text style={styles.menuItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={perfil}>
          <Icon name="user" size={24} color="#fff" style={[styles.icon, styles.profileIcon]}/> 
          <Text style={styles.menuItem}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
          <Icon name="heart" size={20} color="#fff" style={styles.icon} /> 
          <Text style={styles.menuItem}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={myProducts}>
          <Icon name="shopping-bag" size={19} color="#fff" style={styles.icon} />
          <Text style={styles.menuItem}>Meus Produtos</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.buttons}>
          <Icon name="cog" size={22} color="#fff" style={styles.icon} /> 
          <Text style={styles.menuItem}>Configurações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
          <Icon name="bell" size={20} color="#fff" style={styles.icon} /> 
          <Text style={styles.menuItem}>Notificação</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
          <Icon name="question-circle" size={22} color="#fff" style={styles.icon} /> 
          <Text style={styles.menuItem}>Ajuda</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.buttons} onPress={handleLogout}>
          <Icon name="sign-out" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.menuItem}>Logout</Text>
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
    paddingTop: 40,
  },
  menuItem: {
    fontSize: 16,
    marginTop: 10,
    marginHorizontal: 20,
    color: "#fff",
    fontFamily: 'Poppins_700Bold',
    marginBottom: 5,
  },
  divider: {
    borderBottomColor: '#fff',
    borderBottomWidth: 0.5,
    marginVertical: 30,
    elevation: 5,
  },
  userIcon: {
    backgroundColor: "#fff",
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#6666",
    marginLeft: 8,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
    marginLeft: 10,
  },
  homeIcon: {
    marginLeft: 8,
  },
  profileIcon: {
    marginLeft: 11,
  },
});

export default Menu;
