import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/search.gif';
import wind from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/wind.gif';
import humidity from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/humidity.png';
import DisasterAlert from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/components/Alert/Alert.jsx';
import Banner from '../Banner/Banner';



const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [proximityIndex, setProximityIndex] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [showError, setShowError] = useState(false);


  const fetchLatLon = async (city) => {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
      };
    } else {
      throw new Error("Location not found");
    }
  };

  const getProximityIndex = async (subLat, subLon) => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('⚫Unknown');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          const toRad = (value) => (value * Math.PI) / 180;

          const R = 6371;
          const dLat = toRad(subLat - userLat);
          const dLon = toRad(subLon - userLon);
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(userLat)) *
            Math.cos(toRad(subLat)) *
            Math.sin(dLon / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          if (distance < 50) resolve('🔴Near');
          else if (distance < 200) resolve('🔵Moderate');
          else resolve('🟢Far');
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve('⚫Unknown');
        }
      );
    });
  };

  const Search = async (city) => {
    try {
      setShowWarning(false);
      setShowError(false);

      if (!city.trim()) {
        setShowWarning(true);
        return;
      }

      const { lat, lon } = await fetchLatLon(city);
      const proximity = await getProximityIndex(lat, lon);
      setProximityIndex(proximity);

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      setWeatherData({
        humidity: data.main.humidity,
        wind: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        lat,
        lon,
      });
    } catch (error) {
      setWeatherData(null);
      setProximityIndex('');
      setShowError(true);
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const proximity = await getProximityIndex(lat, lon);
        setProximityIndex(proximity);

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
        const response = await fetch(url);
        const data = await response.json();

        setWeatherData({
          humidity: data.main.humidity,
          wind: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          lat,
          lon,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert(`Geolocation error: ${error.message || "Could not get location"}`);
        Search("Durban");
      }
    );
  }, []);

  return (
    <>
      <Banner />
      <div className="app-container">
        <div className="weather">
          <img src="/logo.png" alt="Logo" className="auth-logo" />
          <div>
            <span className="title">Weather DashBoard</span>
            <br />

            {showWarning && (
              <div className="warning-label">
                <label>Please enter a location.</label>
              </div>
            )}
            <br />
            <div className="search-bar">
              <input ref={inputRef} type="text" placeholder="Search for location" />
              <img src={search} alt="Search" onClick={() => Search(inputRef.current.value)} />
            </div>
            {showError && (
              <div className="warning-label">
                <label>Invalid location.</label>
              </div>
            )}
          </div>

          {weatherData && (
            <>
              <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />

              <p className="tempreature">{weatherData.temperature}°C</p>

              <p className="location">{weatherData.location}</p>

              <div className="proximity-box">
                <p>Proximity: {proximityIndex}</p>
              </div>

              <div className="weather-data">
                <div className="col">
                  <img src={humidity} alt="Humidity" />
                  <div>
                    <p>{weatherData.humidity}%</p>
                    <span>Humidity</span>
                  </div>
                </div>
                <div className="col">
                  <img src={wind} alt="Wind" />
                  <div>
                    <p>{weatherData.wind} Km/H</p>
                    <span>Wind Speed</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>



        {weatherData && (
          <DisasterAlert
            humidity={weatherData.humidity}
            wind={weatherData.wind}
            temperature={weatherData.temperature}
            lat={weatherData.lat}
            lon={weatherData.lon}
          />
        )}
      </div>

    </>
  );
};

export default Weather;
