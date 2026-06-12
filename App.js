import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons as Icon } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import TabsRoutes from './tabs';
import Conta from './screens/conta';
import Historico from './screens/historico';
import { Mapa } from './screens/mapa';


const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#136066',
          },
          headerTintColor: '#ffffff',
          drawerActiveTintColor: '#136066',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 15 }}
            >
              <Icon name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      >
        <Drawer.Screen
          name="InicioDrawer"
          component={TabsRoutes}
          options={{
            title: 'Início',
            drawerIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="MapaDrawer"
          component={Mapa}
          options={{
            title: 'Onde nos encontrar',
            drawerIcon: ({ color, size }) => (
              <Icon name="map" size={size} color={color} />
            ),
          }}
        />

  
      </Drawer.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}