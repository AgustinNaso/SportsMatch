import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import TabNavigator from './TabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator/>
      <StatusBar style="dark"/>
    </NavigationContainer>
  );
}

