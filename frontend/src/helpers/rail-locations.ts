import { LOCATIONS } from "../assets/data/locations";

export const railLoactions = LOCATIONS.filter((location) => {
  const transportModes = location.TRANSPORT_MODE.split(",").map((mode) =>
    mode.trim()
  );
  return transportModes.includes("Train") || transportModes.includes("Metro");
});
