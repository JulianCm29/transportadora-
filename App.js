import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons as Icon } from '@expo/vector-icons';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';

import { AuthProvider, useAuth } from './context/AuthContext';
import { initDb } from './database/db';

import TabsRoutes from './tabs';
import { Mapa } from './screens/mapa';
import LoginTela from './screens/Login';
import RegisterTela from './screens/Register';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginTela} />
      <Stack.Screen name="Register" component={RegisterTela} />
    </Stack.Navigator>
  );
}

function AppDrawer() {
  return (
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
  );
}

function MainNavigator() {
  const { user } = useAuth();
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const setupDb = async () => {
      await initDb();
      setDbInitialized(true);
    };
    setupDb();
  }, []);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D9D9D9' }}>
        <ActivityIndicator size="large" color="#136066" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppDrawer /> : <AuthStack />}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}