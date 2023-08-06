import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { NewEvent, Home, Event } from '../screens';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
    const navigator = useNavigation();
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: true }}>
            <Stack.Group>
                <Stack.Screen
                    options={{
                        headerRight: () => <Ionicons name='add' style={{ borderRadius: 50 }} size={30} color={COLORS.primary} onPress={() => navigator.navigate("Nuevo Evento")} />
                    }}
                    name="Inicio" component={Home} />
                <Stack.Screen name="Evento" component={Event} />
                <Stack.Screen name="Nuevo Evento" component={NewEvent}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default HomeStackNavigator;