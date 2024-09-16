import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

type EscolhaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Escolha'>; // Define o tipo de navegação para a tela Escolha

type Props = {
  navigation: EscolhaScreenNavigationProp; // Prop para navegação
};

const TelaEscolha: React.FC<Props> = ({ navigation }) => {
  // Retorno do JSX que define a interface do usuário para a tela de escolha
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem vindo!</Text>
      <Text style={styles.title}>Faça sua Escolha</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('GerenciarLeilao',{ leilaoId: 'some-id' })}>
          <Image source={require('./assets/leiloeiro.png')} style={styles.icon} />
          <Text style={styles.optionText}>Leiloeiro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Licitante')}>
          <Image source={require('./assets/licitante.png')} style={styles.icon} />
          <Text style={styles.optionText}>Licitante</Text>
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
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 190,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 40,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  option: {
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default TelaEscolha;
