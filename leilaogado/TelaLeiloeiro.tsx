import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Web3, { AbiItem } from 'web3';
import { TransactionReceipt } from 'web3';


const TelaLeiloeiro: React.FC = () => {
  const [nomeAtivo, setNomeAtivo] = useState('');
  const [precoInicial, setPrecoInicial] = useState('');
  const [duracaoLeilao, setDuracaoLeilao] = useState('');
  const [data, setData] = useState('');

  const handleCreateAuction = async () => {
    if (!nomeAtivo || !precoInicial || !duracaoLeilao || !data) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const contractAddress = 'SEU_CONTRATO_ENDERECO';

    const contractABI: AbiItem[] = [/* ABI do seu contrato */];
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    const leiloeiro = accounts[0];

    contract.methods
      .constructor(nomeAtivo, precoInicial, duracaoLeilao, data)
      .send({ from: leiloeiro })
      .then((receipt: TransactionReceipt) => {
        Alert.alert('Sucesso', 'Leilão criado com sucesso');
      })
      .catch((error: Error) => {
        Alert.alert('Erro', 'Erro ao criar leilão');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Leilão</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Ativo"
        value={nomeAtivo}
        onChangeText={setNomeAtivo}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço Inicial"
        value={precoInicial}
        onChangeText={setPrecoInicial}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Duração do Leilão (segundos)"
        value={duracaoLeilao}
        onChangeText={setDuracaoLeilao}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Data"
        value={data}
        onChangeText={setData}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateAuction}>
        <Text style={styles.buttonText}>Criar Leilão</Text>
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

export default TelaLeiloeiro;