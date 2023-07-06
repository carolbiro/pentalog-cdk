import { handler } from "../lambda"; // Replace with the actual path to your Lambda function file

const today = new Date(); // Get today's date
const nextWeek = new Date(); // Create a new Date object
nextWeek.setDate(today.getDate() + 7); // Add 7 days to today's date
const formattedNextWeek = `${nextWeek.getDate()}-${nextWeek.getMonth() + 1}-${nextWeek.getFullYear()}`;
const queryStringParameters = {
  from: "60.148156622692035, 24.987887975719225",
  to: "60.200309580474354, 25.15206098556519",
  date: formattedNextWeek,
};

describe("Lambda Function Tests", () => {
  test("should return a valid response when valid query parameters are provided", async () => {
    const event: any = { queryStringParameters };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();

    const responseBody = JSON.parse(result.body);

    expect(responseBody).toHaveProperty("plan");
    expect(responseBody.plan.from).toBeDefined();
    expect(responseBody.plan.to).toBeDefined();
    expect(responseBody.plan.itineraries).toBeDefined();
    // Add more assertions as needed
  });

  test("should return an error response when invalid query parameters are provided", async () => {
    const event: any = {
      queryStringParameters: {
        // Missing required query parameters
      },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBeDefined();

    const responseBody = JSON.parse(result.body);
    expect(responseBody).toHaveProperty("error");
  });

  test("should return a valid response with CO2 values when valid query parameters are provided", async () => {
    const event: any = {
      queryStringParameters,
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();

    const responseBody = JSON.parse(result.body);

    expect(responseBody).toHaveProperty("plan");
    expect(responseBody.plan.itineraries).toBeDefined();

    // Validate CO2 values for each leg in the itineraries
    const itineraries = responseBody.plan.itineraries;
    itineraries.forEach((itinerary: any) => {
      expect(itinerary.legs).toBeDefined();
      itinerary.legs.forEach((leg: any) => {
        expect(leg.co2).toBeDefined();
        expect(typeof leg.co2).toBe("number");
      });
    });
  });
  // Add more tests as needed
});
