import { Context } from "npm:hono";
import weatherService from "../services/weatherServices.ts";
import { currentWeatherMapper } from "../mappers/currentWeatherMapper.ts";
import { queryValidator } from "../validators/weatherValidators.ts";
import { type } from "arktype";

const getWeatherHandler = async (c: Context) => {
  try {
    const params = queryValidator(c.req.query());
    console.log("Received parameters:", c.req.query());
    //console.log("Validated parameters:", params);
    if (params instanceof type.errors) {
      return c.json({
        success: false,
        data: null,
        message: "Validation error",
        errors: params.summary,
      }, 400);
    }
    const { name } = params;
    const servive = new weatherService();
    const currentWeather = await servive.fetchCurrentWeather(name);

    return c.json({
      success: true,
      data: currentWeatherMapper(currentWeather),
      message: "Current weather data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return c.json({
      success: false,
      data: null,
      message: error instanceof Error
        ? error.message
        : "Failed to fetch weather data",
    }, 500);
  }
};

export { getWeatherHandler };
