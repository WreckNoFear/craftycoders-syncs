import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { RectButton } from "react-native-gesture-handler";
import { Theme } from "@/src/styles/theme";
import Button from "@/src/components/button";

const Home = () => {
  return (
    <View style={styles.view}>
      <Image
        source={require("@/src/assets/images/logo.png")}
        style={styles.logo}
      />

      <Text>Home</Text>

      <Button>
        <Text>Button goes here</Text>
      </Button>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  button: {
    backgroundColor: Theme.COLORS.PRIMARY,
    padding: 100,
  }
});