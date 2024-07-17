import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; // Ajuste o caminho conforme necessário

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

const TelaInicial1: React.FC<Props> = ({ navigation }) => {
  return (
    <ImageBackground source={require('./assets/vaca.png')} style={styles.imageBackground}>
      <View style={styles.overlay}>
        <Image source={require('./assets/logo.png')} style={styles.mainLogo} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Leilões Seguros na Blockchain:</Text>
          <View style={styles.textHighlightContainer}>
            <Text style={styles.boldText}>Crie </Text>
            <Text style={styles.normalText}>ou</Text>
            <Text style={styles.boldText}> Participe </Text>
            <Text style={styles.normalText}>Agora!</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaInicial')}>
          <View style={styles.gradient}>
            <Text style={styles.buttonText}>Começar Agora</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor de fundo preta com opacidade para sobrepor a imagem
    width: '100%',
    paddingHorizontal: 20,
  },
  mainLogo: {
    width: '50%',
    height: undefined,
    aspectRatio: 1.3,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 90,
  },
  title: {
    color: '#BB86FC', // Cor do título
    fontSize: 20,
    textAlign: 'center',
  },
  textHighlightContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  normalText: {
    color: '#ffffff', // Cor do texto normal
    fontSize: 24,
    textAlign: 'center',
  },
  boldText: {
    color: '#BB86FC', // Cor do texto em negrito
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    bottom: 60,
    borderRadius: 5,
    overflow: 'hidden',
  },
  gradient: {
    backgroundColor: '#03DAC6', // Cor de fundo do botão
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000000', // Cor do texto do botão
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TelaInicial1;
