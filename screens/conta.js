import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Conta() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png' }}
          style={styles.logo}
        />
        
        <Text style={styles.titulo}>Meu Perfil</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.valor}>{user?.name}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.valor}>{user?.email}</Text>
        </View>

        <TouchableOpacity style={styles.botaoSair} onPress={logout}>
          <Text style={styles.botaoTexto}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#ECECEC',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  valor: {
    color: '#333',
  },
  botaoSair: {
    backgroundColor: '#FF3B30',
    width: '100%',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});