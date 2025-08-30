import * as Location from "expo-location";
import { findNearest } from "geolib";
import { railLoactions } from "./rail-locations";
import { MapLocation } from "../assets/data/locations";
import { GeolibInputCoordinates } from "geolib/es/types";

type GeoStation = GeolibInputCoordinates & { station: MapLocation };

export const getNearestStation = async () => {
  try {
    const stationsForGeoLib = railLoactions.map((station) => ({
      latitude: station.LATITUDE,
      longitude: station.LONGITUDE,
      station,
    }));

    // Get current user location
    const { coords } = await Location.getCurrentPositionAsync();
    if (!coords) throw new Error("Failed to get coordinantes");

    // Get nearest Train/Metro station to the user
    const { latitude, longitude } = coords;
    const nearest = findNearest({ latitude, longitude }, stationsForGeoLib);

    return nearest as GeoStation;
  } catch (error) {
    console.error("Error fetching nearest station: ", error);
  }
};
