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
import MapView, { Marker, Point, Polyline } from "react-native-maps";
import Toast from "react-native-toast-message";
import { FlatList, TextInput } from "react-native-gesture-handler";
import * as Location from "expo-location";
import { railLoactions } from "@/src/helpers/rail-locations";
import { MapLocation } from "@/src/assets/data/locations";
import {
  getChosenRoute,
  getTrainLocations,
  getTripsByLocation,
} from "@/src/server/api/location";
import { styles } from "@/src/styles/css/trip";
import { getNearestStation } from "@/src/helpers/nearest-station";
import TransportIcon from "@/src/components/transport-icon";
import { Leaf, Navigation, X } from "lucide-react-native";
import { Trip as TripType, Point as PointType } from "@/src/types/custom.types";
import { Theme } from "@/src/styles/theme";

const Trip = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [filteredLocations, setFilteredLocations] =
    useState<MapLocation[]>(railLoactions);
  const [searchText, setSearchText] = useState<string>("");
  const [selected, setSelected] = useState<MapLocation | undefined>(undefined);
  const [trainLocations, setTrainLocations] = useState<PointType[]>([]);
  const [journeys, setJourneys] = useState<TripType[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<TripType["legs"]>();
  const [nearestStation, setNearestStation] = useState<MapLocation | undefined>(
    undefined
  );
  const [selectedService, setSelectedService] = useState<number | null>();

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
        const { train_info, error } = await getTrainLocations();
        if (error) throw error;

        setTrainLocations(train_info);
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
        setNearestStation(location?.station);
        if (!location) {
          throw new Error("Failed to find nearest station location");
        }

        const { journeys, error } = await getTripsByLocation({
          data: {
            start_id: String(location?.station.TSN),
            end_id: String(selected.TSN),
          },
        });

        if (error) throw error;

        setJourneys(journeys);
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

  const handleReturnToSelectedStation = async () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: selected?.LATITUDE ?? 0,
          longitude: selected?.LONGITUDE ?? 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  const setChosenRouteInformation = async (index: number) => {
    try {
      const { error } = await getChosenRoute({ data: { chosen_num: index } });

      if (error) throw error;

      setSelectedService(index);
      Toast.show({
        type: "success",
        text1: "This route has been selected.",
      });
    } catch (error) {
      console.error("Failed to get chosen route: ", error);
      Toast.show({
        type: "error",
        text1: "Failed to get chosen route",
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
            onFocus={() => {
              setSearchFocused(true);
              inputRef.current?.clear();
            }}
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
                <ResultItem
                  item={selected}
                  onPress={handleReturnToSelectedStation}
                />
              </View>
            </>
          )}
        </View>

        {journeys?.length > 0 && (
          <View style={styles.resultsOverlay}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>Next Services</Text>
              <X onPress={() => setJourneys([])} />
            </View>
            <FlatList
              data={journeys}
              renderItem={({ item, index }) => (
                <TripItem
                  item={item}
                  index={index}
                  setSelectedJourney={setSelectedJourney}
                  setChosenRouteInformation={setChosenRouteInformation}
                  selected={selected}
                  nearestStation={nearestStation}
                />
              )}
              keyExtractor={(item, index) =>
                `${index}-${item.arrival_time}-${item.departure_time}`
              }
              numColumns={1}
              style={styles.resultsContainer}
            />
          </View>
        )}

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <MapView ref={mapRef} style={styles.map} showsUserLocation>
            {trainLocations &&
              trainLocations.map((location, index) => (
                <Marker
                  key={`marker-${index}-${location.latitude}-${location.longitude}`}
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title={`Train ${index + 1}`}
                  description={`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
                />
              ))}
            {selectedJourney?.map((leg, index) => (
              <Polyline
                key={`point-${index}`}
                coordinates={leg.path?.map((point) => ({
                  latitude: point.latitude,
                  longitude: point.longitude,
                }))}
                strokeColor={Theme.COLORS.PRIMARY}
                strokeWidth={6}
              />
            ))}
          </MapView>
        </KeyboardAvoidingView>
        <Text style={styles.updateText}>Updates every 30s</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Trip;

const ResultItem = ({
  item,
  setSelected,
  onPress,
}: {
  item?: MapLocation;
  setSelected?: (l: MapLocation) => void;
  onPress?: () => void;
}) => {
  if (!item) return null;

  const transportModes = item.TRANSPORT_MODE.split(",").map((mode) =>
    mode.trim()
  );

  return (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        if (onPress) {
          onPress();
          return;
        } else if (setSelected) {
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

const TripItem = ({
  item,
  index,
  setSelectedJourney,
  selected,
  nearestStation,
  setChosenRouteInformation,
}: {
  item: TripType;
  index: number;
  setSelectedJourney: (v: TripType["legs"]) => void;
  selected?: MapLocation;
  nearestStation?: MapLocation;
  setChosenRouteInformation: (v: number) => void;
}) => {
  const transportModesTo = selected?.TRANSPORT_MODE.split(",").map((mode) =>
    mode.trim()
  );
  const transportModesFrom = nearestStation?.TRANSPORT_MODE.split(",").map(
    (mode) => mode.trim()
  );

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.7}
      onPress={() => {
        setSelectedJourney(item.legs);
        setChosenRouteInformation(index);
      }}
    >
      <View style={styles.cardSectionSpaced}>
        <View style={styles.stationNamesContainer}>
          <View style={styles.cardInner}>
            <View>
              <Text style={styles.cardInnerTitle}>
                {nearestStation?.LOCATION_NAME}
              </Text>
              <Text>{new Date(item.arrival_time).toLocaleTimeString()}</Text>
            </View>
            <View style={styles.trainIcons}>
              {transportModesFrom?.includes("Metro") && (
                <TransportIcon type="metro" />
              )}
              {transportModesFrom?.includes("Train") && (
                <TransportIcon type="train" />
              )}
            </View>
          </View>
          <View>
            <View style={styles.cardInner}>
              <View>
                <Text style={styles.cardInnerTitle}>
                  {selected?.LOCATION_NAME}
                </Text>
                <Text>
                  {new Date(item.departure_time).toLocaleTimeString()}
                </Text>
              </View>
              <View style={styles.trainIcons}>
                {transportModesTo?.includes("Metro") && (
                  <TransportIcon type="metro" />
                )}
                {transportModesTo?.includes("Train") && (
                  <TransportIcon type="train" />
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
