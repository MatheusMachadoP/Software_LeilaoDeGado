import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; // Ajustar o caminho conforme necessário

type TelaInicial2NavigationProp = StackNavigationProp<RootStackParamList, 'TelaInicial'>;
type TelaInicial2RouteProp = RouteProp<RootStackParamList, 'TelaInicial'>;

type Props = {
  navigation: TelaInicial2NavigationProp;
  route: TelaInicial2RouteProp;
};

const TelaInicial2: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.mainLogo} />
      <View style={styles.textHighlightContainer}>
        <Text style={styles.boldText}>Crie </Text>
        <Text style={styles.normalText}>ou</Text>
        <Text style={styles.boldText}> Participe </Text>
        <Text style={styles.normalText}>de leilões usando blockchain</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.buttonText}>Cadastrar-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  button1: {
    backgroundColor: '#03DAC6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '60%',
    marginBottom: 10,
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#BB86FC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
  mainLogo: {
    width: '60%',
    height: undefined,
    aspectRatio: 1.3,
    resizeMode: 'contain',
    marginBottom: 120,
  },
  normalText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },
  boldText: {
    color: '#BB86FC',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textHighlightContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 170,
  },
});

export default TelaInicial2;
