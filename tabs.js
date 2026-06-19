import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons as Icon } from '@expo/vector-icons';

import Home from './screens/home';
import Conta from './screens/conta';
import Historico from './screens/historico';
import Rastreio from './screens/rastreio';

const Tab = createBottomTabNavigator();

export default function TabsRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarActiveBackgroundColor: "#136066",
        tabBarInactiveTintColor: "#657275",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '900',
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Rastreio"
        component={Rastreio}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Histórico"
        component={Historico}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="timer" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Conta"
        component={Conta}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
          tabBarBadgeStyle: {
            backgroundColor: "#194756",
            color: "black",
          },
        }}
      />
    </Tab.Navigator>
  );
}