import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from 'react';

export default function LoginTela() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      
      <View style={styles.card}>

        {/* Logo */}
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png' }}
          style={styles.logo}
        />

        {/* Usuário */}
        <Text style={styles.label}>Usuário</Text>
        <TextInput
          placeholder="@usuario"
          style={styles.input}
          value={usuario}
          onChangeText={setUsuario}
        />

        {/* Senha */}
        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="********"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        {/* Botão */}
        <TouchableOpacity style={styles.botao}>
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>

        {/* Botões sociais */}
        <TouchableOpacity style={styles.socialBtn}>
          <Text>Entrar com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialBtn}>
          <Text>Entrar com Facebook</Text>
        </TouchableOpacity>

        {/* Links */}
        <Text style={styles.link}>Esqueceu a senha?</Text>
        <Text style={styles.link}>Primeiro acesso</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9', // cinza do fundo
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#ECECEC', // card claro
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  label: {
    alignSelf: 'flex-start',
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    paddingVertical: 5,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#2D5BFF', // azul igual imagem
    width: '100%',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  socialBtn: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 10,
    textDecorationLine: 'underline',
    color: '#333',
  },
});