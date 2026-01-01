import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Banner from '../Banner/Banner';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/components/Dashboard/Weather.css';
import wind from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/wind.gif';
import humidity from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/humidity.png';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [proximityIndex, setProximityIndex] = useState('');
  const [highlightLogin, setHighlightLogin] = useState(false);

  const focusLoginForm = () => {
    setHighlightLogin(true);
    setTimeout(() => setHighlightLogin(false), 3000);
  };



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (email) {
      navigate("/weather", { replace: true });
    }
  }, []);


  const checkAdminStatus = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:9090/users/is-admin/${userId}`);
      return res.data;
    } catch (err) {
      console.error('Failed to check admin status', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post("http://localhost:9090/users/login", formData);
      console.log("Login response data:", response.data);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("userId", response.data.id);

      const isAdmin = await checkAdminStatus(response.data.id);
      localStorage.setItem("userRole", isAdmin ? "ADMIN" : "USER");

      if (isAdmin) {
        navigate("/Country", { replace: true });
        console.log("Is admin:", isAdmin);
      } else {
        navigate("/weather", { replace: true });
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert("User not found. Redirecting to registration...");
        navigate('/register');
      } else {
        console.log("Login error:", err);
        alert("Login failed.");
      }
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

  const handleRegisterRedirect = () => {
    navigate('/register');
  }

  const ForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <><Banner />
      <div className="weather-bg">

        <div className="auth-wrapper">

          <div className="weather-container">

            <button className="alert-button" onClick={focusLoginForm}>
              Get Alert and Emergency Info
            </button>

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


          <div className={`auth-container ${highlightLogin ? 'highlight' : ''}`}>

            <img src="/logo.png" alt="Logo" className="auth-logo" />
            <form onSubmit={handleSubmit} className="auth-form">
              <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} required />
              <button type="submit">Login</button>
              <p className="forgot-password" onClick={ForgotPassword}>Forgot Password?</p>
              <button type="button" onClick={handleRegisterRedirect}>Register</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
