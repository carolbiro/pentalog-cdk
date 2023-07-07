import axios from "axios";
import { APIGatewayEvent } from "aws-lambda";
import { Plan, Itinerary, Leg } from "../helper/types";
import {
  TRIP_PLANNER_BASE_URL,
  CO2_MULTIPLIERS,
  API_KEY,
} from "../helper/utils";

export async function handler(event: APIGatewayEvent) {
  console.log("Event::: ", event);

  try {
    const queryStringParameters = event.queryStringParameters;

    if (!queryStringParameters) {
      throw new Error("No query parameters");
    }

    const { from, to, date } = queryStringParameters;

    if (!from || !to || !date) {
      throw new Error("Invalid query parameters");
    }

    const response = await axios.get(
      `${TRIP_PLANNER_BASE_URL}/plan?fromPlace=${from}&toPlace=${to}&date=${date}&mode=TRANSIT&arriveBy=false&wheelchair=false&showIntermediateStops=true&lo
      cale=en'`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );

    const routePlan = response.data;
    let result: Plan = {
      plan: {
        from: {
          coordinates: [
            { lon: routePlan.plan.from.lon },
            { lat: routePlan.plan.from.lat },
          ],
        },
        to: {
          coordinates: [
            { lon: routePlan.plan.to.lon },
            { lat: routePlan.plan.to.lat },
          ],
        },
        itineraries: [],
      },
    };
    const itineraries = routePlan.plan.itineraries;
    itineraries.map(
      (item: {
        walkDistance: any;
        startTime: any;
        endTime: any;
        duration: any;
        legs: Leg[];
      }) => {
        const itinerary: Itinerary = {
          co2: 0,
          distance: item.walkDistance,
          startTime: item.startTime,
          endTime: item.endTime,
          duration: item.duration,
          legs: [],
        };
        let co2 = 0;
        item.legs.map((leg: Leg) => {
          co2 += CO2_MULTIPLIERS[leg.mode];
          itinerary.legs.push({
            mode: leg.mode,
            distance: leg.distance,
            co2: CO2_MULTIPLIERS[leg.mode],
            routeShortName: leg.routeShortName,
          });
        });
        itinerary.co2 = co2;
        result.plan.itineraries.push(itinerary);
      }
    );

    console.log("Result to return :::: ", JSON.stringify(result));

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    console.log("Error :::: ", JSON.stringify(error));
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
