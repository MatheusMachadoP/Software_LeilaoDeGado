import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

const TelaGerenciarLeilao: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); // Usando o hook useNavigation

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Leilões</Text>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('CriarLeilao')}>
          <Text style={styles.menuButtonText}>Criar Leilão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('DetalhesLeilao', { leilaoId: 'leilaoId' })}>
          <Text style={styles.menuButtonText}>Meus Leilões</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
  },
  menuButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default TelaGerenciarLeilao;
