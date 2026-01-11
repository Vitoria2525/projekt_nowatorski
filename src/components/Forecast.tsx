import React from 'react';
import type { ForecastData } from '../types';
import { 
  getWeatherIcon, 
  getWindDirection, 
  formatTemperature 
} from '../services/weatherService';

interface ForecastProps {
  forecast: ForecastData;
}

const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  const getDailyForecast = () => {
    const dailyForecast = [];
    const seenDays = new Set();
    
    for (const item of forecast.list) {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (!seenDays.has(day) && dailyForecast.length < 5) {
        seenDays.add(day);
        dailyForecast.push({
          day,
          temp: formatTemperature(item.main.temp),
          conditions: item.weather[0].main,
          icon: item.weather[0].icon,
          precipitation: Math.round(item.pop * 100),
          windSpeed: item.wind.speed,
          windDirection: getWindDirection(item.wind.deg)
        });
      }
    }
    
    return dailyForecast;
  };

  const dailyForecast = getDailyForecast();

  return (
    <div className="forecast-section">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {dailyForecast.map((day, index) => (
          <div key={index} className="forecast-card">
            <div className="forecast-day">{day.day}</div>
            <img 
              src={getWeatherIcon(day.icon)} 
              alt={day.conditions}
              className="forecast-icon"
            />
            <div className="forecast-temp">{day.temp}°C</div>
            <div className="forecast-conditions">{day.conditions}</div>
            <div className="forecast-precipitation">
              <span className="precipitation-label">Precip:</span>
              <span className="precipitation-value">{day.precipitation}%</span>
            </div>
            <div className="forecast-wind">
              <span className="wind-label">Wind:</span>
              <span className="wind-value">
                {Math.round(day.windSpeed)} m/s {day.windDirection}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;