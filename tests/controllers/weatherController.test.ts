import { assertEquals } from "jsr:@std/assert";
import { restore, stub } from "jsr:@std/testing/mock";
import { Context } from "npm:hono";
import { getWeatherHandler } from "../../controllers/weatherController.ts";
import weatherService from "../../services/weatherServices.ts";
import { currentWeatherMapper } from "../../mappers/currentWeatherMapper.ts";
import mockWeatherAPIResponse from "../mocks/weatherAPIMock.json" with { type: "json" };

// Mock data
const mockResposneBody = {
  success: true,
  data: currentWeatherMapper(mockWeatherAPIResponse),
  message: "Current weather data fetched successfully",
};

// Helper to create mock Context
function createMockContext(queryValues: Record<string, string> = {}): Context {
  return {
    req: {
      query: () => queryValues,
    },
    json: (obj: unknown, status?: number) => ({
      status: status || 200,
      json: async () => obj,
    }),
  } as unknown as Context;
}

Deno.test("WeatherController - getWeather with custom city from query", async () => {
  // Arrange
  const fetchStub = stub(
    weatherService.prototype,
    "fetchCurrentWeather",
    async () => mockWeatherAPIResponse,
  );
  const mockContext = createMockContext({ name: "Aguascalientes" });

  try {
    // Act
    const result = await getWeatherHandler(mockContext);
    const responseBody = await result.json();
    // Assert
    assertEquals(fetchStub.calls[0].args[0], "Aguascalientes");
    assertEquals(result.status, 200);
    assertEquals(responseBody, mockResposneBody);
  } finally {
    restore();
  }
});

Deno.test("WeatherController - getWeather handles Error objects", async () => {
  // Arrange
  const errorMessage = "API key is invalid";
  const fetchStub = stub(
    weatherService.prototype,
    "fetchCurrentWeather",
    () => Promise.reject(new Error(errorMessage)),
  );
  const mockContext = createMockContext({ name: "Aguascalientes" });

  try {
    // Act
    const result = await getWeatherHandler(mockContext);
    const responseBody = await result.json();
    console.log("Response body:", responseBody);
    // Assert
    assertEquals(result.status, 500);
    assertEquals(responseBody, {
      success: false,
      data: null,
      message: errorMessage,
    });
  } finally {
    restore();
  }
});

Deno.test("WeatherController - getWeather handles non-Error objects", async () => {
  // Arrange
  const fetchStub = stub(
    weatherService.prototype,
    "fetchCurrentWeather",
    () => Promise.reject("Network timeout"),
  );
  const mockContext = createMockContext({ name: "Aguascalientes" });

  try {
    // Act
    const result = await getWeatherHandler(mockContext);
    const responseBody = await result.json();

    // Assert
    assertEquals(result.status, 500);
    assertEquals(responseBody, {
      success: false,
      data: null,
      message: "Failed to fetch weather data",
    });
  } finally {
    restore();
  }
});

Deno.test("WeatherController - getWeather handles empty context", async () => {
  const mockContext = createMockContext();
  try {
    // Act
    const result = await getWeatherHandler(mockContext);
    const responseBody = await result.json();

    // Assert
    assertEquals(result.status, 400);
    assertEquals(responseBody, {
      success: false,
      data: null,
      errors: "name must be a string (was missing)",
      message: "Validation error",
    });
  } finally {
    restore();
  }
});