import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from '../screens/Home';
import Event from '../screens/Event';
import { Text } from 'react-native';
const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}>
            <Stack.Group>
                <Stack.Screen
                    options={{
                        headerRight: () => <Text style={{color: 'red'}}>+</Text>}}
                name="HomeScreen" component={Home}/>
                <Stack.Screen name="Event" component={Event} />
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default HomeStackNavigator;