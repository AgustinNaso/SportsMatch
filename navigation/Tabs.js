import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { COLORS } from "../constants";
import { MyEvents } from "../screens";
import { useNavigation } from "@react-navigation/native";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { TouchableOpacity } from "react-native";
import { StatusBar } from "react-native";
import React, { useState } from "react";
const Tab = createBottomTabNavigator();

const Tabs = () => {
  const navigator = useNavigation();
  const [visible, setVisible] = useState(false);

  return (
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
      <Tab.Screen name="Mis Eventos" component={MyEvents} />
      <Tab.Screen
        options={{
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
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                }
                onRequestClose={() => setVisible(!visible)}
              >
                <MenuItem
                  onPress={() => {
                    console.log("Edit Profile");
                    setVisible(!visible);
                  }}
                >
                  Edit Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem onPress={() => setVisible(!visible)}>Logout</MenuItem>
              </Menu>
            );
          },
        }}
        name="Perfil"
        component={ProfileStackNavigator}
      />
    </Tab.Navigator>
  );
};
export default Tabs;
