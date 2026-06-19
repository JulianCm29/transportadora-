import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useState } from 'react';
import { openDb } from '../database/db';

export default function RegisterTela({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    try {
      const db = await openDb();
      await db.runAsync(
        'INSERT INTO users (name, email, password) VALUES ($nome, $email, $senha)',
        { $nome: nome, $email: email, $senha: senha }
      );
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar a conta. Talvez o email já esteja em uso.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png' }}
          style={styles.logo}
        />
        
        <Text style={styles.label}>Nome</Text>
        <TextInput
          placeholder="Seu nome"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          placeholder="seu@email.com"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="********"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.botao} onPress={handleRegister}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem uma conta? Entrar</Text>
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
    backgroundColor: '#2D5BFF',
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
  link: {
    marginTop: 15,
    textDecorationLine: 'underline',
    color: '#333',
  },
});
