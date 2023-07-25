import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "../utils/cognito-pool";

const sports = ["Futbol", "Basquet", "Paddle"];

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    padding: 32,
  },
  profileTextContainer: {
    flexDirection: "col",
    justifyContent: "space-evenly",
    marginLeft: 20,
  },
  profileTextLocation: {
    fontSize: 20,
    fontWeight: 400,
  },
  profileTextName: {
    fontSize: 36,
    fontWeight: 500,
  },
  bodyText: {
    fontSize: 26,
    fontWeight: 300,
  },
  itemText: {
    fontSize: 20,
    fontWeight: 300,
  },
  profileBody: {
    flexDirection: "col",
    justifyContent: "space-evenly",
    height: "55%",
    width: "90%",
  },
  buttonContainer: {
    minWidth: "70%",
    marginTop: 10,
    paddingVertical: 2,
    flexDirection: "column",
    gap: "10em",
    minHeight: "14%",
  },
});

const Profile = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      async function fetchUser() {
        //const user = await getCurrentUser();
      }
      fetchUser();
    }, [])
  );

  const handlePress = () => {
    navigation.navigate("MyEvents");
  };

  const handleLogout = () => {
    signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, maxHeight: "100%" }}>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View style={styles.profileHeader}>
          <Ionicons name="person" size={100} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileTextName}>John Doe</Text>
            <Text style={styles.profileTextLocation}>
              Barracas, Buenos Aires
            </Text>
          </View>
        </View>
        <View style={styles.profileBody}>
          <Text style={styles.bodyText}>Edad: 25 años</Text>
          <Text style={styles.bodyText}>Telefono: 1121224423</Text>
          <Text style={styles.bodyText}>Deportes de Interes:</Text>
          {sports.map((sport) => (
            <Text style={styles.itemText}>{`\u26ab ${sport}`}</Text>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton title={"Edit"} color="grey" />
          <CustomButton
            title={"My events"}
            onPress={handlePress}
            color="green"
          />
          <CustomButton title={"Logout"} onPress={handleLogout} color="#F00" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
