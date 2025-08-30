import { useEffect, useRef, useState } from "react";
import {
  View,
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
import * as Location from "expo-location";
import { railLoactions } from "@/src/helpers/rail-locations";
import { MapLocation } from "@/src/assets/data/locations";
import {
  getTrainLocations,
  getTripsByLocation,
} from "@/src/server/api/location";
import { styles } from "@/src/styles/css/trip";
import { getNearestStation } from "@/src/helpers/nearest-station";
import TransportIcon from "@/src/components/transport-icon";
import { Navigation } from "lucide-react-native";

type Point = { latitude: number; longitude: number };

const Trip = () => {
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [filteredLocations, setFilteredLocations] =
    useState<MapLocation[]>(railLoactions);
  const [searchText, setSearchText] = useState<string>("");
  const [selected, setSelected] = useState<MapLocation | undefined>(undefined);
  const [trainLocations, setTrainLocations] = useState<Point[]>([]);

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

  useEffect(() => {
    const fetchTrainLocations = async () => {
      try {
        const { train_locations } = await getTrainLocations();
        setTrainLocations(train_locations);
      } catch (err) {
        console.error("Failed to fetch train locations:", err);
        Toast.show({
          type: "error",
          text1: "Failed to fetch train locations.",
        });
      }
    };

    fetchTrainLocations();
    const interval: ReturnType<typeof setInterval> = setInterval(
      fetchTrainLocations,
      30000
    );

    return () => clearInterval(interval);
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

  // User has selected a station
  useEffect(() => {
    if (!selected) return;

    const moveToLocation = async () => {
      try {
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

        const location = await getNearestStation();
        if (!location) {
          throw new Error("Failed to find nearest station location");
        }

        const { error, data } = await getTripsByLocation({
          data: {
            start_id: String(location?.station.TSN),
            end_id: String(selected.TSN),
          },
        });

        console.log(error, data);

        if (error) throw error;

        console.log("RESULTS DATA: ", data);
      } catch (error) {
        console.error("Failed to get trip results: ", error);
        Toast.show({
          type: "error",
          text1: "Failed to get trip results from location",
        });
      }
    };

    moveToLocation();
  }, [selected]);

  const handleReturnToLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync();
      const { longitude, latitude } = location.coords;

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );
      }
    } catch (error) {
      console.error("Failed to return to current location: ", error);
      Toast.show({
        type: "error",
        text1: "Failed to return to current location.",
      });
    }
  };

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
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleReturnToLocation}
                style={styles.returnToLocation}
              >
                <Navigation />
              </TouchableOpacity>
              <View style={styles.selectedView}>
                <ResultItem item={selected} />
              </View>
              {/* <View style={styles.resultsOverlay}>
                <View>Results go here</View>
              </View> */}
            </>
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
        {transportModes.includes("Metro") && <TransportIcon type="metro" />}
        {transportModes.includes("Train") && <TransportIcon type="train" />}
      </View>
      <Text>{item.LOCATION_NAME}</Text>
    </TouchableOpacity>
  );
};
