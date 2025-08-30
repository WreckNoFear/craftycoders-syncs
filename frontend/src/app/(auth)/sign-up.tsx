import { Text, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "react-native-gesture-handler";
import Button from "@/src/components/button";
import { signUpUser } from "@/src/server/api/auth";
import Toast from "react-native-toast-message";
import Logo from "@/src/components/logo";
import { Link, router } from "expo-router";
import { styles } from "@/src/styles/css/auth";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  firstName: z.string().min(1, {
    message: "First name is required",
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

export default function SignUp() {
  const { handleSubmit, formState, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await signUpUser({ data });

      Toast.show({
        type: "success",
        text1: "Successfully signed up",
      });

      router.push("/(tabs)");
    } catch (error) {
      console.error("Failed to sign up: ", error);
      Toast.show({
        type: "error",
        text1: "Failed to sign up user",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Logo />

      <Text style={styles.title}>Sign Up</Text>

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
          <Text style={styles.label}>First Name</Text>
          <Controller
            control={form.control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter a first name"
              />
            )}
          />
          {formState.errors.firstName && (
            <Text style={styles.error}>
              {formState.errors.firstName?.message}
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

      <Link href="/(auth)/login" style={styles.smallLink}>
        or Log In
      </Link>
    </View>
  );
}
