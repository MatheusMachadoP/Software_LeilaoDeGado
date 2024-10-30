import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from './api/api';
import { RootStackParamList } from './App';

type CadastroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cadastro'>;

const TelaCadastro: React.FC = () => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'Leiloeiro' | 'Licitante'>(); // Novo estado para o tipo de usuário
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation<CadastroScreenNavigationProp>();

  const validateFields = () => {
    let valid = true;
    let errors: { [key: string]: string } = {};

    if (!nomeCompleto) {
      errors.nomeCompleto = 'Nome completo é obrigatório';
      valid = false;
    }
    if (!email) {
      errors.email = 'Email é obrigatório';
      valid = false;
    }
    if (!telefone) {
      errors.telefone = 'Telefone é obrigatório';
      valid = false;
    }
    if (!cpf) {
      errors.cpf = 'CPF é obrigatório';
      valid = false;
    }
    if (!senha) {
      errors.senha = 'Senha é obrigatória';
      valid = false;
    }
    if (senha !== confirmarSenha) {
      errors.confirmarSenha = 'As senhas não coincidem';
      valid = false;
    }
    if (!tipoUsuario) {
      errors.tipoUsuario = 'Escolha o tipo de usuário';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await api.post('/usuarios/create', {
        nome_completo: nomeCompleto,
        email: email.toLowerCase(),
        telefone: telefone,
        cpf: cpf,
        senha: senha,
        tipo_usuario: tipoUsuario, // Enviar o tipo de usuário
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
        <Image source={require('./assets/logo.png')} style={styles.logo} />
        
        {/* Input de Nome Completo */}
        <TextInput
          placeholder="Nome completo"
          placeholderTextColor="#888"
          style={[styles.input, errors.nomeCompleto ? styles.inputError : null]}
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
        />
        {errors.nomeCompleto && <Text style={styles.errorText}>{errors.nomeCompleto}</Text>}

        {/* Input de Email */}
        <TextInput
          placeholder="Endereço de email"
          placeholderTextColor="#888"
          style={[styles.input, errors.email ? styles.inputError : null]}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Input de Telefone */}
        <TextInput
          placeholder="Telefone Celular"
          placeholderTextColor="#888"
          style={[styles.input, errors.telefone ? styles.inputError : null]}
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
        {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}

        {/* Input de CPF */}
        <TextInput
          placeholder="CPF"
          placeholderTextColor="#888"
          style={[styles.input, errors.cpf ? styles.inputError : null]}
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
        />
        {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}

        {/* Input de Senha */}
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#888"
          style={[styles.input, errors.senha ? styles.inputError : null]}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}

        {/* Input de Confirmação de Senha */}
        <TextInput
          placeholder="Confirme sua senha"
          placeholderTextColor="#888"
          style={[styles.input, errors.confirmarSenha ? styles.inputError : null]}
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        {errors.confirmarSenha && <Text style={styles.errorText}>{errors.confirmarSenha}</Text>}

        {/* Seleção do Tipo de Usuário */}
        <View style={styles.tipoContainer}>
          <Text style={styles.label}>Deseja ser:  </Text>
          <TouchableOpacity
            style={[
              styles.tipoButton,
              tipoUsuario === 'Licitante' && styles.tipoButtonSelected,
            ]}
            onPress={() => setTipoUsuario('Licitante')}
          >
            <Text style={styles.tipoText}>Licitante</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tipoButton,
              tipoUsuario === 'Leiloeiro' && styles.tipoButtonSelected,
            ]}
            onPress={() => setTipoUsuario('Leiloeiro')}
          >
            <Text style={styles.tipoText}>Leiloeiro</Text>
          </TouchableOpacity>
        </View>
        {errors.tipoUsuario && <Text style={styles.errorText}>{errors.tipoUsuario}</Text>}

        {/* Botão de Registro */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {/* Link para a tela de Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta?</Text>
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
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: '100%',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
  checkboxIcon: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#BB86FC',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
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
  tipoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 18,
    width: '100%',
  },
  tipoButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#888',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tipoButtonSelected: {
    backgroundColor: '#03DAC6',
  },
  tipoText: {
    color: '#fff',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default TelaCadastro;