import { View, Text, TouchableOpacity } from "react-native";
import Logo from "@/src/components/logo";
import { Clock, Leaf, Star, UserCircle } from "lucide-react-native";
import { FlatList } from "react-native-gesture-handler";
import { ReactElement } from "react";
import Button from "@/src/components/button";
import { RelativePathString, router } from "expo-router";
import { styles } from "@/src/styles/css/home";

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
      route: "/features/sustainability",
    },
    {
      id: "saved-trips",
      icon: <Star style={styles.gridIcon} />,
      title: "Saved Trips",
      route: "/(tabs)/saved-trips",
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
      route: "/features/recent-trips",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Logo />
        <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
          <UserCircle />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>

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
    <TouchableOpacity
      style={styles.gridItem}
      activeOpacity={0.7}
      onPress={() => router.push(item.route as RelativePathString)}
    >
      {item.icon}
      <Text style={styles.gridText}>{item.title}</Text>
    </TouchableOpacity>
  );
};
