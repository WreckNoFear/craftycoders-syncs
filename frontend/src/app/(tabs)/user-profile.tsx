import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LogOut, User } from "lucide-react-native";
import { styles } from "@/src/styles/css/user-profile";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Button from "@/src/components/button";

const UserProfile = () => {
  const handleLogout = async () => {
    try {
      const AUTH_TOKEN = await SecureStore.getItemAsync("AUTH_TOKEN");

      if (AUTH_TOKEN) {
        await SecureStore.deleteItemAsync("AUTH_TOKEN");
        router.push("/(auth)/login");
      }
    } catch (error) {
      console.error("Failed to log out user", error);
      Toast.show({
        type: "error",
        text1: "Failed to log out user.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <User />
          <Text style={styles.title}>My Profile</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Adam</Text>
          <Text style={styles.textSubtitle}>@adamschon</Text>
        </View>

        <Button onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </Button>
      </View>
    </View>
  );
};

export default UserProfile;
