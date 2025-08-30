import { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native-gesture-handler";
import { Theme } from "@/src/styles/theme";

const Trip = () => {
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const fetchMapLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to location access was denied.");
        Toast.show({
          type: "error",
          text1: "Permission to location access was denied.",
        });
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync();

      if (mapRef.current && currentLocation) {
        mapRef.current.animateToRegion(
          {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    };

    fetchMapLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          onBlur={() => setSearchFocused(false)}
          // onChangeText={onChange}
          // value={value}
          onFocus={() => setSearchFocused(true)}
          placeholder="Enter a username"
        />
      </View>

      {/* <MapView ref={mapRef} style={styles.map} showsUserLocation /> */}
    </View>
  );
};

export default Trip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    width: '100%',
    paddingVertical: 20,
  },
  search: {
    zIndex: 50,
    bottom: 0,
    position: "absolute",
    backgroundColor: Theme.COLORS.WHITE,
    padding: 12,
    width: '100%',
  },
});
