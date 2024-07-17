import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; // Ajuste o caminho conforme necessário

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const TelaLogin: React.FC<Props> = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.mainLogo} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#666"
        secureTextEntry
      />
      <View style={styles.optionsContainer}>
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
          </TouchableOpacity>
          <Text style={styles.rememberMeText}>Lembrar-me</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BoasVindas')}>
        <View style={styles.gradient}>
          <Text style={styles.buttonText}>Entrar</Text> 
        </View>
      </TouchableOpacity>
      <View>
        <Text style={styles.normalText}>Não tem uma conta?</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.registerText}>Cadastrar-se</Text>
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
  mainLogo: {
    width: '50%',
    height: undefined,
    aspectRatio: 1.3,
    resizeMode: 'contain',
    marginBottom: 40,
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 35,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    color: '#03DAC6',
    marginLeft: 10,
  },
  forgotPasswordText: {
    color: '#03DAC6',
  },
  checkbox: {
    width: 20,
    height: 20,
    backgroundColor: '#222',
    borderColor: '#888',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#03DAC6',
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
  registerText: {
    color: '#BB86FC',
  },
  normalText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default TelaLogin;