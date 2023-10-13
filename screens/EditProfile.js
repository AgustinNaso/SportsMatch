import { useForm, Controller } from "react-hook-form";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { COLORS, FONTS } from "../constants";
import { TextInput } from "react-native-gesture-handler";
import { validateEmail } from "../utils/validations";
import { useNavigation } from "@react-navigation/native";
import Pill from "../components/Pill";
import { SPORT } from "../constants/data";
import { fetchUser } from "../services/eventService";
import { getCurrentUserData } from "../services/authService";
import MultiSelect from "react-native-multiple-select";

const sports = [
  { key: 1, sportId: 1, sport: SPORT[0] },
  { key: 2, sportId: 2, sport: SPORT[1] },
  { key: 3, sportId: 3, sport: SPORT[2] },
  { key: 4, sportId: 4, sport: SPORT[3] },
  { key: 5, sportId: 5, sport: SPORT[4] },
];

// {"count": 0, "email": "brlin@itba.edu.ar", "firstname": "brit", "lastname": "lin", "locations": [null], "phone_number": "+541130220578", "rating": 0, "sports": [null], "user_id": 5}

const EditProfile = () => {
  const navigator = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const phone = "30220578";
  const [selectedSports, setSelectedSports] = useState([]);
  const [currUser, setCurrUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currUser) setLoading(false);
  }, [currUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = await getCurrentUserData();
      [];
      const user = await fetchUser(currentUser.email);
      console.log(
        "USER: " + JSON.stringify({ ...user, birthdate: currentUser.birthdate })
      );
      setCurrUser({ ...user, birthdate: currentUser.birthdate });
    };
    try {
      fetchUserData();
    } catch (err) {
      console.error("ERROR fetching user data", err);
    }
  }, []);

  const handleSportsSelect = (sport) => {
    if (selectedSports.includes(sport.sportId)) {
      setSelectedSports(
        selectedSports.filter((item) => item !== sport.sportId)
      );
    } else {
      setSelectedSports([...selectedSports, sport.sportId]);
    }
  };

  const isSelected = (sport) => {
    return selectedSports.includes(sport.sportId) ? sport.sport : null;
  };

  const submit = (data) => {
    const formData = {
      ...data,
      sports: selectedSports,
    };

    console.log(formData);
    // navigator.navigate("MyProfile");
    //TODO: change user data
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {!loading && (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>Name</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                defaultValue={currUser.firstname}
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
                defaultValue={currUser.lastname}
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
                defaultValue={currUser.email}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    editable={false}
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
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>My Sports</Text>
              <View style={styles.sportsContainer}>
                {sports.map((sport, index) => {
                  return (
                    <Controller
                      key={index}
                      control={control}
                      render={() => (
                        <Pill
                          customStyle={styles.pillStyle}
                          props={sport}
                          handlePress={() => handleSportsSelect(sport)}
                          currentFilter={isSelected(sport)}
                        />
                      )}
                      name={`sports[${index}]`}
                      defaultValue={false}
                    />
                  );
                })}
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>My Locations</Text>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ScrollView
                    horizontal={true}
                    scrollEnabled={false}
                    contentContainerStyle={styles.nestedScroll}
                  >
                    <MultiSelect
                      styleMainWrapper={styles.mainWrapper}
                      items={[
                        { id: "1", name: "Belgrano" },
                        { id: "2", name: "Caballito" },
                        { id: "3", name: "Nuñez" },
                      ]}
                      uniqueKey="id"
                      onSelectedItemsChange={(selectedItems) =>
                        onChange(selectedItems)
                      }
                      selectedItems={value}
                      selectText="Select locations"
                      searchInputPlaceholderText="Search locations..."
                      onChangeInput={(text) => console.log(text)}
                      tagRemoveIconColor={COLORS.primary}
                      tagBorderColor={COLORS.primary}
                      tagTextColor={COLORS.primary}
                      selectedItemTextColor={COLORS.primary}
                      selectedItemIconColor={COLORS.primary}
                      itemTextColor="#000"
                      displayKey="name"
                      submitButtonColor={COLORS.primary}
                      submitButtonText="Done"
                    />
                  </ScrollView>
                )}
                name="selectedSports"
                defaultValue={[]}
              />
            </View>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSubmit(submit)}
            >
              <Text style={{ ...FONTS.h3, color: COLORS.white }}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
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

    code: {
      color: COLORS.primary,
      fontSize: 18,
      marginLeft: 10,
    },
    input: {
      width: "85%",
    },
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 7,
  },
  pillStyle: {
    padding: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",

    selectedPill: {
      backgroundColor: COLORS.primary,
    },
  },
  nestedScroll: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  mainWrapper: {
    width: "100%",
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
