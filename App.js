import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './TabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark"/>
      <TabNavigator/>
    </NavigationContainer>
  );
}

