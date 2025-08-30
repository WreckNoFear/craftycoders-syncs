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
  cardContainer: {
    backgroundColor: Theme.COLORS.WHITE,
    borderLeftColor: Theme.COLORS.PRIMARY,
    borderLeftWidth: 10,
    borderRadius: 10,
    padding: 20,
    gap: 12,
  },
  cardSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardSectionSpaced: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontFamily: Theme.FONT.MEDIUM,
  },
  eco: {
    borderColor: Theme.COLORS.DARK_GREEN,
    borderWidth: 0.5,
    backgroundColor: Theme.COLORS.GREEN,
    paddingHorizontal: 10,
    paddingVertical: 4,
    display: "flex",
    flexDirection: "row",
    gap: 4,
    borderRadius: 20,
  },
  ecoText: {
    color: Theme.COLORS.DARK_GREEN,
  },
  fallbackContainer: {
    display: "flex",
    alignItems: "center",
    height: "80%",
    justifyContent: "center",
    gap: 12,
  },
  fallbackTextGroup: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  fallbackText: {
    color: Theme.COLORS.GRAY,
    fontSize: 14,
  },
});
