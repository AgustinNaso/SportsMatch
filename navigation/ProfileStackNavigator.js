import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Profile";
import EditProfile from "../screens/EditProfile";
import MyEvents from "../screens/MyEvents";

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="MyProfile" component={Profile} />
        <Stack.Screen name="Edit Profile" component={EditProfile} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
