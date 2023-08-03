import React, { useReducer, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import Tabs from "./navigation/Tabs";
import { Login, Register, ConfirmSignUp } from "./screens";
import { useEffect } from "react";
import { getCurrentUserData, login, signUp } from "./services/authService";

const Stack = createStackNavigator();

export const AuthContext = React.createContext();

const App = () => {
  //TODO: move this to other file?
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    getCurrentUserData().then((data) => {
      dispatch({ type: 'RESTORE_TOKEN', token: data.token })
    })
      .catch(err => console.error(err));
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        const res = await login(data)
        dispatch({ type: 'SIGN_IN', token: "token" })
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }), []
  );
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
          {state.userToken ? (
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
