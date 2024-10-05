import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert, Clipboard, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './../../../config';
import { UserContext } from './../../../UserContext';
import { CartContext } from './../../../cartContext';

export function Pix({ route }) {
  const navigation = useNavigation();
  const { userId, userAddressId } = useContext(UserContext);
  const { cart, clearCart } = useContext(CartContext); // Incluindo clearCart

  const { total } = route.params; 

  const [pixCode, setPixCode] = useState('1234567890123456789012345678901234567890');
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardIsVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardIsVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(pixCode);
    Alert.alert("Sucesso", "Código PIX copiado!");
  };

  const handleConcludePurchase = async () => {
    const productIds = cart.map(item => item.product[0]);
    const quantities = cart.map(item => item.quantity);

    const purchaseData = {
      userId,
      addressId: userAddressId,
      productIds,
      quantities,
      totalValue: total,
      purchaseDate: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar dados da compra');
      }

      const result = await response.json();
      Alert.alert("Sucesso", "Compra concluída com sucesso!");
      
      // Limpar o carrinho após a compra
      clearCart();
      
      // Navegar para a tela inicial
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert("Erro", error.message);
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

        <Text style={styles.title}>Pagamento por PIX</Text>
        <Text style={styles.userType}>Escaneie o QRcode abaixo:</Text>

        <View style={styles.containerLogo}>
          <Image source={require('./../../../assets/qr-code.png')} style={styles.qrcode} />
        </View>

        <Text style={styles.subTitle}>Pix copia e cola:</Text>
        <TouchableOpacity onPress={copyToClipboard} style={styles.pixContainer}>
          <TextInput
            style={styles.input}
            value={pixCode}
            onChangeText={setPixCode}
            editable={false} 
          />
          <Image source={require('./../../../assets/copy.png')} style={styles.copyIcon} />
        </TouchableOpacity>
      </ScrollView>

      {!keyboardIsVisible && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleConcludePurchase}>
            <Text style={styles.ButtonText}>Concluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 10,
  },
  returnButton: {
    marginTop: 20,
    height: 25,
    width: 30,
  },
  containerLogo: {
    marginTop: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrcode: {
    width: 230,
    height: undefined,
    aspectRatio: 1,  
    resizeMode: 'contain', 
    marginVertical: 60,
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
  pixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#BF8B6E',
    paddingVertical: 5,
    paddingHorizontal: 5, 
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: -3,
  },
  copyIcon: {
    width: 18,
    height: undefined,
    aspectRatio: 1,  
    resizeMode: 'contain',
    marginLeft: 10,
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
