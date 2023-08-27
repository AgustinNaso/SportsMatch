import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Profile";
import MyEvents from "../screens/MyEvents";

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen
          
          name="MyProfile"
          component={Profile}
        />

        {/* TODO: britu */}
        {/* <Stack.Screen name="EditProfile" component={EditProfile}/> */}
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
