import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { COLORS, FONTS } from "../constants";
import { validateEmail } from "../utils/validations";
import { AuthContext } from "../contexts/authContext";
import { useNavigation } from "@react-navigation/native";


const Login = () => {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext)
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authContext.signIn(data)
    } 
    catch (err) {
      setLoading(false);
      console.error('Error signing in', err);
    }
  }

  return (
    <SafeAreaView
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100,
      }}
    >
      {loading ? <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ alignSelf: "center", marginTop: "50%" }}
      /> : <>
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
              validate: {
                matchPattern: v => validateEmail(v),
              }
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
      </>}
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
    gap: 5,
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
