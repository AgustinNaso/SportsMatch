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
            <Text style={styles.inputText}>Nombre</Text>
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
            <Text style={styles.error}>Este campo no puede estar vacío</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Apellido</Text>
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
            <Text style={styles.error}>Este campo no puede estar vacío</Text>
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
            <Text style={styles.error}>Por favor ingrese un email válido</Text>
          )}
          {emailConflict && (
            <Text style={styles.error}>Este email ya fue registrado</Text>
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
            <Text style={styles.inputText}>Número de teléfono</Text>
            <View style={styles.phoneContainer}>
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
                    autoFocus
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
          </View>
          {errors.phoneNumber && (
            <Text style={styles.error}>Por favor ingrese un número de teléfono válido</Text>
          )}
          {phoneConflict && (
            <Text style={styles.error}>
              Este número de teléfono ya fue registrado
            </Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Contraseña</Text>
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
            <Text style={styles.error}>Por favor ingrese una contraseña válida</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Confirmar contraseña</Text>
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
            <Text style={styles.error}>Contraseñas no coinciden</Text>
          )}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleSubmit(submit)}
          >
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>Registrar</Text>
          </TouchableOpacity>
          {signUpError && (
            <Text style={styles.error}>
              Hubo un error, por favor intente otra vez
            </Text>
          )}
          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.referal}>Ya estás registrado? Inicia sesión</Text>
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
