import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';


const dados = [
  { codigo: 'FL582913', destino: 'Pelotas - RS', status: 'Emitido', data: '01/04/2026' },
  { codigo: 'FL947201', destino: 'Florianópolis - SC', status: 'Em trânsito', data: '02/04/2026' },
  { codigo: 'FL663728', destino: 'Curitiba - PR', status: 'Postado', data: '03/04/2026' },
  { codigo: 'FL110394', destino: 'Caxias do Sul - RS', status: 'Saiu para entrega', data: '04/04/2026' },
  { codigo: 'FL889201', destino: 'São Paulo - SP', status: 'Entregue', data: '05/04/2026' },
];

const etapas = [
  'Emitido',
  'Postado',
  'Em trânsito',
  'Saiu para entrega',
  'Entregue',
];

export default function Rastreamento() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);


  function buscar() {
    const encontrado = dados.find(
      (item) => item.codigo.toLowerCase() === codigo.toLowerCase()
    );

    setResultado(encontrado || null);
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
      />

      <TouchableOpacity style={styles.botao} onPress={buscar}>
        <Text style={styles.botaoTexto}>Rastrear</Text>
      </TouchableOpacity>

      {resultado && (
        <View style={styles.resultado}>
          <Text style={styles.codigo}>{resultado.codigo}</Text>
          <Text>{resultado.destino}</Text>
          <Text>{resultado.status}</Text>
          <Text>{resultado.data}</Text>


          {/* RASTREAMENTO */}
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: 'bold' }}>Rastreamento</Text>

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

      {!resultado && codigo !== '' && (
        <Text style={{ marginTop: 10, color: 'red' }}>
          Código não encontrado
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#136066',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    fontSize:22,
    fontWeight:'bold'
  },
  botaoTexto: {
    color: '#fff',
  },
  resultado: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eee',
  },
  codigo: {
    fontWeight: 'bold',
  },
});