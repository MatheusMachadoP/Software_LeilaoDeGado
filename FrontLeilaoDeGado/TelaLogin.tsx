import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import api from './api/api';
import axios from 'axios';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const TelaLogin: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      console.log('Tentando login com:', email);

      const response = await api.post('/login', { email, senha });

      console.log('Resposta da API:', response.data);

      if (response.status === 200) {
        const { token, tipo_usuario } = response.data;

        // Armazena o token JWT (você pode usar AsyncStorage ou outro método)
        // AsyncStorage.setItem('token', token);

        // Redireciona o usuário com base no tipo de usuário
        if (tipo_usuario === 'Leiloeiro') {
          navigation.navigate('Carteira', { address: 'endereco_da_carteira', userType: 'Leiloeiro', userId: 'yourUserId' });
        } else if (tipo_usuario === 'Licitante') {
          navigation.navigate('Carteira', { address: 'endereco_da_carteira', userType: 'Licitante', userId: 'yourUserId' });
        } else {
          Alert.alert('Tipo de usuário desconhecido');
        }
      }
    } catch (error: unknown) {
      console.error('Erro ao fazer login:', error);

      if (axios.isAxiosError(error) && error.response) {
        console.log('Status do erro:', error.response.status);
        console.log('Dados do erro:', error.response.data);

        if (error.response.status === 404) {
          Alert.alert('Erro', 'Usuário não encontrado');
        } else if (error.response.status === 401) {
          Alert.alert('Erro', 'Senha incorreta');
        } else {
          Alert.alert('Erro', 'Não foi possível fazer login');
        }
      } else {
        Alert.alert('Erro', 'Erro de conexão com o servidor');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.mainLogo} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#666"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
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