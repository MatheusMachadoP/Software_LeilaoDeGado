import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import api from './api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Leilao {
  id: number;
  nomeAtivo: string;
  descricao: string;
  valorInicial: number;
  foto: string;
  dataInicio: string;
  status: string; // Adicionado para verificar o status do leilão
}

const TelaParticiparLeilao: React.FC = () => {
  const route = useRoute();
  type RootStackParamList = {
    TelaParticiparLeilao: { leilaoId: number };
    Login: undefined;
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { leilaoId } = route.params as { leilaoId: number };
  const [leilao, setLeilao] = useState<Leilao | null>(null);
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeilao = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado, faça login novamente.');
          navigation.navigate('Login'); // Redireciona para a tela de login
          return;
        }

        const response = await api.get(`/leiloes/${leilaoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeilao(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do leilão.');
      }
    };

    fetchLeilao();
  }, [leilaoId, navigation]);

  const handleParticipar = async () => {
    if (!valor) {
      Alert.alert('Erro', 'Por favor, insira o valor do lance.');
      return;
    }

    const numericValor = parseFloat(valor);
    if (isNaN(numericValor) || numericValor <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido para o lance.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado, faça login novamente.');
        navigation.navigate('Login');
        return;
      }

      const response = await api.post(`/leiloes/${leilaoId}/participar`, { valor: numericValor }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('Sucesso', response.data.message);
      setValor('');
      // Atualiza os detalhes do leilão após a participação
      const updatedLeilao = await api.get(`/leiloes/${leilaoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeilao(updatedLeilao.data);
    } catch (error: any) {
      console.error('Erro ao participar do leilão:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao participar do leilão');
    } finally {
      setLoading(false);
    }
  };

  if (!leilao) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando detalhes do leilão...</Text>
        <ActivityIndicator size="large" color="#03DAC6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.nomeAtivo}>{leilao.nomeAtivo}</Text>
      <Image 
        source={{ uri: leilao.foto ? `http://192.168.0.39:3002/uploads/${leilao.foto}` : 'default_image_url' }} 
        style={styles.image} 
      />
      <Text style={styles.descricao}>{leilao.descricao}</Text>
      <Text style={styles.valorInicial}>Valor Inicial: R${leilao.valorInicial.toFixed(2)}</Text>
      <Text style={styles.dataInicio}>Data de Início: {new Date(leilao.dataInicio).toLocaleDateString()}</Text>
      <Text style={styles.horaInicio}>Hora de Início: {new Date(leilao.dataInicio).toLocaleTimeString()}</Text>
      <Text style={styles.status}>Status: {leilao.status}</Text>

      {leilao.status !== 'Aberto' ? (
        <Text style={styles.statusText}>Este leilão não está aberto para participação.</Text>
      ) : (
        <View style={styles.participarContainer}>
          <TextInput
            style={styles.input}
            placeholder="Valor do Lance"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.lanceButton} onPress={handleParticipar} disabled={loading}>
            <Text style={styles.lanceButtonText}>{loading ? 'Processando...' : 'Participar do Leilão'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  nomeAtivo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descricao: {
    fontSize: 16,
    color: '#ccc',
    marginVertical: 10,
    textAlign: 'center',
  },
  valorInicial: {
    fontSize: 18,
    color: '#BB86FC',
    marginVertical: 10,
  },
  dataInicio: {
    fontSize: 18,
    color: '#BB86FC',
    marginVertical: 10,
  },
  horaInicio: {
    fontSize: 18,
    color: '#BB86FC',
    marginVertical: 10,
  },
  status: {
    fontSize: 18,
    color: '#BB86FC',
    marginVertical: 10,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  participarContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: '#1E1E1E',
  },
  lanceButton: {
    backgroundColor: '#03DAC6',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  lanceButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  statusText: {
    color: '#FF0000',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default TelaParticiparLeilao;