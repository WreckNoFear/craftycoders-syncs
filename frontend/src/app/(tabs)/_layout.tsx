import { Theme } from "@/src/styles/theme";
import { Tabs } from "expo-router";
import {
  Home,
  Map,
  Navigation,
  Settings,
  Star,
  User,
} from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          elevation: 0,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Home
              color={focused ? Theme.COLORS.PRIMARY : Theme.COLORS.GRAY}
              size={size}
            />
          ),
          tabBarActiveTintColor: Theme.COLORS.PRIMARY,
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: "New Trip",
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Navigation
              color={focused ? Theme.COLORS.PRIMARY : Theme.COLORS.GRAY}
              size={size}
            />
          ),
          tabBarActiveTintColor: Theme.COLORS.PRIMARY,
        }}
      />
      <Tabs.Screen
        name="saved-trips"
        options={{
          title: "Saved Trips",
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Star
              color={focused ? Theme.COLORS.PRIMARY : Theme.COLORS.GRAY}
              size={size}
            />
          ),
          tabBarActiveTintColor: Theme.COLORS.PRIMARY,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Settings
              color={focused ? Theme.COLORS.PRIMARY : Theme.COLORS.GRAY}
              size={size}
            />
          ),
          tabBarActiveTintColor: Theme.COLORS.PRIMARY,
        }}
      />
    </Tabs>
  );
}
