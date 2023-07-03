import React from "react";
import { ActivityIndicator } from "react-native";
import { COLORS } from "../constants";

export default function AuthLoadingScreen({ navigation }) {
  // TODO: check if user is logged in
  if (true) {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }

  return (
    <ActivityIndicator
      size="large"
      color={COLORS.primary}
      style={{ alignSelf: "center", marginTop: "50%" }}
    />
  );
}