import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Profile from './screens/Profile/Profile';
import MyEvents from './screens/MyEvents';

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
                <Stack.Screen name="Profile" component={Profile}/>
                <Stack.Screen name="MyEvents" component={MyEvents}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default ProfileStackNavigator;