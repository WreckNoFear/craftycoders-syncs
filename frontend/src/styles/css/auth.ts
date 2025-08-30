import { StyleSheet } from "react-native";
import { Theme } from "../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 40,
    justifyContent: "center",
  },
  logoWrapper: {
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: 600,
    fontFamily: Theme.FONT.MEDIUM,
  },
  form: {
    gap: 32,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: Theme.FONT.REGULAR,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  error: {
    color: Theme.COLORS.DESTRUCTIVE,
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    fontFamily: Theme.FONT.MEDIUM,
  },
  smallLink: {
    textAlign: "center",
    marginVertical: 30,
    color: Theme.COLORS.GRAY,
  },
});
