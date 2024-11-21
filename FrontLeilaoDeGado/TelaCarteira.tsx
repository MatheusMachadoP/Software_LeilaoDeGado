import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { connectWallet } from './walletconnect';

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
      const account = await connectWallet();
      Alert.alert('Carteira Conectada', `Conta: ${account}`);
      if (userType === 'Leiloeiro') {
        navigation.navigate('Leiloeiro');
      } else {
        navigation.navigate('Licitante');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao conectar a carteira');
    }
  };

  const handleManualConnect = () => {
    if (publicKey) {
      Alert.alert('Chave Pública Conectada', `Conta: ${publicKey}`);
      if (userType === 'Leiloeiro') {
        navigation.navigate('Leiloeiro');
      } else {
        navigation.navigate('Licitante');
      }
    } else {
      Alert.alert('Erro', 'Por favor, insira uma chave pública válida');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conectar Carteira</Text>
      <TouchableOpacity style={styles.button} onPress={handleConnectWallet}>
        <View style={styles.gradient}>
          <Text style={styles.buttonText}>Conectar com WalletConnect</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.orText}>ou</Text>
      <TextInput
        style={styles.input}
        placeholder="Chave Pública"
        placeholderTextColor="#666"
        value={publicKey}
        onChangeText={setPublicKey}
      />
      <TouchableOpacity style={styles.button} onPress={handleManualConnect}>
        <View style={styles.gradient}>
          <Text style={styles.buttonText}>Conectar Manualmente</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradient: {
    backgroundColor: '#03DAC6',
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
  orText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#FFF',
    marginBottom: 20,
  },
});

export default TelaCarteira;