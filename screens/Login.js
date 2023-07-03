import React, { useState } from "react";
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

const Login = () => {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [error, setError] = useState(false);

  const navigation = useNavigation();

  const onLoginPressed = () => {
    setEmailError(false);
    setError(false);

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }
    navigation.navigate("Tabs");
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
      {error && (
        <Text style={styles.error}>
          Couldn't find your account
        </Text>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
        />
      </View>
      {emailError && <Text style={styles.error}>Please enter a valid email</Text>}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={onLoginPressed}
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

export default Login;
