import { StyleSheet } from "react-native";
import { Theme } from "../theme";

export const styles = StyleSheet.create({
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
  resultsOverlay: {
    height: 750,
    width: "100%",
    zIndex: 50,
    backgroundColor: Theme.COLORS.WHITE,
    marginTop: 41,
    borderTopColor: Theme.COLORS.PRIMARY,
    borderWidth: 1,
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  trainIcons: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 2,
  },
});
