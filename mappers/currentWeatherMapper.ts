import { WeatherAPIResponse } from "../models/weatherModel.ts";

/**
 * Maps the current weather data from the WeatherAPIResponse to a simpler format.
 * @param data - The WeatherAPIResponse object containing current weather data.
 * @return An object containing the mapped current weather data.
 * @example
 * const currentWeather = currentWeatherMapper(weatherData);
 * console.log(currentWeather);
 */
export const currentWeatherMapper = (data: WeatherAPIResponse) => {
  const {
    temperature,
    weather_code,
    weather_icons,
    weather_descriptions,
    wind_speed,
    wind_degree,
    wind_dir,
    pressure,
    precip,
    humidity,
    cloudcover,
    feelslike,
    uv_index,
    visibility,
    is_day,
  } = data.current;
  return {
    temperature,
    weather_code,
    weather_icons,
    weather_descriptions,
    wind_speed,
    wind_degree,
    wind_dir,
    pressure,
    precip,
    humidity,
    cloudcover,
    feelslike,
    uv_index,
    visibility,
    is_day,
  };
};
