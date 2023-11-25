import { useForm, Controller } from "react-hook-form";
import CustomButton from "../components/CustomButton";
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
import { getCurrentUserData } from "../services/LocalStorageService";
import MultiSelect from "react-native-multiple-select";
import {
  updateUser,
  updateUserImage,
  fetchUserImage,
} from "../services/userService";
import * as ImagePicker from "expo-image-picker";
import DefaultProfile from "../assets/default-profile.png";
import { Avatar } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import PhoneInput from "react-native-phone-number-input";
import { PhoneNumberUtil } from "google-libphonenumber";

const sports = [
  { key: 1, sportId: 1, title: SPORT[0] },
  { key: 2, sportId: 2, title: SPORT[1] },
  { key: 3, sportId: 3, title: SPORT[2] },
  { key: 4, sportId: 4, title: SPORT[3] },
  { key: 5, sportId: 5, title: SPORT[4] },
];

const EditProfile = () => {
  const navigator = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [selectedSports, setSelectedSports] = useState([]);
  const [currUser, setCurrUser] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [error, setError] = useState();
  const phoneUtil = PhoneNumberUtil.getInstance();
  const { showActionSheetWithOptions } = useActionSheet();

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

  const fetchImage = async () => {
    const response = await fetchUserImage(currUser.userid);
    if (response.status == 200) {
      setImage(response.imageURL);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currUser) {
      try {
        fetchImage();
      } catch (err) {
        console.error("ERROR fetching user image", err);
      }
    }
  }, [currUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = await getCurrentUserData();
      const user = await fetchUser(currentUser.email);
      const { code, national_number } = parsePhoneNumber(user.phonenumber);
      setCurrUser({
        ...user,
        birthdate: currentUser.birthdate,
        country_code: code,
        national_number: national_number,
      });
      user.sports.every((sport) => sport !== null) &&
        setSelectedSports(user.sports);
      user.locations.every((location) => location !== null) &&
        setSelectedLocations(user.locations);
    };
    try {
      fetchUserData();
    } catch (err) {
      console.error("ERROR fetching user data", err);
    }
  }, []);

  const validatePhone = (phone) => {
    const { code, national_number } = parsePhoneNumber(phone);
    return phoneUtil.isValidNumberForRegion(
      phoneUtil.parse(national_number, code),
      code
    );
  };

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
    return selectedSports.includes(sport.sportId) ? sport.title : null;
  };

  const dataChanged = (data) => {
    var phoneChanged = false;
    if (data.phone !== currUser.phonenumber) {
      phoneChanged = true;
    }

    var sportsChanged = false;
    if (currUser.sports[0] === null) {
      sportsChanged = selectedSports.size > 0;
    } else {
      sportsChanged = currUser.sports !== selectedSports;
    }

    var locChanged = false;
    if (currUser.locations[0] === null) {
      locChanged = selectedLocations.size > 0;
    } else {
      locChanged = currUser.locations !== selectedLocations;
    }

    return phoneChanged || sportsChanged || locChanged;
  }

  const submit = async (data) => {
    const formData = {
      phone_number: data.phone,
      locations: selectedLocations,
      sports: selectedSports,
    };
    
    var userUpdatedRes;
    if (dataChanged(data)) {
      userUpdatedRes = await updateUser(currUser.userid, formData);
    }

    if (userUpdatedRes && userUpdatedRes.status !== 200) {
      setError(userUpdatedRes.message);
    } else if (imageChanged) {
      const imgUpdatedRes = await updateUserImage(
        currUser.userid,
        selectedImage
      );
      if (imgUpdatedRes.status == 200) navigator.navigate("MyProfile");
      setError(imgUpdatedRes.message);
    } else {
      navigator.navigate("MyProfile");
    }
  };

  const editProfileImage = () => {
    const options = ["Elegir de la galeria", "Tomar foto", "Cancelar"];
    const libraryIndex = 0;
    const cameraIndex = 1;
    const cancelButtonIndex = 2;
    const title = "Selccionar foto";

    showActionSheetWithOptions(
      {
        options,
        title,
        libraryIndex,
        cameraIndex,
        cancelButtonIndex,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case libraryIndex:
            handleLibraryLaunch();
            break;
          case cameraIndex:
            handleCameraLaunch();
            break;
        }
      }
    );
  };

  const handleCameraLaunch = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setSelectedImage(result.assets[0].base64);
      setImageChanged(true);
    }
  };

  const handleLibraryLaunch = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setSelectedImage(result.assets[0].base64);
      setImageChanged(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {!loading && (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Avatar
              size={108}
              rounded
              source={image ? { uri: image } : DefaultProfile}
            >
              <TouchableOpacity onPress={editProfileImage}>
                <Ionicons
                  name="ios-camera"
                  size={25}
                  style={{
                    position: "absolute",
                    color: COLORS.primary,
                    bottom: 0,
                    right: 0,
                  }}
                />
              </TouchableOpacity>
            </Avatar>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>Nombre</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                defaultValue={currUser.firstname}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    editable={false}
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
              <Text style={styles.error}>Este campo no puede estar vacio</Text>
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>Apellido</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                defaultValue={currUser.lastname}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    editable={false}
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
              <Text style={styles.error}>Este campo no puede estar vacio</Text>
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
              <Text style={styles.error}>
                Por favor ingrese un email válido
              </Text>
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>Número de teléfono</Text>
              <Controller
                defaultValue={currUser.phonenumber}
                control={control}
                rules={{
                  required: true,
                  validate: (phone) => {
                    return validatePhone(phone);
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PhoneInput
                    defaultValue={currUser.national_number}
                    defaultCode={currUser.country_code}
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
            {errors.phone && (
              <Text style={styles.error}>
                Por favor ingrese un número válido.
              </Text>
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>Mis Deportes</Text>
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
              <Text style={styles.inputText}>Mis Ubicaciones</Text>
              <Controller
                control={control}
                render={({ field: { onChange } }) => (
                  <ScrollView
                    horizontal={true}
                    scrollEnabled={false}
                    contentContainerStyle={styles.nestedScroll}
                  >
                    <MultiSelect
                      styleMainWrapper={styles.mainWrapper}
                      items={[
                        { id: "Belgrano" },
                        { id: "Caballito" },
                        { id: "Nuñez" },
                      ]}
                      uniqueKey="id"
                      onSelectedItemsChange={(selectedItems) => {
                        setSelectedLocations(selectedItems);
                        onChange(selectedItems);
                      }}
                      selectedItems={selectedLocations}
                      selectText="Elija las ubicaciones"
                      searchInputPlaceholderText="Busque ubicaciones..."
                      onChangeInput={(text) => console.log(text)}
                      tagRemoveIconColor={COLORS.primary}
                      tagBorderColor={COLORS.primary}
                      tagTextColor={COLORS.primary}
                      selectedItemTextColor={COLORS.primary}
                      selectedItemIconColor={COLORS.primary}
                      itemTextColor="#000"
                      displayKey="id"
                      submitButtonColor={COLORS.primary}
                      submitButtonText="Confirmar"
                    />
                  </ScrollView>
                )}
                name="locations"
                defaultValue={[]}
              />
            </View>
            {error && (
              <Text style={{ color: "red", paddingTop: 15 }}>{error}</Text>
            )}
            <View style={{marginTop: 40}}>
            <CustomButton title="Guardar" onPress={handleSubmit(submit)}/>
            </View>
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
    paddingTop: 20,
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
