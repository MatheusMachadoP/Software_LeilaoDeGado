import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';

type EscolhaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Escolha'>;
type EscolhaScreenRouteProp = RouteProp<RootStackParamList, 'Escolha'>;

type Props = {
  navigation: EscolhaScreenNavigationProp;
  route: EscolhaScreenRouteProp;
};

const TelaEscolha: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.mainLogo} />
      <Text style={styles.title}>Escolha seu Perfil</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Carteira', { userType: 'Leiloeiro' })}>
          <Image source={require('./assets/leiloeiro.png')} style={styles.optionImage} />
          <Text style={styles.optionText}>Leiloeiro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Carteira', { userType: 'Licitante' })}>
          <Image source={require('./assets/licitante.png')} style={styles.optionImage} />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mainLogo: {
    width: '50%',
    height: undefined,
    aspectRatio: 1.3,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  option: {
    width: '45%',
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
  },
  optionImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default TelaEscolha;