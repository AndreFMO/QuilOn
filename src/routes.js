import React, { useState, useEffect } from 'react';
import { BackHandler, View  } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Start } from './pages/start';
import { Login } from './pages/login';
import { Personal } from './pages/register/personal';
import { Address } from './pages/register/address';
import { Account } from './pages/register/account';
import { Quilombo } from './pages/register/quilombo';
import { Concluded } from './pages/register/concluded';
import { Home } from './pages/home';
import { ProductDetail } from './pages/home/productDetail';
import { MyCart } from './pages/myCart';
import { Payment } from './pages/payment';
import { Pix } from './pages/payment/pix';
import { Map } from './pages/map';
import { MyProducts } from './pages/myProducts';
import { MyProductDetail } from './pages/myProducts/myProductDetail';
import { ProductData } from './pages/myProducts/registerProduct/productData';
import { ProductPreview } from './pages/myProducts/registerProduct/productPreview';
import { ConcludedProduct } from './pages/myProducts/registerProduct/concludedProduct';
import { Perfil } from './pages/perfil';
import { UpdCommunityInformative } from './pages/update/updCommunityInformative';
import { CommunityPerformance } from './pages/perfil/communityPerformance';
import { UpdPersonal } from './pages/update/updPersonal';
import { UpdAddress } from './pages/update/updAddress';
import { UpdAccount } from './pages/update/updAccount';
import { UpdQuilombo } from './pages/update/updQuilombo';
import Menu from './pages/menu'; 

// Criação das instâncias dos navegadores
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyProducts"
        component={MyProducts}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator({ navigation }) {
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Navigate to Home screen when back button is pressed
      navigation.navigate('HomeStack');
      return true; // Prevent default behavior (exit app)
    });

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ focused, size, color }) => (
              <Ionicons
                size={size}
                color={focused ? "#D86626" : color}
                name={focused ? "home-sharp" : "home-outline"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={Map}
          options={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ focused, size, color }) => (
              <Ionicons
                size={size}
                color={focused ? "#D86626" : color}
                name={focused ? "location-sharp" : "location-outline"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          options={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ focused, size, color }) => (
              <Ionicons
                size={30} // Definindo o tamanho como 30
                color={focused ? "#D86626" : color}
                name={focused ? "menu-sharp" : "menu-outline"}
              />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
              toggleMenu();
            },
          })}
        >
          {() => null}
        </Tab.Screen>
      </Tab.Navigator>
      <Menu visible={isMenuVisible} onClose={toggleMenu} navigation={navigation} />
    </View>
  );
}

// Definição das Rotas Principais
export function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Start"
        component={Start}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Personal"
        component={Personal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Address"
        component={Address}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Quilombo"
        component={Quilombo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Concluded"
        component={Concluded}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabNavigator"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyCart"
        component={MyCart}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pix"
        component={Pix}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyProductDetail"
        component={MyProductDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductData"
        component={ProductData}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductPreview"
        component={ProductPreview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConcludedProduct"
        component={ConcludedProduct}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Perfil"
        component={Perfil}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdCommunityInformative"
        component={UpdCommunityInformative}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommunityPerformance"
        component={CommunityPerformance}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdPersonal"
        component={UpdPersonal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdAddress"
        component={UpdAddress}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdAccount"
        component={UpdAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdQuilombo"
        component={UpdQuilombo}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
