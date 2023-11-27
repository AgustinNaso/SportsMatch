import React, { useContext, useState } from "react";
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
import { PhoneNumberUtil } from "google-libphonenumber";
import CustomButton from "../components/CustomButton";

const Register = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const authContext = useContext(AuthContext);
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [signUpError, setSignUpError] = useState(false);
  const [phoneConflict, setPhoneConflict] = useState(false);
  const [emailConflict, setEmailConflict] = useState(false);

  const parsePhoneNumber = (phone) => {
    const parsedNumber = phoneUtil.parse(phone, "");
    const code = phoneUtil.getRegionCodeForNumber(parsedNumber);
    const national_number = phoneUtil
      .parseAndKeepRawInput(phone, code)
      .getNationalNumber();
    return {
      code: code,
      national_number: national_number.toString(),
    };
  };

  const validatePhone = (phone) => {
    const { code, national_number } = parsePhoneNumber(phone);
    return phoneUtil.isValidNumberForRegion(
      phoneUtil.parse(national_number, code),
      code
    );
  };

  const submit = async (data) => {
    setPhoneConflict(false);
    setEmailConflict(false);
    delete data.confPassword;

    const res = await authContext.signUp(data);
    if (res.ok) {
      navigation.navigate("Login");
    } else if (res.internalStatus === "CONFLICT") {
      res.message === "email" ? setEmailConflict(true) : setPhoneConflict(true);
    } else if (res.internalStatus === "VALIDATION_ERROR") {
      setSignUpError(true);
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
                  onChangeText={(text) =>
                    onChange(text.charAt(0).toUpperCase() + text.slice(1))
                  }
                  value={value}
                />
              )}
              name="firstName"
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
                  onChangeText={(text) =>
                    onChange(text.charAt(0).toUpperCase() + text.slice(1))
                  }
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
          {emailConflict && (
            <Text style={styles.error}>Email has already been taken</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Fecha de nacimiento</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="dd/mm/aaaa"
                />
              )}
              name="birthdate"
            />
          </View>
          {errors.birthdate && (
            <Text style={styles.error}>
              Por favor ingrese su fecha de nacimiento
            </Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Phone Number</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                  validate: (phone) => {
                    return validatePhone(phone);
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PhoneInput
                    defaultValue={""}
                    defaultCode="AR"
                    layout="first"
                    containerStyle={styles.phoneContainer}
                    textContainerStyle={styles.phoneContainer.input}
                    flagButtonStyle={styles.phoneContainer.flag}
                    onChangeFormattedText={(text) => {
                      onChange(text);
                    }}
                  />
                )}
                name="phoneNumber"
              />
            </View>
          {errors.phoneNumber && (
            <Text style={styles.error}>Please enter a valid phone number</Text>
          )}
          {phoneConflict && (
            <Text style={styles.error}>
              Phone number has already been taken
            </Text>
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
          <CustomButton title="Registrarse" onPress={handleSubmit(submit)} />
          {signUpError && (
            <Text style={styles.error}>
              There's been an error, please try again
            </Text>
          )}
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
    paddingHorizontal: 24,
    gap: 14
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 3,
    borderRadius: 20,
    borderColor: COLORS.primary,
    color: COLORS.primary,
    fontSize: 16
  },
  inputContainer: {
    alignSelf: 'stretch',
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
    borderWidth: 3,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.transparent,

    flag: {
      width: 55,
      marginLeft: 10
    },
    input: {
      backgroundColor: COLORS.transparent,
      paddingVertical: 9
     
    },
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
