import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from './api/api';
import { AxiosError } from 'axios';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MeusLeiloesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MeusLeiloes'>;

interface Leilao {
  id: string;
  nome_ativo: string;
  raca: string;
  data_inicio: string;
  valor_inicial: string;
  foto: string;
}

const TelaMeusLeiloes: React.FC = () => {
  const [leiloes, setLeiloes] = useState<Leilao[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<MeusLeiloesScreenNavigationProp>();

  useEffect(() => {
    const fetchLeiloes = async () => {
      try {
        // Recupera o token do AsyncStorage
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado, faça login novamente.');
          return;
        }

        const response = await api.get('/meus-leiloes', {
          headers: {
            'Authorization': `Bearer ${token}`, // Enviando o token no cabeçalho
          },
        });

        console.log('Leilões recebidos:', response.data); // Log para verificar se os leilões estão sendo recebidos
        setLeiloes(response.data);
      } catch (error) {
        const err = error as AxiosError;
        if (err.response && err.response.status === 404) {
          setLeiloes([]); // Defina como uma lista vazia se não encontrar nenhum leilão
        } else {
          console.error('Erro ao buscar leilões:', err.message);
          Alert.alert('Erro ao buscar leilões', err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeiloes();
  }, []); // O array vazio como segundo argumento faz com que o useEffect rode apenas uma vez, quando o componente é montado

  const renderItem = ({ item }: { item: Leilao }) => (
    <TouchableOpacity
      style={styles.leilaoContainer}
      onPress={() => navigation.navigate('GerenciarLeilao', { leilaoId: item.id })}
    >
      <Image source={{ uri: item.foto }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.nomeAtivo}>{item.nome_ativo}</Text>
        <Text style={styles.raca}>Raça: {item.raca}</Text>
        <Text style={styles.dataInicio}>Início: {new Date(item.data_inicio).toLocaleDateString()}</Text>
        <Text style={styles.valorInicial}>Valor Inicial: R${item.valor_inicial}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
    );
  }

  if (leiloes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nenhum leilão encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Leilões</Text>
      <FlatList
        data={leiloes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    paddingBottom: 20,
  },
  leilaoContainer: {
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  nomeAtivo: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  raca: {
    fontSize: 16,
    color: '#ccc',
  },
  dataInicio: {
    fontSize: 16,
    color: '#ccc',
  },
  valorInicial: {
    fontSize: 16,
    color: '#BB86FC',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default TelaMeusLeiloes;
