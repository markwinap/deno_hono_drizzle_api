import { WeatherAPIResponse } from "../models/weatherModel.ts";

export class WeatherService {
    private accessKey: string;

    constructor(accessKey?: string) {
        // Allow overriding via constructor for testing, otherwise read from env
        this.accessKey = accessKey ?? Deno.env.get("WEATHER_API_KEY")!;
    }

    public async fetchCurrentWeather(query: string): Promise<WeatherAPIResponse> {
        const url = `http://api.weatherstack.com/current?access_key=${this.accessKey}&query=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching weather data: ${response.statusText}`);
            }
            const data = (await response.json()) as WeatherAPIResponse;
            return data;
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
            throw error;
        }
    }
}

export default WeatherService; 