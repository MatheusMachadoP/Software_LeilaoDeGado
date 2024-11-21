import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaInicial1 from './TelaInicial1';
import TelaEscolha from './TelaEscolha';
import TelaCarteira from './TelaCarteira';
import TelaLeiloeiro from './TelaLeiloeiro';
import TelaLicitante from './TelaLicitante';

export type RootStackParamList = {
  Home: undefined;
  Escolha: undefined;
  Carteira: { userType: 'Leiloeiro' | 'Licitante' };
  Leiloeiro: undefined;
  Licitante: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={TelaInicial1} options={{ headerShown: false }} />
        <Stack.Screen name="Escolha" component={TelaEscolha} />
        <Stack.Screen name="Carteira" component={TelaCarteira} />
        <Stack.Screen name="Leiloeiro" component={TelaLeiloeiro} />
        <Stack.Screen name="Licitante" component={TelaLicitante} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;