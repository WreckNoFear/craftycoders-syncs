export default async function makeRequest(url: string, method: RequestInit['method'] = 'GET', body: Record<string, any> | null = null) {
  try {
    let requestOptions: RequestInit = {
      method,
      headers: {
        // Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL!}/api${url}/`, requestOptions);
  
    if (!response.ok) {
      const res = await response.json();
      throw new Error(res?.message);
    }

    return response.json();
  } catch (error) {
    console.log('Request error: ', error);
    throw error;
  }
}
