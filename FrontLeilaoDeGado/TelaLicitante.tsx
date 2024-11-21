import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

const TelaLicitante: React.FC = () => {
  const [valorLance, setValorLance] = useState('');
  const [nomeLicitante, setNomeLicitante] = useState('');
  const [cpfLicitante, setCpfLicitante] = useState('');

  const handleBid = async () => {
    if (!valorLance || !nomeLicitante || !cpfLicitante) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const contractAddress = 'SEU_CONTRATO_ENDERECO';
    interface ContractMethod {
      darLance: (valorLance: string, nomeLicitante: string, cpfLicitante: string) => {
      send: (options: { from: string }) => Promise<void>;
      };
    }

    interface Contract {
      methods: ContractMethod;
    }

    const contractABI: object[] = [/* ABI do seu contrato */];
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(contractABI as AbiItem[], contractAddress) as unknown as Contract;

    const accounts = await web3.eth.getAccounts();
    const licitante = accounts[0];

    contract.methods
      .darLance(valorLance, nomeLicitante, cpfLicitante)
      .send({ from: licitante })
      .then((receipt) => {
        Alert.alert('Sucesso', 'Lance dado com sucesso');
      })
      .catch((error) => {
        Alert.alert('Erro', 'Erro ao dar lance');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dar Lance</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor do Lance"
        value={valorLance}
        onChangeText={setValorLance}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nomeLicitante}
        onChangeText={setNomeLicitante}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpfLicitante}
        onChangeText={setCpfLicitante}
      />
      <TouchableOpacity style={styles.button} onPress={handleBid}>
        <Text style={styles.buttonText}>Dar Lance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TelaLicitante;