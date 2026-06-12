import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const dados = [
  { id: '1', codigo: 'FL582913', destino: 'Pelotas - RS', status: 'Emitido', data: '01/04/2026' },
  { id: '2', codigo: 'FL947201', destino: 'Florianópolis - SC', status: 'Em trânsito', data: '02/04/2026' },
  { id: '3', codigo: 'FL663728', destino: 'Curitiba - PR', status: 'Postado', data: '03/04/2026' },
  { id: '4', codigo: 'FL110394', destino: 'Caxias do Sul - RS', status: 'Saiu para entrega', data: '04/04/2026' },
  { id: '5', codigo: 'FL889201', destino: 'São Paulo - SP', status: 'Entregue', data: '05/04/2026' },
  { id: '6', codigo: 'FL772510', destino: 'Rio de Janeiro - RJ', status: 'Em trânsito', data: '06/04/2026' },
  { id: '7', codigo: 'FL334890', destino: 'Belo Horizonte - MG', status: 'Postado', data: '07/04/2026' },
  { id: '8', codigo: 'FL905612', destino: 'Santa Maria - RS', status: 'Saiu para entrega', data: '08/04/2026' },
  { id: '9', codigo: 'FL128734', destino: 'Fortaleza - CE', status: 'Entregue', data: '09/04/2026' },
  { id: '10', codigo: 'FL667421', destino: 'Porto Alegre - RS', status: 'Em trânsito', data: '10/04/2026' },
  { id: '11', codigo: 'FL492118', destino: 'Recife - PE', status: 'Postado', data: '11/04/2026' },
  { id: '12', codigo: 'FL781305', destino: 'Brasília - DF', status: 'Emitido', data: '12/04/2026' },
];

export default function Historico() {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [falando, setFalando] = useState(false);

  function renderIcone(status) {
    if (status === 'Em trânsito') {
      return <MaterialCommunityIcons name="truck-fast-outline" size={22} color="#000" />;
    }
    if (status === 'Entregue') {
      return <MaterialCommunityIcons name="check-bold" size={22} color="#000" />;
    }
    if (status === 'Postado') {
      return <MaterialCommunityIcons name="email-outline" size={22} color="#000" />;
    }
    return <MaterialCommunityIcons name="clock-outline" size={22} color="#000" />;
  }

  function falarDados(item) {
    if (falando) return; 

    Speech.stop(); 
    setFalando(true);

    const texto = `
    Entrega código ${item.codigo},
    destino ${item.destino},
    status ${item.status},
    data ${item.data}.
    `;

    Speech.speak(texto, {
      language: 'pt-BR',
      rate: 1.0,
      onDone: () => setFalando(false),
      onStopped: () => setFalando(false),
    });
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          Speech.stop();
          setFalando(false);
          setItemSelecionado(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.card}>
          <View style={styles.iconeContainer}>
            {renderIcone(item.status)}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.codigo}>{item.codigo}</Text>
            <Text>{item.destino}</Text>
            <Text>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {itemSelecionado && (
              <>
                <Text style={styles.titulo}>Detalhes</Text>

                <Text>Código: {itemSelecionado.codigo}</Text>
                <Text>Destino: {itemSelecionado.destino}</Text>
                <Text>Status: {itemSelecionado.status}</Text>
                <Text>Data: {itemSelecionado.data}</Text>

                <TouchableOpacity
                  style={styles.botao}
                  onPress={() => falarDados(itemSelecionado)}
                >
                  <Text style={styles.botaoTexto}>
                    {falando ? '🔊 Falando...' : '🔊 Ouvir'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.botao, { backgroundColor: '#555' }]}
              onPress={() => {
                Speech.stop();
                setFalando(false);
                setModalVisible(false);
              }}
            >
              <Text style={styles.botaoTexto}>Fechar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#999',
  },
  iconeContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  infoContainer: {
    flex: 1,
  },
  codigo: {
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botao: {
    marginTop: 10,
    backgroundColor: '#000',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  botaoTexto: {
    color: '#fff',
  },
});