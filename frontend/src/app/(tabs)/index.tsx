import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Logo from "@/src/components/logo";
import { Clock, Leaf, Star, UserCircle } from "lucide-react-native";
import { FlatList } from "react-native-gesture-handler";
import { ReactElement } from "react";
import Button from "@/src/components/button";
import { Theme } from "@/src/styles/theme";
import ProfileIcon from "@/src/components/profileicon";
import { router } from "expo-router";

type ButtonProps = {
  id: string;
  icon: ReactElement;
  title: string;
  route: string;
};

const Home = () => {
  const items: ButtonProps[] = [
    {
      id: "sustainability-report",
      icon: <Leaf style={styles.gridIcon} />,
      title: "Sustainability Report",
      route: "/(tabs)",
    },
    {
      id: "saved-trips",
      icon: <Star style={styles.gridIcon} />,
      title: "Saved Trips",
      route: "/(tabs)",
    },
    {
      id: "social",
      icon: <UserCircle style={styles.gridIcon} />,
      title: "Social",
      route: "/(tabs)",
    },
    {
      id: "recent-trips",
      icon: <Clock style={styles.gridIcon} />,
      title: "Recent Trips",
      route: "/(tabs)",
    },
  ];

  return (
    <View style={styles.container}>
      <Logo />
      <UserCircle />

      <Button
        style={styles.whereButton}
        onPress={() => router.push("/(tabs)/trip")}
      >
        <Text style={styles.whereButtonText}>Where to next?</Text>
      </Button>

      <FlatList
        data={items}
        renderItem={({ item }) => <BigButton item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={styles.gridContainer}
      />
    </View>
  );
};

export default Home;

const BigButton = ({ item }: { item: ButtonProps }) => {
  return (
    <TouchableOpacity style={styles.gridItem} activeOpacity={0.7}>
      {item.icon}
      <Text style={styles.gridText}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  gridContainer: {
    flex: 1,
    gap: 20,
  },
  gridItem: {
    width: "46%",
    height: 180,
    margin: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  gridIcon: {
    height: 100,
    width: 100,
    alignSelf: "center",
  },
  gridText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  whereButton: {
    width: "100%",
    display: "flex",
    marginVertical: 20,
  },
  whereButtonText: {
    fontFamily: Theme.FONT.MEDIUM,
  },
});
