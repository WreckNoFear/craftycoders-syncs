import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Theme } from "../styles/theme";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";

const BackButton = () => {
  return (
    <TouchableOpacity
      style={styles.back}
      activeOpacity={0.7}
      onPress={() => router.back()}
    >
      <ChevronLeft />
      <Text>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  back: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: Theme.COLORS.WHITE,
  },
});
