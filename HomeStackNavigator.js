import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from './screens/Home/Home';
import Event from './screens/Event';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
                <Stack.Screen name="HomeScreen" component={Home}/>
                <Stack.Screen name="Event" component={Event}/>

            </Stack.Group>
        </Stack.Navigator>
    );
}

export default HomeStackNavigator;