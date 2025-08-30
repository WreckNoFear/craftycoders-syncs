import * as SecureStore from "expo-secure-store";

export default async function makeRequest(
  url: string,
  method: RequestInit["method"] = "GET",
  body: Record<string, any> | null = null
) {
  try {
    const AUTH_TOKEN = await SecureStore.getItemAsync("AUTH_TOKEN");

    let requestOptions: RequestInit = {
      method,
      headers: {
        Authorization: `Token ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL!}/api${url}/`,
      requestOptions
    );

    if (!response.ok) {
      const res = await response.json();
      throw new Error(res?.message);
    }

    return response.json();
  } catch (error) {
    console.log("Request error: ", error);
    throw error;
  }
}
