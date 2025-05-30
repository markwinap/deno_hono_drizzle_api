import { WeatherAPIResponse } from '../models/weatherModel.ts';

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