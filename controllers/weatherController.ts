import { Context } from "hono";
import weatherService from "../services/weatherServices.ts";
import { currentWeatherMapper } from "../mappers/currentWeatherMapper.ts";

export class WeatherController {
  // GET /weather
  public async getWeather(c: Context) {
    try {
      const name = c.req.query("name") || "Aguascalientes";
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
  }
}

export default new WeatherController();
