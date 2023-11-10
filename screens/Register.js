import React, { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { COLORS, FONTS } from "../constants";
import { TextInput } from "react-native-gesture-handler";
import { getEmailValidator, validateEmail } from "../utils/validations";
import { AuthContext } from "../contexts/authContext";
import PhoneInput from "react-native-phone-number-input";

const Register = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const authContext = useContext(AuthContext);

  const submit = async (data) => {
    try {
      await authContext.signUp(data);
      navigation.navigate("ConfirmSignUp", { email: data.email });
    } catch (err) {
      console.error("Error signing up", err);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
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
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Name</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text.charAt(0).toUpperCase() + text.slice(1))}
                  value={value}
                />
              )}
              name="name"
            />
          </View>
          {errors.name && (
            <Text style={styles.error}>This field can't be empty</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Last Name</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text.charAt(0).toUpperCase() + text.slice(1))}
                  value={value}
                />
              )}
              name="lastName"
            />
          </View>
          {errors.lastName && (
            <Text style={styles.error}>This field can't be empty</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Email</Text>
            <Controller
              control={control}
              rules={{
                required: true,
                pattern: {
                  matchPattern: (mail) => validateEmail(mail),
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
            />
          </View>
          {errors.email && (
            <Text style={styles.error}>Please enter a valid email</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Phone Number</Text>
            <View style={styles.phoneContainer}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PhoneInput
                    defaultValue={""}
                    defaultCode="AR"
                    layout="first"
                    autoFocus
                    containerStyle={styles.phoneContainer}
                    textContainerStyle={styles.phoneContainer.input}
                    flagButtonStyle={styles.phoneContainer.flag}
                    onChangeFormattedText={(text) => {
                      onChange(text);
                    }}
                  />
                )}
                name="phone"
              />
            </View>
          </View>
          {errors.phone && (
            <Text style={styles.error}>Please enter a valid phone number</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Password</Text>
            <Controller
              control={control}
              rules={{
                required: true,
                minLength: 8,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={true}
                />
              )}
              name="password"
            />
          </View>
          {errors.password && (
            <Text style={styles.error}>Please enter a valid password</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Confirm password</Text>
            <Controller
              control={control}
              rules={{
                required: true,
                length: 8,
                validate: (value) => value === watch("password"),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={true}
                />
              )}
              name="confPassword"
            />
          </View>
          {errors.confPassword && (
            <Text style={styles.error}>Passwords do not match</Text>
          )}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleSubmit(submit)}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    gap: 5,
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
    width: "100%",
    borderRadius: 20,
    
    flag: {
      width: 55,
    },
    input: {
      borderRadius: 20,
      width: "90%",
    },
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

export default Register;
