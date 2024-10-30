import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from './api/api';
import { AxiosError } from 'axios';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipagem para navegação
type LicitanteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Licitante'>;

// Definindo os campos do Leilão conforme esperado pelo backend
interface Leilao {
  id: number;
  nomeAtivo: string;
  raca: string;
  dataInicio: string;
  valorInicial: number;
  status: string;
  descricao: string;
  foto: string;
}

const TelaLicitante: React.FC = () => {
  const [leiloes, setLeiloes] = useState<Leilao[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<LicitanteScreenNavigationProp>();

  useEffect(() => {
    const fetchLeiloes = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado, faça login novamente.');
          return;
        }

        // Faz a requisição para buscar todos os leilões com status "Aberto"
        const response = await api.get('/leiloes/disponiveis', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Leilões recebidos:', response.data); // Log para verificar os dados recebidos

        // Definir os leilões abertos no estado
        setLeiloes(response.data);
      } catch (error) {
        const err = error as AxiosError;
        console.error('Erro ao buscar leilões:', err.response?.data || err.message);
        if (err.response && err.response.status === 404) {
          setLeiloes([]); // Nenhum leilão aberto foi encontrado
        } else {
          Alert.alert('Erro ao buscar leilões', err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeiloes();
  }, []);

  // Converte o ID para string ao navegar
  const handleNavigate = (id: number) => {
    console.log('ID sendo navegado:', id); // Verifique se o ID está correto
    navigation.navigate('DetalhesLeilao', { leilaoId: id.toString() }); // Converte o ID para string
  };

  const renderItem = ({ item }: { item: Leilao }) => (
    <TouchableOpacity
      style={styles.leilaoContainer}
      onPress={() => handleNavigate(item.id)}
    >
      <Image source={{ uri: item.foto ? `http://localhost:3000/uploads/${item.foto}` : 'default_image_url' }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.nomeAtivo}>{item.nomeAtivo}</Text>
        <Text style={styles.raca}>Raça: {item.raca}</Text>
        <Text style={styles.dataInicio}>Início: {new Date(item.dataInicio).toLocaleDateString()}</Text>
  
        {/* Converte valorInicial para número antes de formatar */}
        <Text style={styles.valorInicial}>
          Valor Inicial: R${parseFloat(item.valorInicial.toString() || '0').toFixed(2)}
        </Text>
        
        <Text style={[styles.status, styles.statusAberto]}>
          Status: {item.status}
        </Text>
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
        <Text style={styles.title}>Nenhum leilão disponível.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leilões Disponíveis</Text>
      <FlatList
        data={leiloes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
    color: '#4CAF50', // Verde para leilão aberto
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default TelaLicitante;