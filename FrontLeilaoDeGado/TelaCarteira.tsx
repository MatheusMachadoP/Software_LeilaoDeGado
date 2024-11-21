import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api/api'; // Importando a instância do axios
import { isAddress } from 'ethers'; // Importando isAddress de ethers.js

type CarteiraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Carteira'>;
type CarteiraScreenRouteProp = RouteProp<RootStackParamList, 'Carteira'>;

type Props = {
  navigation: CarteiraScreenNavigationProp;
  route: CarteiraScreenRouteProp;
};

const TelaCarteira: React.FC<Props> = ({ route, navigation }) => {
  const { address, userType, userId } = route.params; // Adicionando userId
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState<string>('');

  // Verifica o tipo de usuário ao carregar a tela
  useEffect(() => {
    if (!userType) {
      Alert.alert("Erro", "Tipo de usuário não definido.");
      navigation.navigate('BoasVindas');
    } else {
      console.log("Tipo de usuário recebido:", userType); // Log para verificar o valor de userType
    }
  }, [userType]);

  // Função para conectar a carteira manualmente
  const handleManualConnect = async () => {
    if (!manualAddress) {
      Alert.alert("Erro", "Por favor, insira a chave pública da carteira.");
      return;
    }

    // Validar o endereço da carteira usando ethers.js
    if (!isAddress(manualAddress)) {
      Alert.alert("Erro", "Endereço de carteira inválido.");
      return;
    }

    try {
      setWalletAddress(manualAddress);
      await AsyncStorage.setItem('walletAddress', manualAddress);

      // Enviar o endereço da carteira para o backend
      await api.post('/api/usuarios/update-wallet-address', { userId, walletAddress: manualAddress });

      Alert.alert("Sucesso", "Carteira conectada com sucesso!");
    } catch (error) {
      console.error("Erro ao conectar a carteira:", error);
      Alert.alert("Erro", "Não foi possível conectar a carteira.");
    }
  };

  // Função para desconectar a carteira
  const handleDisconnectWallet = async () => {
    console.log("Tentando desconectar a carteira...");
    try {
      setWalletAddress(null);
      await AsyncStorage.removeItem('walletAddress');

      // Enviar a remoção do endereço da carteira para o backend
      await api.post('/api/usuarios/remove-wallet-address', { userId });

      Alert.alert("Sucesso", "Carteira desconectada com sucesso!");
      navigation.navigate('BoasVindas');
    } catch (error) {
      console.error("Erro ao desconectar a carteira:", error);
      Alert.alert("Erro", "Não foi possível desconectar a carteira.");
    }
  };

  // Função para navegar para a tela do usuário com base no tipo
  const navigateToUserScreen = () => {
    console.log("Tipo de usuário para navegação:", userType);
    switch (userType) {
      case 'Licitante':
        navigation.navigate('Licitante');
        break;
      case 'Leiloeiro':
        navigation.navigate('GerenciarLeilao');
        break;
      default:
        Alert.alert("Erro", "Tipo de usuário desconhecido.");
        navigation.navigate('BoasVindas');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('./assets/metamask-logo.png')} style={styles.logo} />
        <Text style={styles.cardTitle}>METAMASK</Text>
        <Text style={styles.cardSubtitle}><Text style={styles.boldText}>Chave Pública:</Text> {walletAddress || address}</Text>
        <Text style={styles.cardSubtitle}><Text style={styles.boldText}>Nome:</Text> {userId}</Text>
        <Text style={styles.connectedText}>Conectado</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Insira a chave pública da carteira"
        placeholderTextColor="#888"
        value={manualAddress}
        onChangeText={setManualAddress}
      />

      <TouchableOpacity style={styles.button} onPress={navigateToUserScreen}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.connectButton} onPress={handleManualConnect}>
        <Text style={styles.connectButtonText}>Conectar Carteira Manualmente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnectWallet}>
        <Text style={styles.disconnectButtonText}>Desconectar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#6236FF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  connectedText: {
    color: '#03DAC6',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: '100%',
  },
  button: {
    backgroundColor: '#03DAC6',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
  },
  connectButton: {
    backgroundColor: '#03DAC6',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  connectButtonText: {
    color: '#000000',
    fontSize: 18,
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  disconnectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default TelaCarteira;