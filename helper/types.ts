export type Leg = {
  mode: string;
  routeShortName?: string;
  distance: number;
  co2: number;
};

export type Itinerary = {
  co2: number;
  distance: number;
  startTime: any;
  endTime: any;
  duration: number;
  legs: Leg[];
};

export type Plan = {
  plan: {
    from: {
      coordinates: [{ lon: number }, { lat: number }];
    };
    to: {
      coordinates: [{ lon: number }, { lat: number }];
    };
    itineraries: Itinerary[];
  };
};
