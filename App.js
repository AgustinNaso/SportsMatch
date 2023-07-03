import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import Tabs from "./navigation/Tabs";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import Login from "./screens/Login";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={"AuthLoadingScreen"}
      >
        <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} />
        <Stack.Screen name="Tabs"              component={Tabs} />
        <Stack.Screen name="Login"             component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
