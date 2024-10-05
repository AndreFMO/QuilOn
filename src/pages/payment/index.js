import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from './../../cartContext';
import { UserContext } from './../../UserContext';

export function Payment() {
  const navigation = useNavigation();
  const { cart } = useContext(CartContext);
  const { userId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  // Define as opções de entrega
  const deliveryOptions = [
    { id: 'standard', title: 'Entrega Padrão', description: 'Receba entre 15 e 30 dias úteis', cost: 15 },
    { id: 'express', title: 'Entrega Express', description: 'Receba entre 3 e 10 dias úteis', cost: 30 }
  ];

  // Inicializa o estado selecionado com a primeira opção
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0].id); // Seleciona a primeira opção por padrão

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.product[5] * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subTotal = calculateSubtotal();
    const deliveryCost = deliveryOptions.find(option => option.id === selectedDelivery)?.cost || 0;
    return subTotal + deliveryCost;
  };

  const getDeliveryCost = () => {
    return deliveryOptions.find(option => option.id === selectedDelivery)?.cost || 0;
  };

  const handlePayment = () => {
    setIsLoading(true);
    
    const total = calculateTotal(); // Calcule o total
    
    navigation.navigate('Pix', { total }); // Passe o total como parâmetro
  
    setIsLoading(false);
  };

  return (
    <View style={styles.tela}>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButtonContainer}>
          <Image source={require('./../../assets/return.png')} style={styles.returnButton} />
        </TouchableOpacity>

        <Text style={styles.title}>Opções de Entrega</Text>

        {deliveryOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[styles.info, selectedDelivery === option.id && styles.selectedOption]}
            onPress={() => setSelectedDelivery(option.id)}
          >
            <View>
              <Text style={styles.productTitles}>{option.title}</Text>
              <Text style={styles.infoDescription}>{option.description}</Text>
            </View>
            <View>
              <Text style={styles.productTitles}>R$ {option.cost.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.info}>
          <View>
            <Text style={styles.infoDescription}>Valor da Compra</Text>
            <Text style={styles.infoDescription}>Frete</Text>
            <Text style={styles.productTitles}>Valor Final</Text>
          </View>
          <View>
            <Text style={styles.infoDescription}>R$ {calculateSubtotal().toFixed(2)}</Text>
            <Text style={styles.infoDescription}>R$ {getDeliveryCost().toFixed(2)}</Text>
            <Text style={styles.productTitles}>R$ {calculateTotal().toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.title}>Formas de Pagamento</Text>

        <TouchableOpacity style={styles.nextButton}>
          <Image source={require('./../../assets/visa.png')} style={styles.paymentIcons} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handlePayment}>
          <Image source={require('./../../assets/pix.png')} style={styles.paymentIcons} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton}>
          <Image source={require('./../../assets/boleto.png')} style={styles.paymentIcons} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    marginTop: 25,
    paddingBottom: 30,
  },
  returnButtonContainer: {
    marginBottom: 20,
  },
  returnButton: {
    height: 25,
    width: 30,
    marginHorizontal: "6%",
  },
  paymentIcons: {
    height: 50,
    width: 80,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginHorizontal: "6%",
  },
  info: {
    marginTop: 8,
    marginHorizontal: "6%",
    paddingHorizontal: "6%",
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF',
    elevation: 5,
    borderRadius: 10,
    marginBottom: 5,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: 'orange',
  },
  infoDescription: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Poppins_400Regular',
  },
  productTitles: {
    fontSize: 16,
    marginTop: 5,
    fontFamily: 'Poppins_700Bold',
  },
  nextButton: {
    backgroundColor: "#F7F7F7",
    height: 60,
    marginHorizontal: '6%',
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6666",
    padding: 12,
    elevation: 5,
  },
  ButtonText: {
    marginLeft: 10,
    color: "#FFF",
    fontSize: 18,
    fontWeight: 'bold',
  },
});
