import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import api from './api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  RealizarLances: { leilaoId: number };
};

type RealizarLancesScreenRouteProp = RouteProp<RootStackParamList, 'RealizarLances'>;

type Leilao = {
  nomeAtivo: string;
  descricao: string;
  valorInicial: number;
};

const TelaRealizarLances: React.FC = () => {
  const route = useRoute<RealizarLancesScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { leilaoId } = route.params;
  const [lance, setLance] = useState('');
  const [leilao, setLeilao] = useState<Leilao | null>(null);

  useEffect(() => {
    const fetchLeilao = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado, faça login novamente.');
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
  }, [leilaoId]);

  const handleLance = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado, faça login novamente.');
        return;
      }

      const response = await api.post(`/leiloes/${leilaoId}/lances`, { valor: lance }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Sucesso', 'Lance realizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar o lance.');
    }
  };

  if (!leilao) {
    return <Text style={styles.loadingText}>Carregando detalhes do leilão...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{leilao.nomeAtivo}</Text>
      <Text style={styles.descricao}>{leilao.descricao}</Text>
      <Text style={styles.valorInicial}>Valor Inicial: R${leilao.valorInicial.toFixed(2)}</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu lance"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={lance}
        onChangeText={setLance}
      />
      <TouchableOpacity style={styles.lanceButton} onPress={handleLance}>
        <Text style={styles.lanceButtonText}>Fazer Lance</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
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
  input: {
    width: '100%',
    backgroundColor: '#222',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  lanceButton: {
    backgroundColor: '#03DAC6',
    padding: 10,
    borderRadius: 5,
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
});

export default TelaRealizarLances;