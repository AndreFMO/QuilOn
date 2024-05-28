import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './pages/home';
import { Map } from './pages/map';
import { User } from './pages/user/myProducts';
import { Start } from './pages/start';
import { Login } from './pages/login';
import { Personal } from './pages/register/personal';
import { Address } from './pages/register/address';
import { Account } from './pages/register/account';
import { Quilombo } from './pages/register/quilombo';
import { Concluded } from './pages/register/concluded';
import { ProductDetail } from './pages/home/productDetail';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
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
        component={DrawerNavigator}
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
      />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="User" component={User} />
    </Drawer.Navigator>
  );
}

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
    </Stack.Navigator>
  );
}
