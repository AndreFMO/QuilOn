import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './pages/home';
import { Map } from './pages/map';
import { User } from './pages/user';
import { ProductDetail } from './pages/home/productDetail';

import { Ionicons } from '@expo/vector-icons';

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
      {/* Adicione mais telas aqui, se necessário */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export function Routes() {
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
        name="User"
        component={User}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              size={size}
              color={focused ? "#D86626" : color}
              name={focused ? "person-sharp" : "person-outline"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
