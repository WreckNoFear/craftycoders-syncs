import { StyleSheet } from "react-native";
import { Theme } from "../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    marginVertical: 20,
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
  chartContainer: {
    display: "flex",
    justifyContent: "center",
    height: "70%",
  },
  chartLabel: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: 600,
  },
  savedContainer: {
    backgroundColor: Theme.COLORS.WHITE,
    padding: 10,
    borderRadius: 10,
  },
  savedText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: Theme.FONT.REGULAR,
  },
  savedBigText: {
    textAlign: "center",
    color: Theme.COLORS.PRIMARY,
    fontFamily: Theme.FONT.BOLD,
    fontSize: 48,
  },
});
