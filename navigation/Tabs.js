import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { COLORS } from "../constants";
import { MyEvents } from "../screens";
import { useNavigation } from "@react-navigation/native";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import { UserContext } from "../contexts/UserContext";
import { getCurrentUserData } from "../services/LocalStorageService";
const Tab = createBottomTabNavigator();

const Tabs = () => {
  const [currUser, setCurrUser] = useState();
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    getCurrentUserData().then((user) => {
      setCurrUser(user);
      setLoading(false);
    })
  }, []);



  return (
    loading ? null :
    <UserContext.Provider value={{currUser, setCurrUser}}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "HomeNavigator") {
            iconName = "home";
          } else if (route.name === "Perfil") {
            iconName = "person";
          } else if (route.name === "Mis Eventos") {
            iconName = "calendar";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          title: "Inicio",
        }}
        name="HomeNavigator"
        component={HomeStackNavigator}
      />
      <Tab.Screen name="Mis Eventos" component={MyEvents} options={{
         headerTintColor: COLORS.white, headerStyle: {backgroundColor: COLORS.primary }
      }} />
      <Tab.Screen
        options={{
          headerShown: false
        }}
        name="Perfil"
        component={ProfileStackNavigator}
      />
    </Tab.Navigator>
    </UserContext.Provider>
  );
};
export default Tabs;
