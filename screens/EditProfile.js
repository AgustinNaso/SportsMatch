import { useForm, Controller } from "react-hook-form";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { COLORS, FONTS } from "../constants";
import { TextInput } from "react-native-gesture-handler";
import { validateEmail } from "../utils/validations";
import { useNavigation } from "@react-navigation/native";

const EditProfile = () => {
  const navigator = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const name = "John";
  const lastName = "Doe";
  const email = "johndoe@mail.com";
  const phone = "30220578";

  const submit = (data) => {
    console.log(data);
    navigator.navigate("MyProfile");
    //TODO: change user data
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Name</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              defaultValue={name}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
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
              defaultValue={lastName}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
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
              defaultValue={email}
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
              <Text style={styles.phoneContainer.code}>11</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                  length: 8,
                }}
                defaultValue={phone}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, styles.phoneContainer.input]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                  />
                )}
                name="phone"
              />
            </View>
          </View>
          {errors.phone && (
            <Text style={styles.error}>Phone number must have 8 digits</Text>
          )}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSubmit(submit)}
          >
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
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

    code: {
      color: COLORS.primary,
      fontSize: 18,
      marginLeft: 10,
    },
    input: {
      width: "85%",
    },
  },
  saveBtn: {
    margin: 10,
    backgroundColor: COLORS.primary,
    width: 150,
    alignItems: "center",
    borderRadius: 15,
    padding: 8,
    marginTop: 30,
  },
  error: {
    ...FONTS.body3,
    color: "#F00",
    fontWeight: "700",
  },
});

export default EditProfile;
