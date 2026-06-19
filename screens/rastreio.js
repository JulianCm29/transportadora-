import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useState } from 'react';
import { openDb } from '../database/db';

const etapas = [
  'Postado',
  'Em trânsito',
  'Saiu para entrega',
  'Entregue',
];

export default function Rastreamento() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [pesquisou, setPesquisou] = useState(false);

  async function buscar() {
    Keyboard.dismiss();
    setPesquisou(true);
    
    if (!codigo) {
      setResultado(null);
      return;
    }

    try {
      const db = await openDb();
      const entrega = await db.getFirstAsync(
        'SELECT * FROM deliveries WHERE codigo = $codigo COLLATE NOCASE',
        { $codigo: codigo }
      );
      setResultado(entrega || null);
    } catch (error) {
      console.error(error);
      setResultado(null);
    }
  }

  function getEtapaAtual(status) {
    return etapas.indexOf(status);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Rastreamento</Text>

      <TextInput
        placeholder="Digite o código (ex: FL582913)"
        style={styles.input}
        value={codigo}
        onChangeText={setCodigo}
        autoCapitalize="characters"
      />

      <TouchableOpacity style={styles.botao} onPress={buscar}>
        <Text style={styles.botaoTexto}>Rastrear</Text>
      </TouchableOpacity>

      {resultado && (
        <View style={styles.resultado}>
          <Text style={styles.codigo}>{resultado.codigo}</Text>
          <Text>Destino: {resultado.cepDestino}</Text>
          <Text>Status atual: {resultado.status}</Text>
          <Text>Peso: {resultado.peso}</Text>

          {/* RASTREAMENTO */}
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: 'bold' }}>Linha do Tempo</Text>

            {etapas.map((etapa, index) => {
              const atual = getEtapaAtual(resultado.status);

              return (
                <Text
                  key={index}
                  style={{
                    color: index <= atual ? 'green' : 'gray',
                    fontWeight: index === atual ? 'bold' : 'normal',
                  }}
                >
                  {index <= atual ? '✔️ ' : '○ '} {etapa}
                </Text>
              );
            })}
          </View>
        </View>
      )}

      {pesquisou && !resultado && codigo !== '' && (
        <Text style={{ marginTop: 10, color: 'red' }}>
          Código não encontrado.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#136066',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#136066',
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
    borderRadius: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultado: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  codigo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
});