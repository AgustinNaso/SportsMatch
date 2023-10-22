import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { COLORS } from "../constants";
import { Avatar, Chip, Divider } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { fetchUser } from "../services/eventService";
import { fetchUserImage } from "../services/userService";
import { SPORT } from "../constants/data";
import { getCurrentUserData } from "../services/authService";
import { useIsFocused } from "@react-navigation/native";

const image_url = "https://randomuser.me/api/portraits/men/36.jpg";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [currUser, setCurrUser] = useState();
  const [image, setImage] = useState(null);
  const isFocused = useIsFocused();

  const formatPhoneNumber = (phoneNumberString) => {
    if (!phoneNumberString) return;
    let formatted = phoneNumberString.replace(
      /(\d{2})(\d{2})(\d{4})/,
      "$1 $2 $3"
    );
    return formatted;
  };

  useEffect(() => {
    if (currUser) {
      setLoading(false);
      console.log("CURR USER: ", currUser);
      try {
        fetchImage();
      } catch (err) {
        console.error("ERROR fetching user image", err);
      }
    }
  }, [currUser]);

  const fetchUserData = async () => {
    const currentUser = await getCurrentUserData();
    const user = await fetchUser(currentUser.email);
    setCurrUser({ ...user, birthdate: currentUser.birthdate });
  };

  const fetchImage = async () => {
    const response = await fetchUserImage(currUser.user_id);
    if (response.status == 200) {
      setImage(response.imageURL);
    }
  };

  useEffect(() => {
    try {
      fetchUserData();
    } catch (err) {
      console.error("ERROR fetching user data", err);
    }
  }, [isFocused]);

  useEffect(() => {
    try {
      fetchUserData();
    } catch (err) {
      console.error("ERROR fetching user data", err);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!loading && (
        <ScrollView contentContainerStyle={styles.mainContainer}>
          <View style={styles.profileHeader}>
            <Avatar
              size={108}
              rounded
              source={{ uri: image ? image : image_url }}
            />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileTextName}>
                {currUser?.firstname} {currUser?.lastname}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginVertical: 5,
                }}
              >
                <Ionicons name="star" size={18} color={COLORS.secondary} />
                <Text style={styles.profileTextAge}>{currUser?.rating}</Text>
              </View>
              <Text style={styles.profileTextLocation}>
                {currUser?.count} partidos
              </Text>
            </View>
          </View>
          <View style={styles.profileBody}>
            <View style={styles.bodySectionContainer}>
              <Text style={styles.bodyText}>Mis Datos</Text>
              <Divider width={3} style={{ width: "100%", marginBottom: 16 }} />
              <View style={styles.userDataContainer}>
                <Image
                  source={require("../assets/pin-48-blue.png")}
                  style={{ width: 23, height: 23 }}
                />
                <View style={styles.userDataDisplay}>
                  <Text style={styles.itemText}>
                    {currUser?.locations[0] ?? "Argentina"}
                  </Text>
                </View>
              </View>
              <View style={styles.userDataContainer}>
                <Ionicons name="call" size={24} color={COLORS.primary} />
                <View style={styles.userDataDisplay}>
                  <Text style={styles.itemText}>{currUser?.phone_number}</Text>
                </View>
              </View>
              <View style={styles.userDataContainer}>
                <Ionicons name="calendar" size={24} color={COLORS.primary} />
                <View style={styles.userDataDisplay}>
                  <Text style={styles.itemText}>{currUser?.birthdate}</Text>
                </View>
              </View>
            </View>
            <View style={styles.bodySectionContainer}>
              <Text style={styles.bodyText}>Mis Deportes</Text>
              <Divider width={3} style={{ width: "100%", marginBottom: 16 }} />
              <View style={styles.chipContainer}>
                {currUser.sports &&
                currUser.sports.every((sport) => sport !== null) ? (
                  currUser.sports.map((sport, idx) => {
                    return (
                      <Chip
                        title={SPORT[sport - 1]}
                        key={idx}
                        color={COLORS.primary}
                      />
                    );
                  })
                ) : (
                  <Chip
                    title="No hay deportes registrados"
                    key={1}
                    color={COLORS.primary}
                  />
                )}
              </View>
            </View>
            <View style={styles.bodySectionContainer}>
              <Text style={styles.bodyText}>Mis Ubicaciones</Text>
              <Divider width={3} style={{ width: "100%", marginBottom: 16 }} />
              <View style={styles.chipContainer}>
                {currUser.locations &&
                currUser.locations.every((location) => location !== null) ? (
                  currUser.locations.map((location, idx) => {
                    return (
                      <Chip title={location} key={idx} color={COLORS.primary} />
                    );
                  })
                ) : (
                  <Chip
                    title="No hay ubicaciones registrados"
                    key={1}
                    color={COLORS.primary}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 24,
  },

  profileHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    width: "90%",
    height: "24%",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 8,
  },
  profileTextContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    marginLeft: 20,
    maxWidth: "60%",
    minWidth: "42%",
  },
  profileTextLocation: {
    fontSize: 14,
    fontWeight: 400,
    color: COLORS.white,
  },
  profileTextName: {
    fontSize: 28,
    fontWeight: 500,
    color: COLORS.mediumGray,
  },

  profileTextAge: {
    fontSize: 14,
    color: COLORS.white,
  },
  bodyText: {
    fontSize: 26,
    fontWeight: 600,
    color: COLORS.primary,
    marginBottom: 8,
    marginRight: "auto",
  },
  itemText: {
    fontSize: 20,
    fontWeight: 300,
  },
  profileBody: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    width: "90%",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  bodySectionContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: 8,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  userDataContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  userDataDisplay: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    marginLeft: 8,
  },
});

export default Profile;
