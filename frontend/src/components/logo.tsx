import { Image } from "expo-image";
import { StyleSheet } from "react-native";

export default function Logo() {
  return (
    <Image
      source={require("@/src/assets/images/logo.png")}
      style={styles.logo}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 85,
    height: 85,
    alignSelf: "center",
  },
});
