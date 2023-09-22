import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import Tabs from "./navigation/Tabs";
import { Login, Register, ConfirmSignUp } from "./screens";
import { useEffect } from "react";
import { getCurrentUserData } from "./services/authService";
import { useAuthContext, AuthContext } from "./contexts/authContext";

const Stack = createStackNavigator();

const App = () => {

  const authContext = useAuthContext();

  useEffect(() => {
    const restoreUserToken = async () => {
      let userToken;
      try {
        userToken = await getCurrentUserData();
      }
      catch (err) {
        console.error('Failed: ', err);
      }
      authContext.restoreToken(userToken);
    }
    restoreUserToken();
  }, []);

  const [loaded] = useFonts({
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}>
          {authContext.state.userToken ? (
            <Stack.Screen name="Tabs" component={Tabs} />
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUp} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
