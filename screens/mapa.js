import { Text, View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export function Mapa() {

  const ifsul = {
    latitude: -31.331891250574067,
    longitude: -54.0718179172703,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Uma FastLog sempre perto de você</Text>

      <MapView
        style={styles.mapa}
        initialRegion={{
          latitude: ifsul.latitude,   
          longitude: ifsul.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={ifsul}
          title="Ponto de Coleta"
          description="IFSul Bagé"
        />
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
    paddingTop: 40,
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