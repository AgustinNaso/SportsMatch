import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { COLORS, FONTS } from "../constants";
import { TextInput } from "react-native-gesture-handler";
import { validateEmail, isEmpty, matching } from "../utils/validations";

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
  },
  inputText: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginLeft: 10,
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
  error: {
    ...FONTS.body3,
    color: "#F00",
    fontWeight: "700",
  },
});

const Register = ({ navigation }) => {
  const [name, onChangeName] = React.useState("");
  const [lastName, onChangeLastName] = React.useState("");
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [confPassword, onChangeConfPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [lastNameError, setLastNameError] = React.useState(false);
  const [nonMatchError, setNonMatchError] = React.useState(false);
  const [error, setError] = React.useState(false);

  const onSignUpPressed = async () => {
    setEmailError(false);
    setNameError(false);
    setLastNameError(false);
    setNonMatchError(false);
    setError(false);
    var errors = false;

    if (!validateEmail(email)) {
      setEmailError(true);
      errors = true;
    }

    if (isEmpty(name)) {
      setNameError(true);
      errors = true;
    }

    if (isEmpty(lastName)) {
      setLastNameError(true);
      errors = true;
    }

    if (!matching(password, confPassword)) {
      setNonMatchError(true);
      errors = true;
    }

    if (errors) {
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
          fontSize: 34,
          color: COLORS.primary,
          paddingTop: 50,
        }}
      >
        SportsMatch
      </Text>
      {error && (
        <Text style={styles.error}>This email has already been registered</Text>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeName}
          value={name}
        />
      </View>
      {nameError && (
        <Text style={styles.error}>This field can't be empty</Text>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Last Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeLastName}
          value={lastName}
        />
      </View>
      {lastNameError && (
        <Text style={styles.error}>This field can't be empty</Text>
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
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Confirm password</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeConfPassword}
          value={confPassword}
          secureTextEntry={true}
        />
      </View>
      {nonMatchError && (
        <Text style={styles.error}>Passwords do not match</Text>
      )}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={onSignUpPressed}
        loading={loading}
      >
        <Text style={{ ...FONTS.h3, color: COLORS.white }}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 10 }}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.referal}>Already have an account? Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Register;