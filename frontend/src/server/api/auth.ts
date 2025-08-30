import kdebug from "@/src/utils/kdebug";
import makeRequest from "../make-request";

type SignUpProps = { data: { username: string; first_name: string; password: string } };

export async function signUpUser({ data: values }: SignUpProps) {
  try {
    const data = await makeRequest(`/register`, "POST", values);

    return data;
  } catch (error) {
    kdebug("Request error: ", error);
    return { error: (error as Error)?.message };
  }
}

type LogInProps = { data: { username: string; password: string } };

export async function logInUser({ data: values }: LogInProps) {
  try {
    const data = await makeRequest(`/token-auth`, "POST", values);

    return data;
  } catch (error) {
    kdebug("Request error: ", error);
    return { error: (error as Error)?.message };
  }
}
