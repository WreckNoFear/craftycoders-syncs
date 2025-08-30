import kdebug from "@/src/utils/kdebug";
import makeRequest from "../make-request";

export async function getTrainLocations() {
  try {
    const data = await makeRequest("/request-locations", "GET");

    return data;
  } catch (error) {
    kdebug("Request error: ", error);
    return { error: (error as Error)?.message };
  }
}

type SearchTripProps = { data: { start_id: string; end_id: string } };

export async function getTripsByLocation({ data: values }: SearchTripProps) {
  try {
    const data = await makeRequest("/trip-search", "POST", values);

    return data;
  } catch (error) {
    kdebug("Request error: ", error);
    return { error: (error as Error)?.message };
  }
}
