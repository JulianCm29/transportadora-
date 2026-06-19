import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert, Image } from 'react-native';
import { useState, useCallback } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useFocusEffect } from '@react-navigation/native';
import { openDb } from '../database/db';
import { useAuth } from '../context/AuthContext';

export default function Historico() {
  const { user } = useAuth();
  const [dados, setDados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [falando, setFalando] = useState(false);

  const carregarDados = async () => {
    if (!user || !user.id) return;
    try {
      const db = await openDb();
      const deliveries = await db.getAllAsync('SELECT * FROM deliveries WHERE user_id = $userId ORDER BY id DESC', { $userId: user.id });
      setDados(deliveries);
    } catch (error) {
      console.error('Erro ao carregar historico:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

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
    destino ${item.cepDestino},
    peso ${item.peso},
    status ${item.status}.
    `;

    Speech.speak(texto, {
      language: 'pt-BR',
      rate: 1.0,
      onDone: () => setFalando(false),
      onStopped: () => setFalando(false),
    });
  }

  const handleDelete = async (id) => {
    Alert.alert('Atenção', 'Deseja realmente excluir esta entrega?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const db = await openDb();
            await db.runAsync('DELETE FROM deliveries WHERE id = $id', { $id: id });
            setModalVisible(false);
            carregarDados();
            Alert.alert('Sucesso', 'Entrega excluída com sucesso.');
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Ocorreu um erro ao excluir.');
          }
        }
      }
    ]);
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const statuses = ['Postado', 'Em trânsito', 'Saiu para entrega', 'Entregue'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      const db = await openDb();
      await db.runAsync('UPDATE deliveries SET status = $status WHERE id = $id', { $status: nextStatus, $id: id });
      setItemSelecionado({ ...itemSelecionado, status: nextStatus });
      carregarDados();
      Alert.alert('Sucesso', `Status atualizado para: ${nextStatus}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o status.');
    }
  };

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
            <Text>Destino: {item.cepDestino}</Text>
            <Text>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {dados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma entrega encontrada.</Text>
        </View>
      ) : (
        <FlatList
          data={dados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {itemSelecionado && (
              <>
                <Text style={styles.titulo}>Detalhes da Entrega</Text>

                {itemSelecionado.image_uri && (
                  <Image source={{ uri: itemSelecionado.image_uri }} style={styles.imagem} />
                )}

                <Text><Text style={styles.bold}>Código:</Text> {itemSelecionado.codigo}</Text>
                <Text><Text style={styles.bold}>Origem:</Text> {itemSelecionado.cepOrigem}</Text>
                <Text><Text style={styles.bold}>Destino:</Text> {itemSelecionado.cepDestino}</Text>
                <Text><Text style={styles.bold}>Formato:</Text> {itemSelecionado.formato}</Text>
                <Text><Text style={styles.bold}>Peso:</Text> {itemSelecionado.peso}</Text>
                <Text><Text style={styles.bold}>Frete:</Text> {itemSelecionado.tipoFrete}</Text>
                <Text><Text style={styles.bold}>Status:</Text> {itemSelecionado.status}</Text>

                <TouchableOpacity
                  style={[styles.botao, { backgroundColor: '#136066' }]}
                  onPress={() => handleUpdateStatus(itemSelecionado.id, itemSelecionado.status)}
                >
                  <Text style={styles.botaoTexto}>✏️ Atualizar Status</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botao}
                  onPress={() => falarDados(itemSelecionado)}
                >
                  <Text style={styles.botaoTexto}>
                    {falando ? '🔊 Falando...' : '🔊 Ouvir'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botao, { backgroundColor: '#d9534f' }]}
                  onPress={() => handleDelete(itemSelecionado.id)}
                >
                  <Text style={styles.botaoTexto}>🗑️ Excluir Entrega</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.botao, { backgroundColor: '#555', marginTop: 20 }]}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
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
    width: '85%',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  imagem: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  bold: {
    fontWeight: 'bold',
  },
  botao: {
    marginTop: 10,
    backgroundColor: '#000',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});