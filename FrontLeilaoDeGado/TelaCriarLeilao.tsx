import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from './api/api';
import { RootStackParamList } from './App';
import { format } from 'date-fns';

type CriarLeilaoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CriarLeilao'>;

const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
};

const TelaCriarLeilao: React.FC = () => {
  const [nomeAtivo, setNomeAtivo] = useState('');
  const [raca, setRaca] = useState('');
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [valorInicial, setValorInicial] = useState('');
  const [duracao, setDuracao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation<CriarLeilaoScreenNavigationProp>();

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDataInicio(selectedDate);
    }
  };

  const validateFields = () => {
    let valid = true;
    let errors: { [key: string]: string } = {};

    if (!nomeAtivo) {
      errors.nomeAtivo = 'Nome do ativo é obrigatório';
      valid = false;
    }
    if (!raca) {
      errors.raca = 'Raça é obrigatória';
      valid = false;
    }
    if (!dataInicio) {
      errors.dataInicio = 'Data de início é obrigatória';
      valid = false;
    }
    if (!valorInicial) {
      errors.valorInicial = 'Valor inicial é obrigatório';
      valid = false;
    }
    if (!duracao) {
      errors.duracao = 'Duração é obrigatória';
      valid = false;
    }
    if (!descricao) {
      errors.descricao = 'Descrição é obrigatória';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Função para formatar a data em formato ISO 8601
const formatDate = (date: Date) => {
  return date.toISOString();
};

const handleCriarLeilao = async () => {
  if (!validateFields()) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append('nome_ativo', nomeAtivo);
    formData.append('raca', raca);

    // Verifica se a data foi selecionada e converte para ISO 8601
    const formattedDataInicio = dataInicio ? formatDate(dataInicio) : '';
    formData.append('data_inicio', formattedDataInicio);

    formData.append('valor_inicial', valorInicial);
    formData.append('duracao', duracao);
    formData.append('descricao', descricao);

    if (image) {
      formData.append('foto', {
        uri: image,
        name: 'leilao.jpg',
        type: 'image/jpeg',
      } as any);
    }

    console.log('FormData being sent:', formData);

    const response = await api.post('/leiloes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Leilão criado:', response.data);
    Alert.alert('Sucesso', 'Leilão criado com sucesso!');
    navigation.navigate('GerenciarLeilao');
  } catch (error) {
    console.error('Erro ao criar leilão:', error);
    Alert.alert('Erro', 'Não foi possível criar o leilão');
  }
};

  
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TextInput
          placeholder="Nome do Ativo"
          placeholderTextColor="#888"
          style={[styles.input, errors.nomeAtivo ? styles.inputError : null]}
          value={nomeAtivo}
          onChangeText={setNomeAtivo}
        />
        {errors.nomeAtivo && <Text style={styles.errorText}>{errors.nomeAtivo}</Text>}

        <TextInput
          placeholder="Raça"
          placeholderTextColor="#888"
          style={[styles.input, errors.raca ? styles.inputError : null]}
          value={raca}
          onChangeText={setRaca}
        />
        {errors.raca && <Text style={styles.errorText}>{errors.raca}</Text>}

        <TouchableOpacity style={styles.buttondata} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>
            {dataInicio ? dataInicio.toLocaleDateString() : 'Escolha a Data de Início'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dataInicio || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        {errors.dataInicio && <Text style={styles.errorText}>{errors.dataInicio}</Text>}

        <TextInput
          placeholder="Valor Inicial"
          placeholderTextColor="#888"
          style={[styles.input, errors.valorInicial ? styles.inputError : null]}
          value={valorInicial}
          onChangeText={setValorInicial}
          keyboardType="numeric"
        />
        {errors.valorInicial && <Text style={styles.errorText}>{errors.valorInicial}</Text>}

        <TextInput
          placeholder="Duração (em horas)"
          placeholderTextColor="#888"
          style={[styles.input, errors.duracao ? styles.inputError : null]}
          value={duracao}
          onChangeText={setDuracao}
          keyboardType="numeric"
        />
        {errors.duracao && <Text style={styles.errorText}>{errors.duracao}</Text>}

        <TextInput
          placeholder="Descrição"
          placeholderTextColor="#888"
          style={[styles.input, errors.descricao ? styles.inputError : null]}
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />
        {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}

        <TouchableOpacity style={styles.buttonIMG} onPress={pickImage}>
          <Text style={styles.buttonText}>Escolher Imagem</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.image} />}

        <TouchableOpacity style={styles.button} onPress={handleCriarLeilao}>
          <Text style={styles.buttonText}>Criar Leilão</Text>
        </TouchableOpacity>
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
  button: {
    backgroundColor: '#BB86FC',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  buttondata: {
    backgroundColor: '#34361b',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
    alignItems: 'center',
    width: '80%',
  },
  buttonIMG: {
    backgroundColor: '#2e0206',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
    alignItems: 'center',
    width: '58%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default TelaCriarLeilao;
