export type Trip = {
  arrival_time: string;
  departure_time: string;
  travel_time: number;
  legs: {
    transport: string;
    trip_id: string;
    origin: {
      latitude: number;
      longitude: number;
    };
    path: {
      latitude: number;
      longitude: number;
    }[];
  }[];
};

export type Point = { latitude: number; longitude: number };
