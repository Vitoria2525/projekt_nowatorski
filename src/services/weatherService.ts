import { API_KEY, BASE_URL } from '../constants';
import type { WeatherData, ForecastData } from '../types';

export const fetchWeather = async (cityName: string): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${cityName},PL&units=metric&appid=${API_KEY}&lang=en`
    );
    if (!response.ok) throw new Error('Weather fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

export const fetchForecast = async (cityName: string): Promise<ForecastData | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${cityName},PL&units=metric&appid=${API_KEY}&lang=en`
    );
    if (!response.ok) throw new Error('Forecast fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return null;
  }
};

export const getWeatherIcon = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degrees / 45) % 8];
};

export const formatTemperature = (temp: number): number => {
  return Math.round(temp);
};