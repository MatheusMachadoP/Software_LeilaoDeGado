import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaInicial1 from './TelaInicial1';
import TelaLogin from './TelaLogin';
import TelaCadastro from './TelaCadastro';
import TelaBoasVindas from './TelaBoasVindas'; 
import TelaCarteira from './TelaCarteira';
import TelaEscolha from './TelaEscolha';
import TelaLeiloeiro from './TelaLeiloeiro';
import TelaLicitante from './TelaLicitante';
import TelaCriarLeilao from './TelaCriarLeilao';
import TelaGerenciarLeilao from './TelaGerenciarLeilao';
import TelaMeusLeiloes from './TelaMeusLeiloes';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  BoasVindas: undefined;
  Carteira: { address: string }; 
  Escolha: undefined;
  Leiloeiro: undefined;
  Licitante: undefined;
  CriarLeilao: undefined;
  GerenciarLeilao: { leilaoId?: string };
  MeusLeiloes: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
            borderBottomWidth: 0,
            shadowColor: 'transparent',
          },
          headerTintColor: '#BB86FC',
          headerBackTitleVisible: false,
          headerTitle: '',
        }}
      >
        <Stack.Screen
          name="Home"
          component={TelaInicial1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={TelaLogin}
        />
        <Stack.Screen
          name="Cadastro"
          component={TelaCadastro}
        />
        <Stack.Screen
          name="BoasVindas"
          component={TelaBoasVindas} 
        />
        <Stack.Screen
          name="Carteira"
          component={TelaCarteira} 
        />
        <Stack.Screen
          name="Escolha"
          component={TelaEscolha} 
        />
        <Stack.Screen
          name="Leiloeiro"
          component={TelaLeiloeiro}
        />
        <Stack.Screen
          name="Licitante"
          component={TelaLicitante}
        />
        <Stack.Screen
          name="CriarLeilao"
          component={TelaCriarLeilao}
        />
        <Stack.Screen
          name="GerenciarLeilao"
          component={TelaGerenciarLeilao}
        />
        <Stack.Screen
          name="MeusLeiloes"
          component={TelaMeusLeiloes}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;