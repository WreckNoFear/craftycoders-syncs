import { View, Text } from "react-native";
import React, { useState } from "react";
import { Clock, Leaf } from "lucide-react-native";
import { styles } from "@/src/styles/css/saved-trips";
import TransportIcon from "@/src/components/transport-icon";
import { Theme } from "@/src/styles/theme";
import BackButton from "@/src/components/back-button";
import { FlatList } from "react-native-gesture-handler";

const RecentTrips = () => {
  const [recentTrips, setRecentTrips] = useState([]);

  const DATA = {
    title: "Macarthur to Central",
    date: new Date("2025-07-05"),
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Clock />
          <Text style={styles.title}>Recent Trips</Text>
        </View>

        {!recentTrips ||
          (recentTrips.length === 0 && (
            <View style={styles.fallbackContainer}>
              <Clock size={40} color={Theme.COLORS.GRAY} />
              <View style={styles.fallbackTextGroup}>
                <Text style={styles.fallbackText}>No recent trips.</Text>
                <Text style={styles.fallbackText}>
                  Your recent trips will appear here.
                </Text>
              </View>
            </View>
          ))}

        {/* <View style={styles.cardContainer}>
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
        </View> */}
      </View>
    </View>
  );
};

export default RecentTrips;
