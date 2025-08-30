import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Toast from "react-native-toast-message";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { Theme } from "@/src/styles/theme";
import * as Location from "expo-location";
import { railLoactions } from "@/src/helpers/rail-locations";
import { MapLocation } from "@/src/assets/data/locations";
import { getTrainLocations } from "@/src/server/api/location";

const Trip = () => {
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [filteredLocations, setFilteredLocations] =
    useState<MapLocation[]>(railLoactions);
  const [searchText, setSearchText] = useState<string>("");
  const [selected, setSelected] = useState<MapLocation | undefined>(undefined);
  const [trainLocations, setTrainLocations] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const mapRef = useRef<MapView>(null);
  const inputRef = useRef<TextInput>(null);

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
      const { trainLocations } = await getTrainLocations();

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

      setTrainLocations(trainLocations);
    };

    fetchMapLocation();
  }, []);

  useEffect(() => {
    if (searchText === "") {
      setFilteredLocations(railLoactions);
    } else {
      const filtered = railLoactions.filter(
        (location) =>
          location.LOCATION_NAME.toLowerCase().includes(
            searchText.toLowerCase()
          ) ||
          location.TRANSPORT_MODE.toLowerCase().includes(
            searchText.toLowerCase()
          )
      );
      setFilteredLocations(filtered);
    }
  }, [searchText]);

  useEffect(() => {
    if (!selected) return;

    const moveToLocation = () => {
      setSearchFocused(false);
      inputRef.current?.blur();

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: selected?.LATITUDE ?? 0,
            longitude: selected?.LONGITUDE ?? 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    };

    moveToLocation();
  }, [selected]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.innerContainer}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            style={styles.searchFrom}
            onChangeText={(text) => setSearchText(text)}
            onBlur={() => setSearchFocused(false)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Where to next?"
            autoFocus={false}
            autoComplete="off"
          />
          {searchFocused && (
            <View style={styles.resultsWrapper}>
              <FlatList
                data={filteredLocations}
                renderItem={({ item }) => (
                  <ResultItem setSelected={setSelected} item={item} />
                )}
                keyExtractor={(item) => `${item.LONGITUDE}-${item.LATITUDE}`}
                numColumns={1}
                style={styles.locationsContainer}
              />
            </View>
          )}

          {selected && (
            <View style={styles.selectedView}>
              <ResultItem item={selected} />
            </View>
          )}
        </View>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <MapView ref={mapRef} style={styles.map} showsUserLocation>
            {trainLocations &&
              trainLocations.map((location, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title={`Train ${index + 1}`}
                  description={`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
                />
              ))}
          </MapView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Trip;

const ResultItem = ({
  item,
  setSelected,
}: {
  item?: MapLocation;
  setSelected?: (l: MapLocation) => void;
}) => {
  if (!item) return null;

  const transportModes = item.TRANSPORT_MODE.split(",").map((mode) =>
    mode.trim()
  );

  return (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        if (setSelected) {
          setSelected(item);
        }
      }}
    >
      <View style={styles.trainIcons}>
        {transportModes.includes("Train") && transportIcon({ type: "train" })}
        {transportModes.includes("Metro") && transportIcon({ type: "metro" })}
      </View>
      <Text>{item.LOCATION_NAME}</Text>
    </TouchableOpacity>
  );
};

const transportIcon = ({ type }: { type: "train" | "metro" }) => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    width: "100%",
    zIndex: 100,
  },
  resultsWrapper: {
    marginTop: 4,
    backgroundColor: Theme.COLORS.WHITE,
    borderRadius: 8,
    maxHeight: 800,
  },
  searchFrom: {
    zIndex: 10,
    position: "absolute",
    backgroundColor: Theme.COLORS.WHITE,
    padding: 12,
    width: "100%",
  },
  searchTo: {
    zIndex: 50,
    position: "absolute",
    top: 40,
    backgroundColor: Theme.COLORS.WHITE,
    padding: 12,
    width: "100%",
  },
  locationsContainer: {
    zIndex: 50,
    width: "100%",
    padding: 12,
    top: 30,
    backgroundColor: Theme.COLORS.WHITE,
  },
  resultItem: {
    width: "100%",
    height: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trainIcons: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 2,
  },
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
  selectedView: {
    top: 50,
    position: "absolute",
    right: 8,
    backgroundColor: Theme.COLORS.WHITE,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
    shadowColor: Theme.COLORS.BLACK,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
});
