import kdebug from "@/src/utils/kdebug";
import makeRequest from "../make-request";

export async function getTrainLocations() {
  try {
    const data = await makeRequest(`/request-locations`, "POST");

    return data;
  } catch (error) {
    kdebug("Request error: ", error);
    return { error: (error as Error)?.message };
  }
}
