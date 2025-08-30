import { StyleSheet } from "react-native";
import { Theme } from "../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  gridContainer: {
    flex: 1,
    gap: 20,
  },
  gridItem: {
    width: "46%",
    height: 180,
    margin: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  gridIcon: {
    height: 100,
    width: 100,
    alignSelf: "center",
  },
  gridText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  whereButton: {
    width: "100%",
    display: "flex",
    marginVertical: 20,
  },
  whereButtonText: {
    fontFamily: Theme.FONT.BOLD,
    fontSize: 16,
    color: Theme.COLORS.WHITE,
  },
  containerHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    paddingVertical: 8,
    borderRadius: 100,
    gap: 8,
    backgroundColor: Theme.COLORS.WHITE,
  },
});
