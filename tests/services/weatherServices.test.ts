import weatherService from "../../services/weatherServices.ts";
import { assertEquals, assertRejects } from "jsr:@std/assert";

// Preserve the original fetch and environment to restore after tests.
const originalFetch = globalThis.fetch;
const originalEnv = Deno.env.get("WEATHER_API_KEY");

// Clean up after each test
function cleanup() {
  globalThis.fetch = originalFetch;
  if (originalEnv) {
    Deno.env.set("WEATHER_API_KEY", originalEnv);
  } else {
    Deno.env.delete("WEATHER_API_KEY");
  }
}

Deno.test("fetchCurrentWeather returns weather data on valid query", async () => {
  // Prepare a fake API response.
  const fakeApiResponse = {
    current: { temperature: 20, weather_descriptions: ["Sunny"] },
  };

  // Stub fetch to return a successful response.
  globalThis.fetch = async (_url: RequestInfo | URL) =>
    new Response(JSON.stringify(fakeApiResponse), { status: 200 });

  // Set a dummy API key.
  Deno.env.set("WEATHER_API_KEY", "test_key");
  const service = new weatherService();

  const result = await service.fetchCurrentWeather("Los Angeles");

  assertEquals(result, fakeApiResponse);

  cleanup();
});

Deno.test("fetchCurrentWeather throws error when response is not ok", async () => {
  // Stub fetch to simulate a non-ok response.
  globalThis.fetch = async (_url: RequestInfo | URL) =>
    new Response("Error", { status: 400, statusText: "Bad Request" });

  // Set the dummy API key.
  Deno.env.set("WEATHER_API_KEY", "test_key");
  const service = new weatherService();

  await assertRejects(
    async () => {
      await service.fetchCurrentWeather("Invalid query");
    },
    Error,
    "Error fetching weather data: Bad Request",
  );

  cleanup();
});

Deno.test("fetchCurrentWeather throws error on network failure", async () => {
  // Stub fetch to simulate a network error.
  globalThis.fetch = async (_url: RequestInfo | URL) => {
    throw new Error("Network failure");
  };

  // Set the dummy API key.
  Deno.env.set("WEATHER_API_KEY", "test_key");
  const service = new weatherService();

  await assertRejects(
    async () => {
      await service.fetchCurrentWeather("Any query");
    },
    Error,
    "Network failure",
  );

  cleanup();
});

Deno.test("fetchCurrentWeather handles missing API key", async () => {
  globalThis.fetch = async (url: RequestInfo | URL) => {
    // Verify that undefined API key is in URL
    const urlStr = url.toString();
    if (urlStr.includes("access_key=undefined")) {
      return new Response("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    return new Response("OK", { status: 200 });
  };
  // Remove API key from environment
  Deno.env.delete("WEATHER_API_KEY");
  const service = new weatherService();

  await assertRejects(
    async () => {
      await service.fetchCurrentWeather("Los Angeles");
    },
    Error,
    "Error fetching weather data: Unauthorized",
  );

  cleanup();
});

Deno.test("fetchCurrentWeather handles special characters in query", async () => {
  const fakeApiResponse = {
    current: { temperature: 15, weather_descriptions: ["Cloudy"] },
  };

  globalThis.fetch = async (url: RequestInfo | URL) => {
    // Verify query is properly encoded
    const urlStr = url.toString();
    if (urlStr.includes("query=New%20York%2C%20NY")) {
      return new Response(JSON.stringify(fakeApiResponse), { status: 200 });
    }
    return new Response("Bad Request", { status: 400 });
  };

  Deno.env.set("WEATHER_API_KEY", "test_key");
  const service = new weatherService();

  const result = await service.fetchCurrentWeather("New York, NY");
  assertEquals(result, fakeApiResponse);

  cleanup();
});

Deno.test("fetchCurrentWeather handles invalid JSON response", async () => {
  globalThis.fetch = async (_url: RequestInfo | URL) =>
    new Response("Invalid JSON{", { status: 200 });

  Deno.env.set("WEATHER_API_KEY", "test_key");
  const service = new weatherService();

  await assertRejects(
    async () => {
      await service.fetchCurrentWeather("Los Angeles");
    },
    SyntaxError,
  );

  cleanup();
});

Deno.test("fetchCurrentWeather handles 500 server error", async () => {
  globalThis.fetch = async (_url: RequestInfo | URL) =>
    new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });

  Deno.env.set("WEATHER_API_KEY", "test_key");
  const service = new weatherService();

  await assertRejects(
    async () => {
      await service.fetchCurrentWeather("Los Angeles");
    },
    Error,
    "Error fetching weather data: Internal Server Error",
  );

  cleanup();
});

Deno.test("fetchCurrentWeather constructs correct URL", async () => {
  let capturedUrl: string = "";
  const fakeApiResponse = {
    current: { temperature: 25, weather_descriptions: ["Hot"] },
  };

  globalThis.fetch = async (url: RequestInfo | URL) => {
    capturedUrl = url.toString();
    return new Response(JSON.stringify(fakeApiResponse), { status: 200 });
  };

  Deno.env.set("WEATHER_API_KEY", "my_test_key");
  const service = new weatherService();

  await service.fetchCurrentWeather("Tokyo");

  assertEquals(
    capturedUrl,
    "http://api.weatherstack.com/current?access_key=my_test_key&query=Tokyo",
  );

  cleanup();
});

Deno.test("fetchCurrentWeather throws error on network failure", async () => {
  // Stub fetch to simulate a network error.
  globalThis.fetch = async (_url: RequestInfo | URL) => {
    throw new Error("Network failure");
  };

  // Set the dummy API key.
  Deno.env.set("WEATHER_API_KEY", "test_key");
  const service = new weatherService();

  await assertRejects(
    async () => {
      await service.fetchCurrentWeather("Any query");
    },
    Error,
    "Network failure",
  );

  // Restore original fetch.
  globalThis.fetch = originalFetch;
});
