import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TelaGerenciarLeilao: React.FC = () => {
  // Aqui você pode buscar e listar os leilões criados pelo leiloeiro
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Leilões</Text>
      {/* Listar os leilões aqui */}
      <Button title="Editar Leilão" onPress={() => { /* Ação de editar */ }} />
      <Button title="Excluir Leilão" onPress={() => { /* Ação de excluir */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
});

export default TelaGerenciarLeilao;
