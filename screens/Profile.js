import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView, Image } from "react-native";
import { COLORS } from "../constants";
import { Avatar, Chip, Divider } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { fetchUser } from "../services/eventService";
import { SPORT } from "../constants/data";
import { getCurrentUserData } from "../services/authService";


const image_url = 'https://randomuser.me/api/portraits/men/36.jpg'

const Profile = () => {

  const [currUser, setCurrUser] = useState();
  const formatPhoneNumber = (phoneNumberString) => {
    if (!phoneNumberString) return;
    let formatted = phoneNumberString.replace(/(\d{2})(\d{2})(\d{4})/, "$1 $2 $3");
    return formatted;
  }


  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = await getCurrentUserData();
      const user = await fetchUser(currentUser.email);
      console.log("USER: " + JSON.stringify({...user, birthdate: currentUser.birthdate}));
      setCurrUser({...user, birthdate: currentUser.birthdate});
    }
    try {
      fetchUserData();
    }
    catch (err) {
      console.error("ERROR fetching user data",err);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.mainContainer}
      >
        <View style={styles.profileHeader}>
          <Avatar
            size={108}
            rounded
            source={image_url ? { uri: image_url } : {}}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileTextName}>{currUser?.firstname} {currUser?.lastname}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 5 }}>
              <Ionicons name="star" size={18} color={COLORS.secondary} />
              <Text style={styles.profileTextAge}>  4.2 / 5</Text>
            </View>
            <Text style={styles.profileTextLocation}>38 partidos</Text>
          </View>
        </View>
        <View style={styles.profileBody}>
          <View style={styles.bodySectionContainer}>
            <Text style={styles.bodyText}>Mis Datos</Text>
            <Divider width={3} style={{ width: '100%', marginBottom: 16 }} />
            <View style={styles.userDataContainer}>
              <Image source={require('../assets/pin-48-blue.png')} style={{ width: 23, height: 23 }} />
              <View style={styles.userDataDisplay}>
                <Text style={styles.itemText}>{currUser?.locations[0]}</Text>
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
            <Divider width={3} style={{ width: '100%', marginBottom: 16 }} />
            <View style={styles.chipContainer}>
              {currUser?.sports?.map((sport, idx) => (
                <Chip title={SPORT[sport - 1]} key={idx} color={COLORS.primary} />
              ))}
            </View>
          </View>
          <View style={styles.bodySectionContainer}>
            <Text style={styles.bodyText}>Mis Ubicaciones</Text>
            <Divider width={3} style={{ width: '100%', marginBottom: 16 }} />
            <View style={styles.chipContainer}>
              {currUser?.locations?.map((location, idx) => (
                <Chip title={location} key={idx} color={COLORS.primary} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({

  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
    marginBottom: 8
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
    color: COLORS.white

  },
  profileTextName: {
    fontSize: 28,
    fontWeight: 500,
    color: COLORS.mediumGray
  },

  profileTextAge: {
    fontSize: 14,
    color: COLORS.white
  },
  bodyText: {
    fontSize: 26,
    fontWeight: 600,
    color: COLORS.primary,
    marginBottom: 8,
    marginRight: 'auto',
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
    paddingHorizontal: 16
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
  }
});

export default Profile;
