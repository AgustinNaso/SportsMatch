import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS } from "../constants";
import { validateEmail } from "../utils/validations";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import UserPool, { saveUserData } from "../services/authService";

const Login = () => {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [error, setError] = useState(false);
  const navigation = useNavigation();

  const { control, handleSubmit, formState: { errors } } = useForm();



  const onSubmit = (data) => {
    console.log(data);
    const user = new CognitoUser({
      Username: data.email,
      Pool: UserPool
    })

    const authDetails = new AuthenticationDetails({
      Username: data.email,
      Password: data.password
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        saveUserData(data);
        navigation.navigate("Tabs");
      },
      onFailure: (err) => {
        console.error("On Failure: ", err);
      },
      newPasswordRequired: (data) => {
        console.log("newPasswordRequired: ", data);
      }
    })
  }

  const onLoginPressed = async () => {
    setEmailError(false);
    setError(false);

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    // const response = await signIn(email, password);
    navigation.navigate("Tabs");
    // if (response.error) {
    //   console.log("Error signing in: ", response.error);
    //   setError(true);
    // } else {
    // }
  };

  return (
    <SafeAreaView
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100,
      }}
    >
      <Text
        style={{
          ...FONTS.h1,
          fontSize: 40,
          color: COLORS.primary,
          paddingTop: 50,
        }}
      >
        SportsMatch
      </Text>
      {errors.email && <Text style={styles.error}>Incorrect email or password</Text>}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Email</Text>
        <Controller control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />)}
          name="email"
        />
      </View>
      {errors.email && (
        <Text style={styles.error}>Please enter a valid email</Text>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Password</Text>
        <Controller control={control}
          rules={{
            minLength: 8,
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
            />)}
          name="password"
        />
      </View>
      {errors.password && (
        <Text style={styles.error}>Please enter a valid password</Text>
      )}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={handleSubmit(onSubmit)}
        loading={loading}
      >
        <Text style={{ ...FONTS.h3, color: COLORS.white }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: 10 }}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.referal}>Don't have an account yet? Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 3,
    borderRadius: 20,
    borderColor: COLORS.primary,
    color: COLORS.primary,
  },
  inputContainer: {
    marginTop: 20,
    width: "65%",
    gap: "5em",
  },
  inputText: {
    ...FONTS.body3,
    marginLeft: 10,
    color: COLORS.primary,
  },
  error: {
    ...FONTS.body3,
    color: "#F00",
    fontWeight: "700",
  },
  loginBtn: {
    margin: 10,
    backgroundColor: COLORS.primary,
    width: 150,
    alignItems: "center",
    borderRadius: 15,
    padding: 8,
    marginTop: 30,
  },
  referal: {
    color: COLORS.primary,
    fontSize: 18,
  },
});

export default Login;
