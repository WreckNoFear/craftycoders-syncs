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
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: "New Trip",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Navigation color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved-trips"
        options={{
          title: "Saved Trips",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Star color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
