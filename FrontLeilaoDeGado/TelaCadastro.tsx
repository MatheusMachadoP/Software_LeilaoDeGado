import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from './api/api'; // Importando a configuração do Axios
import { RootStackParamList } from './App'; // Ajuste o caminho conforme necessário

type CadastroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cadastro'>;

const TelaCadastro: React.FC = () => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation<CadastroScreenNavigationProp>();

  const handleRegister = async () => {
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      const response = await api.post('/usuarios', {
        nome_completo: nomeCompleto,
        email: email,
        telefone: telefone,
        cpf: cpf,
        senha: senha,
        remember_me: rememberMe,
      });
      console.log('Usuário criado:', response.data);
      Alert.alert('Sucesso', 'Usuário criado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      Alert.alert('Erro', 'Não foi possível criar o usuário');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={require('./assets/logo.png')} // Substitua pelo caminho correto da imagem
          style={styles.logo}
        />
        <TextInput 
          placeholder="Nome completo" 
          placeholderTextColor="#888" 
          style={styles.input} 
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
        />
        <TextInput 
          placeholder="Endereço de email" 
          placeholderTextColor="#888" 
          style={styles.input} 
          keyboardType="email-address" 
          value={email}
          onChangeText={setEmail}
        />
        <TextInput 
          placeholder="Telefone Celular" 
          placeholderTextColor="#888" 
          style={styles.input} 
          keyboardType="phone-pad" 
          value={telefone}
          onChangeText={setTelefone}
        />
        <TextInput 
          placeholder="CPF" 
          placeholderTextColor="#888" 
          style={styles.input} 
          keyboardType="numeric" 
          value={cpf}
          onChangeText={setCpf}
        />
        <TextInput 
          placeholder="Senha" 
          placeholderTextColor="#888" 
          style={styles.input} 
          secureTextEntry 
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput 
          placeholder="Confirme sua senha" 
          placeholderTextColor="#888" 
          style={styles.input} 
          secureTextEntry 
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>Lembrar-me</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#000',
  },
  container: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center', // Centralizar itens no container
  },
  logo: {
    width: 100, // Ajuste a largura conforme necessário
    height: 100, // Ajuste a altura conforme necessário
    marginBottom: 30, // Espaçamento adicional abaixo da imagem
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 15, // Aumentar o padding para uma área de entrada maior
    marginVertical: 10, // Aumentar o espaçamento vertical entre os inputs
    borderRadius: 5,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20, // Aumentar o espaçamento vertical
  },
  checkbox: {
    width: 20,
    height: 20,
    backgroundColor: '#222',
    borderColor: '#888',
    borderWidth: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#03DAC6',
  },
  checkboxLabel: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#03DAC6',
    paddingVertical: 15, // Aumentar o padding vertical para um botão maior
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20, // Aumentar o espaçamento vertical
    alignItems: 'center',
    width: '100%', // Tornar o botão mais largo
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
  },
  loginLink: {
    color: '#BB86FC',
    textAlign: 'center',
  },
});

export default TelaCadastro;
