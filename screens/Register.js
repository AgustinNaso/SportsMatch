import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { COLORS, FONTS, SIZES } from "../constants";
import { TextInput } from "react-native-gesture-handler";
import { validateEmail, isEmpty, matching, validatePhoneNumber } from "../utils/validations";

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,   
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
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
    color: COLORS.primary,
    marginLeft: 10,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    code: {
      color: COLORS.primary,
      fontSize: 18,
      marginLeft: 10,
    },
    input: {
      width: "85%",
    }
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
  const [name, onChangeName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [phone, onChangePhone] = useState("");
  const [password, onChangePassword] = useState("");
  const [confPassword, onChangeConfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [nonMatchError, setNonMatchError] = useState(false);
  const [error, setError] = useState(false);

  const onSignUpPressed = () => {
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

    if (!validatePhoneNumber(phone)) {
      setPhoneError(true);
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
        flex: 1
      }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        <Text style={styles.inputText}>Phone Number</Text>
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneContainer.code}>11</Text>
          <TextInput
            style={[styles.input, styles.phoneContainer.input]}
            onChangeText={onChangePhone}
            value={phone}
          />
        </View>
      </View>
      {phoneError && <Text style={styles.error}>Phone number must have 8 digits</Text>}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;