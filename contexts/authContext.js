// authContext.js
import React, { useMemo, useReducer } from "react";
import { login } from "../services/authService";

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
    console.log("ADA");
    dispatch({ type: 'SIGN_IN', token: "token" });
  };

  const signOut = () => dispatch({ type: 'SIGN_OUT' });

  const restoreToken = token => dispatch({ type: 'RESTORE_TOKEN', token });

  return useMemo(() => ({
    signIn,
    signOut,
    restoreToken,
    state,
    dispatch
  }), [state]);
};
