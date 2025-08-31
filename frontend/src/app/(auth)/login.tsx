import { Text, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "react-native-gesture-handler";
import Button from "@/src/components/button";
import { logInUser } from "@/src/server/api/auth";
import Toast from "react-native-toast-message";
import Logo from "@/src/components/logo";
import { Link, router } from "expo-router";
import { styles } from "@/src/styles/css/auth";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  password: z
    .string()
    .min(10, { message: "Password must be at least 10 characters long" })
    .max(64, { message: "Password must not exceed 64 characters" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one symbol",
    })
    .regex(/\d/, { message: "Password must contain at least one number" }),
});

export default function Login() {
  useEffect(() => {
    const checkIsAuthenticated = async () => {
      try {
        const AUTH_TOKEN = await SecureStore.getItemAsync("AUTH_TOKEN");

        if (AUTH_TOKEN) {
          router.push("/(tabs)");
        }
      } catch (error) {
        console.error("Failed to check if user is authenticated");
        Toast.show({
          type: "error",
          text1: "Failed to check if user is authenticated",
        });
      }
    };

    checkIsAuthenticated();
  }, []);

  const { handleSubmit, formState, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { error, token } = await logInUser({ data });

      if (error || !token) throw error;

      await SecureStore.setItemAsync("AUTH_TOKEN", token);
      await AsyncStorage.setItem("USERNAME", data?.username);

      Toast.show({
        type: "success",
        text1: "Successfully logged in",
      });

      router.push("/(tabs)");
    } catch (error) {
      console.error("Failed to login up: ", error);
      Toast.show({
        type: "error",
        text1: "Failed to login user",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Logo />
      </View>

      <Text style={styles.title}>Log In</Text>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Username</Text>
          <Controller
            control={form.control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter a username"
              />
            )}
          />
          {formState.errors.username && (
            <Text style={styles.error}>
              {formState.errors.username?.message}
            </Text>
          )}
        </View>
        <View>
          <Text style={styles.label}>Password</Text>
          <Controller
            control={form.control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                textContentType="password"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter a password"
              />
            )}
          />
          {formState.errors.password && (
            <Text style={styles.error}>
              {formState.errors.password?.message}
            </Text>
          )}
        </View>

        <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </Button>
      </View>

      <Link href="/(auth)/sign-up" style={styles.smallLink}>
        Don't have an account? Sign Up
      </Link>
    </View>
  );
}
