import { View, Text } from "react-native";
import React, { useState } from "react";
import { Leaf, Star } from "lucide-react-native";
import { styles } from "@/src/styles/css/saved-trips";
import TransportIcon from "@/src/components/transport-icon";
import { Theme } from "@/src/styles/theme";
import { FlatList } from "react-native-gesture-handler";

const SavedTrips = () => {
  const [savedTrips, setSavedTrips] = useState([]);

  const DATA = {
    title: "Macarthur to Central",
    date: new Date("2025-07-05"),
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Star />
          <Text style={styles.title}>Saved Trips</Text>
        </View>

        {/* <FlatList
        
          
        /> */}

        {!savedTrips ||
          (savedTrips.length === 0 && (
            <View style={styles.fallbackContainer}>
              <Star size={40} color={Theme.COLORS.GRAY} />
              <View style={styles.fallbackTextGroup}>
                <Text style={styles.fallbackText}>No saved trips.</Text>
                <Text style={styles.fallbackText}>
                  Press the star to save trips you want to return to.
                </Text>
              </View>
            </View>
          ))}

        <View style={styles.cardContainer}>
          <View style={styles.cardSection}>
            <TransportIcon type="train" />
            <Text style={styles.cardTitle}>{DATA.title}</Text>
          </View>
          <View style={styles.cardSectionSpaced}>
            <Text>{DATA.date.toLocaleDateString()}</Text>
            <View style={styles.eco}>
              <Leaf size={18} color={Theme.COLORS.DARK_GREEN} />
              <Text style={styles.ecoText}>78%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SavedTrips;
