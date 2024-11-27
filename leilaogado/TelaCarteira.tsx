import * as React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { connectWallet, getContract } from './walletconnect';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

interface ContractABI {
  // Defina a estrutura do seu contrato ABI aqui
}

const contractABI: ContractABI[] = [/* ABI do seu contrato */];
const contractAddress = 'SEU_CONTRATO_ENDERECO';

type CarteiraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Carteira'>;
type CarteiraScreenRouteProp = RouteProp<RootStackParamList, 'Carteira'>;

type Props = {
  navigation: CarteiraScreenNavigationProp;
  route: CarteiraScreenRouteProp;
};

const TelaCarteira: React.FC<Props> = ({ navigation, route }) => {
  const { userType } = route.params;
  const [publicKey, setPublicKey] = useState('');

  const handleConnectWallet = async () => {
    try {
      const provider = new Web3Provider((window as any).ethereum); // Define o provider
      const signer = provider.getSigner(); // Obtém o assinante (signer)
      const address = await signer.getAddress(); // Obtém o endereço público
      setPublicKey(address); // Define o endereço no estado

      const contract = getContract(signer as unknown as ethers.Signer, contractAddress, contractABI);
      console.log('Contrato instanciado:', contract);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao conectar a carteira');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carteira</Text>
      <Text style={styles.userType}>Tipo de Usuário: {userType}</Text> {/* Exemplo de uso */}
      <TouchableOpacity style={styles.button} onPress={handleConnectWallet}>
        <Text style={styles.buttonText}>Conectar Carteira</Text>
      </TouchableOpacity>
      {publicKey ? <Text style={styles.publicKey}>{publicKey}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  userType: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  button: {
    backgroundColor: '#2089dc',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  publicKey: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default TelaCarteira;