export interface City {
  id: number;
  name: string;
  country: string;
}

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  rain?: { '3h': number };
  snow?: { '3h': number };
}

export interface ForecastItem {
  dt: number;
  main: { temp: number };
  weather: { main: string; description: string; icon: string }[];
  pop: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
}

export interface ForecastData {
  list: ForecastItem[];
}