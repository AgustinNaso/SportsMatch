import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCurrUserJWT, getCurrentUserData } from "../services/authService";
import { COLORS } from "../constants";
import { AuthContext } from "../contexts/authContext"
import CustomButton from "../components/CustomButton";

const sports = ["Futbol", "Basquet", "Paddle"];

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
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >

        <View style={styles.profileHeader}>
          <Ionicons name="person" size={100} style={{ borderColor: 'white', borderWidth: 2, borderRadius: 100, padding: 10 }} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileTextName}>Agustin Naso</Text>
            {/* <Text style={styles.profileTextName}>{currUser?.given_name} {currUser?.family_name}</Text> */}
            <Text style={styles.profileTextAge}>25 años      1121576283</Text>
            <Text style={styles.profileTextLocation}>
              Barracas, Buenos Aires
            </Text>
          </View>
        </View>
        <View style={styles.profileBody}>
          <Text style={styles.bodyText}>Telefono: {formatPhoneNumber(currUser?.phone_number)}</Text>
          <Text style={styles.bodyText}>Deportes de Interes:</Text>
          {sports.map((sport) => (
            <Text style={styles.itemText}>{`\u26ab ${sport}`}</Text>
          ))}
        </View>
        <CustomButton title={"Logout"} onPress={handleLogout} color="#F00" />

        {/* <View style={styles.buttonContainer}>
          <CustomButton title={"Edit"} color={'rgba(19, 20, 100, 0.7)'} />
          <CustomButton title={"Logout"} onPress={handleLogout} color="#F00" />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({

  mainContainer: {
    display: "flex",
    height: "100%",
    backgroundColor: 'grey',
    alignItems: 'center',

  },

  profileHeader: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingLeft: 15,
    backgroundColor: 'rgba(19, 20, 100, 0.7)',
    borderRadius: 30,
    marginTop: 10,
    width: '99%'
  },
  profileTextContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    marginLeft: 20,
  },
  profileTextLocation: {
    fontSize: 20,
    fontWeight: 400,
    color: COLORS.white

  },
  profileTextName: {
    fontSize: 36,
    fontWeight: 500,
    color: COLORS.mediumGray
  },

  profileTextAge: {
    fontSize: 20,
    color: COLORS.white
  },
  bodyText: {
    fontSize: 26,
    fontWeight: 400,
    color: COLORS.primary
  },
  itemText: {
    fontSize: 20,
    fontWeight: 300,
  },
  profileBody: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: "55%",
    width: "90%",
    backgroundColor: 'red'
  },
  buttonContainer: {
    minWidth: "70%",
    marginTop: 10,
    paddingVertical: 2,
    flexDirection: "column",
    gap: 10,
    minHeight: 250,
    backgroundColor: 'grey'
  },
});

export default Profile;
