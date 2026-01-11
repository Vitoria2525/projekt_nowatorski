import React from 'react';
import type { WeatherData } from '../types';
import { 
  getWeatherIcon, 
  getWindDirection, 
  formatTemperature 
} from '../services/weatherService';

interface WeatherDetailsProps {
  weather: WeatherData;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather }) => {
  return (
    <div className="current-weather">
      <h2>Current Weather in {weather.name}</h2>
      <div className="current-main">
        <img 
          src={getWeatherIcon(weather.weather[0].icon)} 
          alt={weather.weather[0].description}
          className="main-icon"
        />
        <div className="current-temp">
          <div className="temp-value">
            {formatTemperature(weather.main.temp)}°C
          </div>
          <div className="temp-feels">
            Feels like: {formatTemperature(weather.main.feels_like)}°C
          </div>
        </div>
        <div className="current-description">
          <h3>{weather.weather[0].main}</h3>
          <p>{weather.weather[0].description}</p>
        </div>
      </div>

      <div className="current-details-grid">
        <div className="detail-card">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weather.main.humidity}%</span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{weather.main.pressure} hPa</span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Wind</span>
          <span className="detail-value">
            {Math.round(weather.wind.speed)} m/s
            <span className="wind-direction">
              ({getWindDirection(weather.wind.deg)})
            </span>
          </span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Cloudiness</span>
          <span className="detail-value">{weather.clouds.all}%</span>
        </div>
        {weather.rain && (
          <div className="detail-card">
            <span className="detail-label">Rain (3h)</span>
            <span className="detail-value">
              {weather.rain?.['3h'] || 0} mm
            </span>
          </div>
        )}
        {weather.snow && (
          <div className="detail-card">
            <span className="detail-label">Snow (3h)</span>
            <span className="detail-value">
              {weather.snow?.['3h'] || 0} mm
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDetails;