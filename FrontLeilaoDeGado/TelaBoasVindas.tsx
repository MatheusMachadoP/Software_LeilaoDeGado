import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; 
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';

type BoasVindasScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BoasVindas'>;
type BoasVindasScreenRouteProp = RouteProp<RootStackParamList, 'BoasVindas'>;

type Props = {
  navigation: BoasVindasScreenNavigationProp;
  route: BoasVindasScreenRouteProp;
};

const projectId = '5cc5b504db9db120bdd21b5b4ee64d6e';

const providerMetadata = {
  name: 'YOUR_PROJECT_NAME',
  description: 'YOUR_PROJECT_DESCRIPTION',
  url: 'https://your-project-website.com/',
  icons: ['https://your-project-logo.com/'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

const TelaBoasVindas: React.FC<Props> = ({ navigation }) => {
  // Add in the useWalletConnectModal hook + props
  const { open, isConnected, address, provider } = useWalletConnectModal();

  // Function to handle the button press
  const handleButtonPress = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Olá! Bem vindo</Text>
      <Text style={styles.subtitleText}>Crie ou participe de leilões usando blockchain</Text>
      <View style={styles.bottomContainer}>
        <Pressable onPress={handleButtonPress} style={styles.button}>
          <Text style={styles.buttonText}>
            {isConnected ? 'Disconnect' : 'Adicione sua Carteira Cripto'}
          </Text>
        </Pressable>
        {isConnected && address && <Text style={styles.connectedText}>Conectado: {address}</Text>}
        <TouchableOpacity onPress={() => navigation.navigate('Escolha')}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>
      <WalletConnectModal
        explorerRecommendedWalletIds={['c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96']}
        explorerExcludedWalletIds={'ALL'}
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 180,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#03DAC6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
  skipText: {
    color: '#BB86FC',
    fontSize: 16,
    textAlign: 'center',
  },
  connectedText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default TelaBoasVindas;
