import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const TelaLicitante: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela Licitante</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
});

export default TelaLicitante;
