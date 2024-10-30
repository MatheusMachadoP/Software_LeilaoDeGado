import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

type CarteiraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Carteira'>;
type CarteiraScreenRouteProp = RouteProp<RootStackParamList, 'Carteira'>;

type Props = {
  navigation: CarteiraScreenNavigationProp;
  route: CarteiraScreenRouteProp;
};

const TelaCarteira: React.FC<Props> = ({ route, navigation }) => {
  const { address, userType } = route.params;
  const { provider } = useWalletConnectModal();

  // Verifica o tipo de usuário ao carregar a tela
  useEffect(() => {
    if (!userType) {
      Alert.alert("Erro", "Tipo de usuário não definido.");
      navigation.navigate('BoasVindas');
    } else {
      console.log("Tipo de usuário recebido:", userType); // Log para verificar o valor de userType
    }
  }, [userType]);

  // Função de desconexão com confirmação
  const handleDisconnect = async () => {
    if (provider) {
      await provider.disconnect();
      console.log("Desconectado da carteira anterior."); // Log para confirmar desconexão
      navigation.navigate('BoasVindas');
    } else {
      Alert.alert("Erro", "Nenhum provedor conectado.");
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
        <Text style={styles.cardSubtitle}><Text style={styles.boldText}>Chave Pública:</Text> {address}</Text>
        <Text style={styles.cardSubtitle}><Text style={styles.boldText}>Nome:</Text> Matheus Machado</Text>
        <Text style={styles.connectedText}>Conectado</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={navigateToUserScreen}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
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
