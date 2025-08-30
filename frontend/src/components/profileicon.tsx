import { Image } from "expo-image";
import { StyleSheet } from "react-native";

export default function ProfileIcon() {
  return (
    <Image
      source={require("@/src/assets/images/profileicon.png")}
      style={styles.profileIcon}
    />
  );
}

const styles = StyleSheet.create({
  profileIcon: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
  },
});