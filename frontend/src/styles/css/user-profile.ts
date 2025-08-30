import { StyleSheet } from "react-native";
import { Theme } from "../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    marginVertical: 20,
    gap: 20,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: Theme.FONT.MEDIUM,
  },
  textContainer: {
    display: "flex",
    alignItems: "center",
    marginVertical: 40,
  },
  textTitle: {
    fontSize: 24,
    fontFamily: Theme.FONT.MEDIUM,
  },
  textSubtitle: {
    color: Theme.COLORS.GRAY,
  },
  logoutButton: {
    width: "100%",
    position: "absolute",
    bottom: -520,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 600,
    color: Theme.COLORS.WHITE,
    fontFamily: Theme.FONT.BOLD,
  },
});
