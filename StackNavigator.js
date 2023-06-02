import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from './screens/Home/Home';
import Login from './screens/Login/Login';
import Event from './screens/Event';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="Event" component={Event}/>

            </Stack.Group>
        </Stack.Navigator>
    );
}

export default StackNavigator;