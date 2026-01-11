import React from 'react';
import FavoriteButton from './FavoriteButton';
import  type { City, WeatherData } from '../types';
import { getWeatherIcon, formatTemperature } from '../services/weatherService';

interface CityCardProps {
  city: City;
  weather?: WeatherData;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (city: City) => void;
  onToggleFavorite: (cityId: number) => void;
}

const CityCard: React.FC<CityCardProps> = ({
  city,
  weather,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite
}) => {
  return (
    <div
      className={`city-card ${isSelected ? 'selected' : ''} ${isFavorite ? 'favorite' : ''}`}
      onClick={() => onSelect(city)}
    >
      <div className="city-card-header">
        <h3>{city.name}</h3>
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={() => onToggleFavorite(city.id)}
        />
      </div>
      
      {weather ? (
        <>
          <div className="weather-main">
            <img 
              src={getWeatherIcon(weather.weather[0].icon)} 
              alt={weather.weather[0].description}
            />
            <div className="temperature">
              {formatTemperature(weather.main.temp)}°C
            </div>
          </div>
          <div className="weather-details">
            <div>{weather.weather[0].description}</div>
            <div>Humidity: {weather.main.humidity}%</div>
            <div>Wind: {Math.round(weather.wind.speed)} m/s</div>
          </div>
        </>
      ) : (
        <div className="no-data">No data available</div>
      )}
    </div>
  );
};

export default CityCard;