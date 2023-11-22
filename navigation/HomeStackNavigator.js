import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NewEvent, Home, Event } from '../screens';
import { View } from 'react-native';
import FilterModal from '../screens/Filters';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
    const navigator = useNavigation();
    const [showFilters, setShowFilters] = React.useState(false);
    return (
        <Stack.Navigator
            screenOptions={{ headerTintColor: COLORS.white, headerShown: true, statusBarColor: COLORS.primary, headerStyle: {backgroundColor: COLORS.primary }}}>
            <Stack.Group>
                <Stack.Screen
                    options={{
                        headerRight: () => {
                            return (
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name='options' style={{ marginRight: 10, marginTop: 1 }} size={24} color={COLORS.white} onPress={() => {
                                        navigator.navigate("Filtros")
                                    }} />
                                    <Ionicons name='add' style={{}} size={30} color={COLORS.white} onPress={() => navigator.navigate("Nuevo Evento")} />
                                </View>
                            )
                        }
                    }}
                    name="Inicio" component={Home}/>
                <Stack.Screen name="Evento" component={Event} />
                <Stack.Screen name="Nuevo Evento" component={NewEvent}
                />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal', headerShown: false}}>
                <Stack.Screen name="Filtros" component={FilterModal}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default HomeStackNavigator;