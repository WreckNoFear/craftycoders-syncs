import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useFonts } from "@expo-google-fonts/poppins/useFonts";

import { Poppins_100Thin } from "@expo-google-fonts/poppins/100Thin";
import { Poppins_200ExtraLight } from "@expo-google-fonts/poppins/200ExtraLight";
import { Poppins_300Light } from "@expo-google-fonts/poppins/300Light";
import { Poppins_400Regular } from "@expo-google-fonts/poppins/400Regular";
import { Poppins_500Medium } from "@expo-google-fonts/poppins/500Medium";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins/600SemiBold";
import { Poppins_700Bold } from "@expo-google-fonts/poppins/700Bold";
import { Poppins_800ExtraBold } from "@expo-google-fonts/poppins/800ExtraBold";
import { Poppins_900Black } from "@expo-google-fonts/poppins/900Black";
import { Loader } from "lucide-react-native";
import { Theme } from "../styles/theme";

export default function RootLayout() {
  const [isFontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  if (!isFontsLoaded) {
    return <Loader />;
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider style={{ backgroundColor: Theme.COLORS.PRIMARY }}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="dark" translucent backgroundColor="transparent" />
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
