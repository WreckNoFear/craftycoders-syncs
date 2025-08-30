import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { Theme } from "../styles/theme";

type ButtonProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
} & Omit<RectButtonProps, "onPress">;

export default function Button({ children, onPress, style, ...props }: ButtonProps) {
  return (
    <RectButton
      style={[styles.button, style]}
      onPress={onPress ? () => onPress() : undefined}
      {...props}
    >
      <View accessible accessibilityRole="button">
        {children}
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 50,
    borderRadius: 100,
    backgroundColor: Theme.COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
});
