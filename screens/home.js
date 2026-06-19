import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { openDb } from '../database/db';

export default function Home({ navigation }) {
  const { user } = useAuth();
  const [cepOrigem, setCepOrigem] = useState('');
  const [cepDestino, setCepDestino] = useState('');
  const [formato, setFormato] = useState('caixa');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [largura, setLargura] = useState('');
  const [comprimento, setComprimento] = useState('');
  const [tipoFrete, setTipoFrete] = useState('');
  const [imageUri, setImageUri] = useState(null);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  function calcularFrete() {
    if (!cepOrigem || !cepDestino || !peso) {
      Alert.alert('Aviso', 'Preencha os dados básicos para calcular.');
      return;
    }
    Alert.alert('Frete Calculado', 'Valor estimado: R$ 45,00');
  }

  async function emitirFrete() {
    if (!cepOrigem || !cepDestino || !tipoFrete) {
      Alert.alert('Aviso', 'Preencha os CEPs e escolha o tipo de frete.');
      return;
    }

    try {
      const codigo = 'FL' + Math.floor(100000 + Math.random() * 900000);
      
      // Coordenadas aleatórias no Brasil para visualização no mapa
      const latitude = -14.2350 + (Math.random() * 10 - 5);
      const longitude = -51.9253 + (Math.random() * 10 - 5);

      const db = await openDb();
      await db.runAsync(
        `INSERT INTO deliveries (user_id, codigo, cepOrigem, cepDestino, formato, peso, tipoFrete, status, image_uri, latitude, longitude) 
         VALUES ($user_id, $codigo, $cepOrigem, $cepDestino, $formato, $peso, $tipoFrete, $status, $image_uri, $latitude, $longitude)`,
        {
          $user_id: user.id,
          $codigo: codigo,
          $cepOrigem: cepOrigem,
          $cepDestino: cepDestino,
          $formato: formato,
          $peso: peso,
          $tipoFrete: tipoFrete,
          $status: 'Postado',
          $image_uri: imageUri,
          $latitude: latitude,
          $longitude: longitude,
        }
      );

      Alert.alert('Sucesso', `Frete ${codigo} emitido com sucesso!`);
      
      // Limpar formulário
      setCepOrigem('');
      setCepDestino('');
      setPeso('');
      setAltura('');
      setLargura('');
      setComprimento('');
      setTipoFrete('');
      setImageUri(null);
      
      // Navegar para Histórico
      navigation.navigate('Histórico');

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao emitir o frete.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.titulo}>FastLog</Text>

        <View style={styles.box}>
          <View style={styles.row}>
            <View style={styles.campoMetade}>
              <Text style={styles.label}>Informe a origem:</Text>
              <TextInput
                style={styles.input}
                placeholder="CEP XXXXX-XXX"
                value={cepOrigem}
                onChangeText={setCepOrigem}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.campoMetade}>
              <Text style={styles.label}>Informe o destino:</Text>
              <TextInput
                style={styles.input}
                placeholder="CEP XXXXX-XXX"
                value={cepDestino}
                onChangeText={setCepDestino}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.campoMetade}>
              <Text style={styles.label}>Formato</Text>
              <View style={styles.select}>
                <Picker
                  selectedValue={formato}
                  onValueChange={(itemValue) => setFormato(itemValue)}
                >
                  <Picker.Item label="Caixa/envelope" value="caixa" />
                  <Picker.Item label="Pacote" value="pacote" />
                </Picker>
              </View>
            </View>

            <View style={styles.campoMetade}>
              <Text style={styles.label}>Peso</Text>
              <View style={styles.select}>
                <Picker
                  selectedValue={peso}
                  onValueChange={(itemValue) => setPeso(itemValue)}
                >
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="Até 1kg" value="1kg" />
                  <Picker.Item label="Até 2kg" value="2kg" />
                  <Picker.Item label="Até 5kg" value="5kg" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.campoTerco}>
              <Text style={styles.label}>Altura</Text>
              <TextInput
                style={styles.input}
                value={altura}
                onChangeText={setAltura}
                keyboardType="numeric"
                placeholder="00"
              />
            </View>

            <View style={styles.campoTerco}>
              <Text style={styles.label}>Largura</Text>
              <TextInput
                style={styles.input}
                value={largura}
                onChangeText={setLargura}
                keyboardType="numeric"
                placeholder="00"
              />
            </View>

            <View style={styles.campoTerco}>
              <Text style={styles.label}>Comprimento</Text>
              <TextInput
                style={styles.input}
                value={comprimento}
                onChangeText={setComprimento}
                keyboardType="numeric"
                placeholder="00"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.botaoCalcular} onPress={calcularFrete}>
            <Text style={styles.textoBotao}>Calcular frete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box}>
          <Text style={styles.subtitulo}>ANEXAR FOTO DA ENCOMENDA</Text>
          <TouchableOpacity style={styles.botaoUpload} onPress={pickImage}>
            <Text style={styles.textoBotao}>Escolher Imagem</Text>
          </TouchableOpacity>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.imagemPreview} />
          )}
        </View>

        <View style={styles.box}>
          <Text style={styles.subtitulo}>POSTE EM QUALQUER AGÊNCIA</Text>

          <TouchableOpacity
            style={styles.opcao}
            onPress={() => setTipoFrete('PAC')}
          >
            <View style={styles.radioLinha}>
              <View style={styles.radioExterno}>
                {tipoFrete === 'PAC' && <View style={styles.radioInterno} />}
              </View>
              <Text style={styles.radioTexto}>PAC</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.opcao}
            onPress={() => setTipoFrete('SEDEX')}
          >
            <View style={styles.radioLinha}>
              <View style={styles.radioExterno}>
                {tipoFrete === 'SEDEX' && <View style={styles.radioInterno} />}
              </View>
              <Text style={styles.radioTexto}>SEDEX</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoEmitir} onPress={emitirFrete}>
            <Text style={styles.textoBotao}>EMITIR FRETE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#f3f3f3',
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor:'#f3f3f3'
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#136066',
  },
  box: {
    backgroundColor: '#d9d9d9',
    padding: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  campoMetade: {
    width: '48%',
  },
  campoTerco: {
    width: '31%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#888',
    height: 40,
    paddingHorizontal: 8,
  },
  select: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#888',
    height: 50,
    justifyContent: 'center',
  },
  botaoCalcular: {
    backgroundColor: '#136066',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoUpload: {
    backgroundColor: '#555',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagemPreview: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#999',
  },
  botaoEmitir: {
    backgroundColor: '#136066',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    alignSelf: 'flex-end',
    width: 140,
  },
  textoBotao: {
    fontWeight: 'bold',
    color:'white',
  },
  subtitulo: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  opcao: {
    backgroundColor: '#ececec',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  radioLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioExterno: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInterno: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  radioTexto: {
    fontSize: 14,
  },
});