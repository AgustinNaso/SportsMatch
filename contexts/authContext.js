// authContext.js
import React, { useMemo, useReducer } from "react";
import { login, register } from "../services/authService";

export const AuthContext = React.createContext();

export const useAuthContext = () => {
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
          console.log("Sign out action triggered");
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        case 'SIGN_UP':
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

  const signIn = async data => {
    const res = await login(data);
    console.log("Res", res);
    dispatch({ type: 'SIGN_IN', token: res.accessToken });
  };

  const signOut = () => dispatch({ type: 'SIGN_OUT' });

  const signUp = data => {
    const res = register(data);
    console.log("RESPONSE: ",res);
    dispatch({ type: 'REGISTER', token: res.accessToken });
  }

  const restoreToken = token => dispatch({ type: 'RESTORE_TOKEN', token });

  return useMemo(() => ({
    signIn,
    signOut,
    signUp,
    restoreToken,
    state,
    dispatch
  }), [state]);
};
