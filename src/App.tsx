import { useState, useCallback, useMemo, useEffect } from 'react';
import './App.css';
import CityCard from './components/CityCard';
import WeatherDetails from './components/WeatherDetails';
import Forecast from './components/Forecast';
import SearchBar from './components/SearchBar';
import { cities } from './constants';
import { fetchWeather, fetchForecast } from './services/weatherService';
import type { City, WeatherData, ForecastData } from './types/index';

function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<{[key: string]: WeatherData}>({});
  const [forecastData, setForecastData] = useState<{[key: string]: ForecastData}>({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCitiesCount, setVisibleCitiesCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('weather_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  });

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    return cities.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const citiesToShow = useMemo(() => {
    if (searchQuery.trim()) {
      return filteredCities;
    }
    return filteredCities.slice(0, visibleCitiesCount);
  }, [filteredCities, visibleCitiesCount, searchQuery]);

  const hasMoreCities = !searchQuery.trim() && visibleCitiesCount < filteredCities.length;

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      const citiesToFetch = cities.slice(0, 20);
      const weatherPromises = citiesToFetch.map(city => fetchWeather(city.name));
      const forecastPromises = citiesToFetch.map(city => fetchForecast(city.name));
      
      try {
        const weatherResults = await Promise.all(weatherPromises);
        const forecastResults = await Promise.all(forecastPromises);
        
        const weatherMap: {[key: string]: WeatherData} = {};
        const forecastMap: {[key: string]: ForecastData} = {};
        
        citiesToFetch.forEach((city, index) => {
          if (weatherResults[index]) {
            weatherMap[city.name] = weatherResults[index];
          }
          if (forecastResults[index]) {
            forecastMap[city.name] = forecastResults[index];
          }
        });
        
        setWeatherData(weatherMap);
        setForecastData(forecastMap);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('weather_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const handleCitySelect = useCallback((city: City) => {
    setSelectedCity(city);
  }, []);

  const toggleFavorite = useCallback((cityId: number) => {
    setFavorites(prev => {
      if (prev.includes(cityId)) {
        return prev.filter(id => id !== cityId);
      } else {
        return [...prev, cityId];
      }
    });
  }, []);

  const loadMoreCities = useCallback(async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setVisibleCitiesCount(prev => prev + 8);
    setIsLoadingMore(false);
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Weather Forecast for Poland</h1>
        <p className="subtitle">Select a city to see details</p>
        
        {}
        <div className="search-container">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
          />
          {!searchQuery && (
            <p className="cities-count">
              Showing {citiesToShow.length} of {cities.length} cities
            </p>
          )}
        </div>
      </header>

      <div className="container">
        {}
        {favorites.length > 0 && (
          <div className="favorites-section">
            <h3>⭐ Favorite Cities ({favorites.length})</h3>
            <div className="favorites-list">
              {cities
                .filter(city => favorites.includes(city.id))
                .map(city => {
                  const weather = weatherData[city.name];
                  return (
                    <div 
                      key={city.id} 
                      className="favorite-city"
                      onClick={() => handleCitySelect(city)}
                    >
                      <span className="favorite-city-name">{city.name}</span>
                      {weather && (
                        <span className="favorite-city-temp">
                          {Math.round(weather.main.temp)}°C
                        </span>
                      )}
                      <button 
                        className="remove-favorite-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(city.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {}
        <div className="cities-grid">
          {citiesToShow.length > 0 ? (
            citiesToShow.map(city => (
              <CityCard
                key={city.id}
                city={city}
                weather={weatherData[city.name]}
                isSelected={selectedCity?.id === city.id}
                isFavorite={favorites.includes(city.id)}
                onSelect={handleCitySelect}
                onToggleFavorite={() => toggleFavorite(city.id)}
              />
            ))
          ) : (
            <div className="no-results">
              <p>No cities found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {}
        {hasMoreCities && (
          <div className="load-more-container">
            <button 
              className="load-more-btn"
              onClick={loadMoreCities}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading...' : 'Show more cities'}
            </button>
          </div>
        )}

        {}
        {selectedCity && weatherData[selectedCity.name] && (
          <div className="weather-details-panel">
            <WeatherDetails weather={weatherData[selectedCity.name]} />
            
            {forecastData[selectedCity.name] && (
              <Forecast forecast={forecastData[selectedCity.name]} />
            )}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Weather data from OpenWeatherMap</p>
        <p>© {new Date().getFullYear()} Weather Forecast PL</p>
      </footer>
    </div>
  );
}

export default App;