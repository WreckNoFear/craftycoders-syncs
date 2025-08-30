import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Theme } from "../styles/theme";

type TransportIconProps = {
  type: "metro" | "train";
};

const TransportIcon = ({ type }: TransportIconProps) => {
  switch (type) {
    case "train":
      return (
        <View style={[styles.transportIcon, styles.iconTrain]}>
          <Text style={styles.transportIconText}>T</Text>
        </View>
      );
    case "metro":
      return (
        <View style={[styles.transportIcon, styles.iconMetro]}>
          <Text style={styles.transportIconText}>M</Text>
        </View>
      );
  }
};

export default TransportIcon;

const styles = StyleSheet.create({
  transportIcon: {
    borderWidth: 1,
    borderRadius: "100%",
    width: 24,
    height: 24,
    alignItems: "center",
    borderColor: Theme.COLORS.WHITE,
  },
  iconMetro: {
    backgroundColor: Theme.COLORS.METRO,
  },
  iconTrain: {
    backgroundColor: Theme.COLORS.TRAIN,
  },
  transportIconText: {
    fontFamily: Theme.FONT.BOLD,
    color: Theme.COLORS.WHITE,
  },
});
