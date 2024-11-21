import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from './api/api';
import { AxiosError } from 'axios';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipagem para navegação
type MeusLeiloesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MeusLeiloes'>;

// Definindo os campos do Leilão conforme esperado pelo backend
interface Leilao {
  id: string;
  nomeAtivo: string;  
  raca: string;
  dataInicio: string;
  valorInicial: string;
  status: string; 
  foto: string;
}

const TelaMeusLeiloes: React.FC = () => {
  const [leiloes, setLeiloes] = useState<Leilao[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<MeusLeiloesScreenNavigationProp>();

  // Função para verificar e atualizar o status do leilão baseado na data
  const atualizarStatusLeiloes = (leiloes: Leilao[]): Leilao[] => {
    const dataAtual = new Date();
    return leiloes.map((leilao) => {
      const dataInicioLeilao = new Date(leilao.dataInicio);
      if (dataInicioLeilao < dataAtual) {
        return { ...leilao, status: 'Encerrado' };
      }
      return leilao;
    });
  };

  useEffect(() => {
    const fetchLeiloes = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado, faça login novamente.');
          return;
        }

        // Faz a requisição para buscar os leilões criados pelo leiloeiro
        const response = await api.get('/leiloes/meus-leiloes', {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });

        console.log('Leilões recebidos:', JSON.stringify(response.data, null, 2));
        const leiloesAtualizados = atualizarStatusLeiloes(response.data);
        setLeiloes(leiloesAtualizados);
      } catch (error) {
        const err = error as AxiosError;
        console.error('Erro ao buscar leilões:', err.response?.data || err.message);
        if (err.response && err.response.status === 404) {
          setLeiloes([]);
        } else {
          Alert.alert('Erro ao buscar leilões', err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeiloes();
  }, []); 

  const handleAcompanharLeilao = (id: string) => {
    navigation.navigate('DetalhesLeilao', { leilaoId: id });
  };

  const renderItem = ({ item }: { item: Leilao }) => (
    <View style={styles.leilaoContainer}>
      <Image source={{ uri: item.foto ? `http://localhost:3000/uploads/${item.foto}` : 'default_image_url' }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.nomeAtivo}>{item.nomeAtivo}</Text>
        <Text style={styles.raca}>Raça: {item.raca}</Text>
        <Text style={styles.dataInicio}>Início: {new Date(item.dataInicio).toLocaleDateString()}</Text>
        <Text style={styles.valorInicial}>Valor Inicial: R${item.valorInicial}</Text>
        <Text
          style={[
            styles.status,
            item.status === 'Encerrado' ? styles.statusEncerrado : styles.statusAberto
          ]}
        >
          Status: {item.status}
        </Text>
        {/* Botão de acompanhar */}
        <TouchableOpacity style={styles.acompanharButton} onPress={() => handleAcompanharLeilao(item.id)}>
          <Text style={styles.acompanharButtonText}>Acompanhar</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  status: {
    fontSize: 16,
    marginTop: 5,
  },
  statusAberto: {
    color: '#4CAF50',
  },
  statusEncerrado: {
    color: '#FF0000',
  },
  acompanharButton: {
    marginTop: 10,
    backgroundColor: '#03DAC6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  acompanharButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default TelaMeusLeiloes;
