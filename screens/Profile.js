import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView, Image } from "react-native";
import { getCurrUserJWT, getCurrentUserData } from "../services/authService";
import { COLORS } from "../constants";
import { AuthContext } from "../contexts/authContext"
import { Avatar, Chip, Divider } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';


const sports = ["Futbol", "Basquet", "Paddle", "Tenis", "Voley"];
const locations = ["Palermo", "Belgrano", "Nuñez", "Villa Crespo"]
const image_url = 'https://randomuser.me/api/portraits/men/36.jpg'

const Profile = () => {

  const [currUser, setCurrUser] = useState();
  const authContext = useContext(AuthContext);

  const formatPhoneNumber = (phoneNumberString) => {
    if (!phoneNumberString) return;
    let formatted = phoneNumberString.replace(/(\d{2})(\d{2})(\d{4})/, "$1 $2 $3");
    return formatted;
  }


  useEffect(() => {
    getCurrentUserData().then((data) => {
      console.log("DATA progile: " + data);
      setCurrUser(JSON.parse(data));
      console.log(JSON.parse(data).given_name)
    });
    // console.log(getCurrUserJWT());
  }, []);

  const handleLogout = () => {
    console.log("LOGOUT")
    console.log(authContext);
    authContext.signOut();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
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
            <Text style={styles.profileTextName}>John Doe</Text>
            {/* <Text style={styles.profileTextName}>{currUser?.given_name} {currUser?.family_name}</Text> */}
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
            <Divider width={3} style={{width: '100%', marginBottom: 8}}/>
            <View style={styles.userDataContainer}>
              <Image source={require('../assets/pin-48-blue.png')} style={{ width: 23, height: 23 }} />
              <View style={styles.userDataDisplay}>
                <Text style={styles.itemText}>Barracas, Buenos Aires</Text>
              </View>
            </View>
            <View style={styles.userDataContainer}>
              <Ionicons name="call" size={24} color={COLORS.primary} />
              <View style={styles.userDataDisplay}>
                <Text style={styles.itemText}>1121576283</Text>
              </View>
            </View>
            <View style={styles.userDataContainer}>
              <Ionicons name="calendar" size={24} color={COLORS.primary} />
              <View style={styles.userDataDisplay}>
                <Text style={styles.itemText}>04/07/1998</Text>
              </View>
            </View>
          </View>
          <View style={styles.bodySectionContainer}>
            <Text style={styles.bodyText}>Mis Deportes</Text>
            <Divider width={3} style={{width: '100%', marginBottom: 8}}/>
            <View style={styles.chipContainer}>
              {sports.map((sport, idx) => (
                <Chip title={sport} key={idx} color={COLORS.primary} />
              ))}
            </View>
          </View>
          <View style={styles.bodySectionContainer}>
            <Text style={styles.bodyText}>Mis Ubicaciones</Text>
            <Divider width={3} style={{width: '100%', marginBottom: 8}}/>
            <View style={styles.chipContainer}>
              {locations.map((sport, idx) => (
                <Chip title={sport} key={idx} color={COLORS.primary} />
              ))}
            </View>
          </View>
        </View>
        {/* <CustomButton title={"Logout"} onPress={handleLogout} color="#F00" /> */}
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
    height: "22%",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    marginBottom: 10,
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
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16
  },
  bodySectionContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 8,
    marginTop: 6
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
    marginLeft: 10,
  }
});

export default Profile;
