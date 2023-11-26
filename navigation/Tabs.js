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
  const navigator = useNavigation();
  const [currUser, setCurrUser] = useState();
  const [visible, setVisible] = useState(false);
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUserData().then((user) => {
      console.log("USER", user);
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
          headerTintColor: COLORS.white, headerStyle: {backgroundColor: COLORS.primary },
          headerRight: () => {
            return (
              <Menu
                visible={visible}
                anchor={
                  <TouchableOpacity onPress={() => setVisible(!visible)}>
                    <Ionicons
                      name="menu"
                      style={{ marginRight: 10, marginTop: 1 }}
                      size={24}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                }
                onRequestClose={() => setVisible(!visible)}
              >
                <MenuItem
                  onPress={() => {
                    navigator.navigate("Edit Profile");
                    setVisible(!visible);
                  }}
                >
                  Editar perfil
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onPress={() => {
                    authContext.signOut();
                    setVisible(!visible);
                  }}
                >
                  Cerrar sesión
                </MenuItem>
              </Menu>
            );
          },
        }}
        name="Perfil"
        component={ProfileStackNavigator}
      />
    </Tab.Navigator>
    </UserContext.Provider>
  );
};
export default Tabs;
