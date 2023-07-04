import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import Tabs from "./navigation/Tabs";
import { AuthLoadingScreen, Login, Register, ConfirmSignUp } from "./screens";

const Stack = createStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={"AuthLoadingScreen"}
      >
        <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
