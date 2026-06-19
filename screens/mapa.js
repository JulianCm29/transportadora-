import { Text, View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { openDb } from '../database/db';
import { useAuth } from '../context/AuthContext';

export function Mapa() {
  const { user } = useAuth();
  const [entregas, setEntregas] = useState([]);

  const ifsul = {
    latitude: -31.331891250574067,
    longitude: -54.0718179172703,
  };

  const carregarMarcadores = async () => {
    if (!user || !user.id) return;
    try {
      const db = await openDb();
      // Filtrar apenas as entregas que possuem latitude e longitude validas
      const deliveries = await db.getAllAsync(
        'SELECT * FROM deliveries WHERE user_id = $userId AND latitude IS NOT NULL AND longitude IS NOT NULL',
        { $userId: user.id }
      );
      setEntregas(deliveries);
    } catch (error) {
      console.error('Erro ao carregar marcadores no mapa:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarMarcadores();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mapa de Entregas e Coleta</Text>

      <MapView
        style={styles.mapa}
        initialRegion={{
          // Região do Brasil inteiro, já que temos entregas com latitude random.
          latitude: -14.2350,   
          longitude: -51.9253,
          latitudeDelta: 30,
          longitudeDelta: 30,
        }}
      >
        <Marker
          coordinate={ifsul}
          title="Ponto de Coleta"
          description="IFSul Bagé"
          pinColor="blue"
        />

        {entregas.map((entrega) => (
          <Marker
            key={String(entrega.id)}
            coordinate={{
              latitude: entrega.latitude,
              longitude: entrega.longitude,
            }}
            title={`Entrega ${entrega.codigo}`}
            description={`Destino: ${entrega.cepDestino} - Status: ${entrega.status}`}
            pinColor="red"
          />
        ))}

      </MapView>

      <Text style={styles.subtitulo}>
        Envie seus produtos para todo Brasil com a FastLog.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#f3f3f3',
  },
  titulo: {
    color:'#136066',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  mapa: {
    width: '100%',
    height: 500,
  },
  subtitulo: {
    fontWeight:'bold',
    color:'#136066',
    fontSize: 16,
    margin: 16,
  },
});