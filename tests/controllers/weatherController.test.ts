import { assertEquals } from "jsr:@std/assert";
import { restore, stub } from "jsr:@std/testing/mock";
import { Context } from "hono";
import { WeatherController } from "../../controllers/weatherController.ts";
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
      query: (key: string) => queryValues[key],
    },
    json: (obj: unknown, status?: number) => ({
      status: status || 200,
      json: async () => obj,
    }),
  } as unknown as Context;
}

Deno.test("WeatherController - getWeather with default city (Aguascalientes)", async () => {
  // Arrange
  const fetchStub = stub(
    weatherService.prototype,
    "fetchCurrentWeather",
    async () => mockWeatherAPIResponse,
  );
  const controller = new WeatherController();
  const mockContext = createMockContext();
  try {
    // Act
    const result = await controller.getWeather(mockContext);
    const responseBody = await result.json();
    // Assert
    assertEquals(fetchStub.calls[0].args[0], "Aguascalientes");
    assertEquals(result.status, 200);
    assertEquals(responseBody, mockResposneBody);
  } finally {
    restore();
  }
});
Deno.test("WeatherController - getWeather with custom city from query", async () => {
  // Arrange
  const fetchStub = stub(
    weatherService.prototype,
    "fetchCurrentWeather",
    async () => mockWeatherAPIResponse,
  );

  const controller = new WeatherController();
  const mockContext = createMockContext({ name: "Paris" });

  try {
    // Act
    const result = await controller.getWeather(mockContext);
    const responseBody = await result.json();
    // Assert
    assertEquals(fetchStub.calls[0].args[0], "Paris");
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

  const controller = new WeatherController();
  const mockContext = createMockContext();

  try {
    // Act
    const result = await controller.getWeather(mockContext);
    const responseBody = await result.json();
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

  const controller = new WeatherController();
  const mockContext = createMockContext();

  try {
    // Act
    const result = await controller.getWeather(mockContext);
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

Deno.test("WeatherController - getWeather with empty query parameter falls back to Aguascalientes", async () => {
  // Arrange
  const fetchStub = stub(
    weatherService.prototype,
    "fetchCurrentWeather",
    () => Promise.resolve(mockWeatherAPIResponse),
  );

  const controller = new WeatherController();
  const mockContext = createMockContext({ name: "" });

  try {
    // Act
    const result = await controller.getWeather(mockContext);
    const responseBody = await result.json()

    // Assert
    assertEquals(fetchStub.calls[0].args[0], "Aguascalientes");
    assertEquals(result.status, 200);
  } finally {
    restore();
  }
});
