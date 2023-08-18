import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { NewEvent, Home, Event } from '../screens';
import { View } from 'react-native';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
    const navigator = useNavigation();
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: true}} >
            <Stack.Group>
                <Stack.Screen
                    options={{
                        headerRight: () => {
                            return (
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name='options' style={{ marginRight: 10, marginTop: 1 }} size={24} color={COLORS.primary} onPress={() => console.log("Open Filter")} />
                                    <Ionicons name='add' style={{  }} size={30} color={COLORS.primary} onPress={() => navigator.navigate("Nuevo Evento")} />
                                </View>
                            )
                        }
                    }}
                    name="Inicio" component={Home} />
                <Stack.Screen name="Evento" component={Event} />
                <Stack.Screen name="Nuevo Evento" component={NewEvent} />
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default HomeStackNavigator;