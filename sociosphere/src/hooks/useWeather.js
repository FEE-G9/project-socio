import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const WEATHER_LOCATION = {
  label: "Rajpura, Punjab, India",
  latitude: 30.4846,
  longitude: 76.5941,
};

function mapWmoCode(code) {
  if (code === 0) return { condition: "clear", description: "Clear sky", icon: "☀️" };
  if (code === 1 || code === 2) return { condition: "clouds", description: "Partly cloudy", icon: "🌤️" };
  if (code === 3) return { condition: "clouds", description: "Overcast", icon: "⛅" };
  if (code === 45 || code === 48) return { condition: "mist", description: "Foggy", icon: "🌫️" };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { condition: "rain", description: "Rain showers", icon: "🌧️" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: "snow", description: "Snow", icon: "❄️" };
  if ([95, 96, 99].includes(code)) return { condition: "thunderstorm", description: "Thunderstorm", icon: "⛈️" };
  return { condition: "clear", description: "Clear sky", icon: "☀️" };
}

const FALLBACK_WEATHER = {
  temp: 26,
  condition: "clear",
  description: "Clear sky",
  icon: "☀️",
  humidity: 48,
  windSpeed: 9,
  pressure: 1013,
  cloudCoverage: 10,
  loading: false,
  error: null,
};

/**
 * Returns current conditions and weather details for the home weather card & inline header.
 * Automatically tries OpenWeatherMap first, falls back to free Open-Meteo, and provides instant fallback.
 */
export function useWeather() {
  const [weather, setWeather] = useState(() => {
    const cacheKey = `sociosphere_weather_${WEATHER_LOCATION.label.toLowerCase()}`;
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey));
      if (cached && Date.now() - cached.ts < CACHE_TTL && cached.data) {
        return { ...cached.data, loading: false, error: null };
      }
    } catch { /* ignore */ }
    return { ...FALLBACK_WEATHER, loading: true };
  });

  useEffect(() => {
    let isMounted = true;
    const cacheKey = `sociosphere_weather_${WEATHER_LOCATION.label.toLowerCase()}`;

    // Helper to fetch from zero-key Open-Meteo API
    const fetchOpenMeteo = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LOCATION.latitude}&longitude=${WEATHER_LOCATION.longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,surface_pressure,cloud_cover`
        );
        if (!res.ok) throw new Error("open-meteo-failed");
        const data = await res.json();
        const current = data.current || {};
        const meta = mapWmoCode(current.weather_code ?? 0);

        const result = {
          temp: Math.round(current.temperature_2m ?? 26),
          condition: meta.condition,
          description: meta.description,
          icon: meta.icon,
          humidity: current.relative_humidity_2m ?? 48,
          windSpeed: Math.round(current.wind_speed_10m ?? 8),
          pressure: Math.round(current.surface_pressure ?? 1013),
          cloudCoverage: current.cloud_cover ?? 10,
          loading: false,
          error: null,
        };

        if (isMounted) {
          setWeather(result);
          sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: result }));
        }
      } catch (err) {
        if (isMounted) {
          setWeather((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    // Try OpenWeatherMap if key is available, otherwise directly use Open-Meteo
    if (API_KEY && API_KEY !== "your_openweathermap_api_key_here") {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${WEATHER_LOCATION.latitude}&lon=${WEATHER_LOCATION.longitude}&units=metric&appid=${API_KEY}`
      )
        .then((res) => {
          if (!res.ok) throw new Error(`openweather-error-${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (!isMounted) return;
          const result = {
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main.toLowerCase(),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: Math.round((data.wind?.speed || 0) * 3.6),
            pressure: data.main.pressure,
            cloudCoverage: data.clouds?.all ?? null,
            loading: false,
            error: null,
          };
          setWeather(result);
          sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: result }));
        })
        .catch(() => {
          // OpenWeatherMap failed, try Open-Meteo fallback
          fetchOpenMeteo();
        });
    } else {
      fetchOpenMeteo();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return weather;
}
