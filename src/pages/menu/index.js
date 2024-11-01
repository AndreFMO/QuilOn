import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from './../../config';
import { UserContext } from '../../UserContext';
import { CartContext } from '../../cartContext';
import { useTranslation } from 'react-i18next';

const Menu = ({ visible, onClose, navigation }) => {
  if (!visible) return null;

  const { userId, username, representante, setRepresentante, setUserId, setQuilomboId } = useContext(UserContext);
  const { clearCart } = useContext(CartContext);
  const [userImage, setUserImage] = useState(null);

  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLanguage);
  };

  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/userImage/${userId}?t=${new Date().getTime()}`)
        .then(response => {
          if (response.ok) {
            return response.url; // Retorna a URL da imagem se estiver disponível
          }
          throw new Error('Imagem não encontrada');
        })
        .then(imageUrl => setUserImage(imageUrl))
        .catch(() => setUserImage(null)); // Caso a imagem não exista, seta como null
    }
  }, [userId]);

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

  const handleLogout = () => {
    clearCart();
    setUserId(0);
    setRepresentante(0);
    setQuilomboId(null);
    onClose();
    navigation.navigate('Start');
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <View style={styles.overlay} onTouchEnd={handleOverlayClick}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttons} onPress={perfil}>
          <View style={styles.userIcon}>
            {userImage ? (
              <Image source={{ uri: userImage }} style={styles.profileImage} />
            ) : (
              <Icon name="user" size={24} color="#D86626" />
            )}
          </View>
          <Text style={styles.menuItem}>{username}</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.buttons} onPress={home}>
          <Icon name="home" size={25} color="#fff" style={[styles.icon, styles.homeIcon]} />
          <Text style={[styles.menuItem, { marginHorizontal: 15 }]}>{t('home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={perfil}>
          <Icon name="user" size={24} color="#fff" style={[styles.icon, styles.profileIcon]} />
          <Text style={styles.menuItem}>{t('profile')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
          <Icon name="heart" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.menuItem}>{t('favorites')}</Text>
        </TouchableOpacity>

        {representante === 1 && (
          <TouchableOpacity style={styles.buttons} onPress={myProducts}>
            <Icon name="shopping-bag" size={19} color="#fff" style={styles.icon} />
            <Text style={styles.menuItem}>{t('my_products')}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider} />
        <TouchableOpacity style={styles.buttons} onPress={toggleLanguage}>
          <Icon name="cog" size={22} color="#fff" style={styles.icon} />
          <Text style={styles.menuItem}>{i18n.language === 'pt' ? 'English' : 'Português'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
          <Icon name="bell" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.menuItem}>{t('notifications')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons}>
          <Icon name="question-circle" size={22} color="#fff" style={styles.icon} />
          <Text style={styles.menuItem}>{t('help')}</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.buttons} onPress={handleLogout}>
          <Icon name="sign-out" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.menuItem}>{t('logout')}</Text>
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
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 40,
  },
});

export default Menu;
