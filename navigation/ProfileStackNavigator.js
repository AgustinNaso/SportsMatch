import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Profile";
import EditProfile from "../screens/EditProfile";
import { COLORS } from "../constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const routeName = navigation.getState().routes[2].state.index === 1 ? 'Edit Profile' : 'MyProfile';
      console.log(routeName);

      if (routeName === 'Edit Profile') {
        navigation.setOptions({
          headerTitle: 'Editar perfil',
        });
      } else {
        navigation.setOptions({
          headerTitle: 'Perfil',
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, statusBarColor: COLORS.primary }}>
      <Stack.Group>
        <Stack.Screen name="MyProfile" component={Profile} />
        <Stack.Screen name="Edit Profile" component={EditProfile} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
