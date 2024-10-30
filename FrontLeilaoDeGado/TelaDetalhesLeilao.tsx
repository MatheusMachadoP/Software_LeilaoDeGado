import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import api from './api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';

// Tipagem para o leilão
interface Leilao {
  id: string;
  nomeAtivo: string;
  raca: string;
  dataInicio: string;
  valorInicial: number;
  status: string;
  descricao: string;
  foto: string;
}

const TelaDetalhesLeilao = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const [leilao, setLeilao] = useState<Leilao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeilao = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          Alert.alert('Erro', 'Token de autenticação não encontrado');
          return;
        }

        console.log('Token de autenticação:', token);
        console.log('Buscando detalhes do leilão com ID:', id);

        const response = await api.get(`/leiloes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Resposta da API:', response.data);
        setLeilao(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          Alert.alert('Erro', 'Leilão não encontrado ou acesso negado');
        } else {
          console.error('Erro ao buscar leilão:', error);
          Alert.alert('Erro', 'Não foi possível carregar os detalhes do leilão.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeilao();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!leilao) {
    return <Text style={styles.errorText}>Leilão não encontrado</Text>;
  }

  const valorInicialFormatado = typeof leilao.valorInicial === 'number' ? leilao.valorInicial.toFixed(2) : '0.00';

  return (
    <View style={styles.container}>
      <Text style={styles.nomeAtivo}>{leilao.nomeAtivo}</Text>
      <Text style={styles.raca}>{leilao.raca}</Text>
      <Text style={styles.dataInicio}>{leilao.dataInicio}</Text>
      <Text style={styles.valorInicial}>Valor Inicial: {valorInicialFormatado}</Text>
      <Text style={styles.status}>{leilao.status}</Text>
      <Text style={styles.descricao}>{leilao.descricao}</Text>
      {leilao.foto && <Image source={{ uri: leilao.foto }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  nomeAtivo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  raca: {
    fontSize: 18,
    color: '#ccc',
  },
  dataInicio: {
    fontSize: 18,
    color: '#ccc',
    marginVertical: 8,
  },
  valorInicial: {
    fontSize: 18,
    color: '#BB86FC',
    marginVertical: 8,
  },
  status: {
    fontSize: 18,
    marginVertical: 8,
  },
  descricao: {
    fontSize: 16,
    color: '#ccc',
    marginVertical: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
  },
});

export default TelaDetalhesLeilao;