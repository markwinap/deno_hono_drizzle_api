import { DescribeRouteOptions } from "hono-openapi";

const getWeatherSchema: DescribeRouteOptions = {
  description: "Get weather by location name",
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description: "Indicates if the request was successful",
              },
              data: {
                type: "object",
                description: "Weather data for the specified location",
                properties: {
                  temperature: { type: "string" },
                  weather_code: { type: "string" },
                  weather_icons: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  weather_descriptions: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  wind_speed: { type: "number" },
                  wind_degree: { type: "number" },
                  wind_dir: { type: "string" },
                  pressure: { type: "number" },
                  precip: { type: "number" },
                  humidity: { type: "number" },
                  cloudcover: { type: "number" },
                  feelslike: { type: "string" },
                  uv_index: { type: "number" },
                  visibility: { type: "number" },
                  is_day: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: { type: "object", nullable: true },
              message: { type: "string" },
            },
          },
        },
      },
    }
  },
  parameters: [
    {
      name: "name",
      in: "query",
      description: "Location name to get the weather for",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  tags: ["Weather"],
};

export { getWeatherSchema };
