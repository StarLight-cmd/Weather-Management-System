import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import back from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/back.png';
import humidityIcon from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/humidity.png';
import temp from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/temp.gif';
import windIcon from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/wind.gif';
import './subscriptions.css';
import Banner from '../Banner/Banner';

const API_BASE_URL = 'http://localhost:9090/api/subscriptions';

const getProximityIndex = async (subLat, subLon) => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            resolve('Unknown');
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
                else resolve('󠁣󠁭🟢Far');
            },
            (error) => {
                console.error('Geolocation error:', error);
                resolve('⚫Unknown');
            }
        );
    });
};

const SubscriptionCard = ({ location, onRemove }) => {
    const [data, setData] = useState(null);

    const DisasterAlert = ({ humidity = 0, wind = 0, temperature = 0 }) => {
        let alert = '';

        if (temperature > 35 && humidity < 20) {
            alert = '🔥🥵 Heatwave Risk';
            localStorage.setItem("weatherAlert", alert);
        } else if (humidity > 90 && temperature > 25) {
            alert = '⛈️ Flood Risk';
            localStorage.setItem("weatherAlert", alert);
        } else if (wind >= 20) {
            alert = '🌬️🍃🌀 High Wind / Storm Risk';
            localStorage.setItem("weatherAlert", alert);
        } else if (temperature < 0) {
            alert = '🥶🧊 Frost or Snow Risk';
            localStorage.setItem("weatherAlert", alert);
        } else {
            alert = '✔️ All good!';
            localStorage.setItem("weatherAlert", alert);
        }

        return alert;
    };

    useEffect(() => {
        const fetchLatLon = async () => {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`);
            const result = await response.json();
            if (result.results && result.results.length > 0) {
                return {
                    lat: result.results[0].latitude,
                    lon: result.results[0].longitude,
                };
            }
            throw new Error("Location not found");
        };

        const fetchWeather = async () => {
            try {
                const { lat, lon } = await fetchLatLon();
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`);
                const weather = await response.json();

                const alert = DisasterAlert({
                    temperature: weather.main.temp,
                    humidity: weather.main.humidity,
                    wind: weather.wind.speed,
                });

                const proximityIndex = await getProximityIndex(lat, lon);

                localStorage.setItem(`weatherAlert-${location}`, alert);

                setData({
                    temp: Math.floor(weather.main.temp),
                    humidity: weather.main.humidity,
                    wind: weather.wind.speed,
                    icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    location: weather.name,
                    proximityIndex: proximityIndex,
                    alertStatus: alert
                });

            } catch (err) {
                console.error('Weather fetch error:', err);
            }
        };

        fetchWeather();
    }, [location]);

    if (!data) return null;

    return (
        <div className="subscription-card">


            <div className="subscription-card-header">
                <span className="remove-icon" onClick={onRemove}>✖</span>
            </div>

            <div className="subscription-card-img">
                <img src={data.icon} alt="weather icon" />
            </div>
            <div className="subscription-card-info">
                <div className='info-local'>{data.location}</div>
                <div className='info'><img src={temp} alt="" className='metric-icon' /><span>{data.temp}°C</span></div>
                <div className='info'><img src={humidityIcon} alt="humidity" className='metric-icon' /> {data.humidity}%</div>
                <div className='info'><img src={windIcon} alt="wind" className='metric-icon' /> <span>{data.wind}</span><span>km/h</span></div>
            </div>
            <div className="subscription-card-status">
                <div><span>Proximity: </span><span>{data.proximityIndex}</span></div>
                <div><span>Alert: </span><span>{data.alertStatus}</span></div>
            </div>
        </div>
    );
};

const Subscriptions = () => {
    const [locationInput, setLocationInput] = useState('');
    const [subscriptions, setSubscriptions] = useState([]);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            console.error('No user ID found in localStorage');
            return;
        }

        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/${userId}`);
                setSubscriptions(response.data.map(sub => sub.location));
            } catch (err) {
                console.error('Error fetching subscriptions:', err);
            }
        };

        fetchSubscriptions();
    }, [userId]);

   const handleAdd = async () => {
    const location = locationInput.trim().toLowerCase();
    if (!userId || !location || subscriptions.includes(location)) return;

    try {
        const response = await axios.post(API_BASE_URL, {
            location,
            userId: Number(userId) //
        });
        setSubscriptions([...subscriptions, response.data.location]);
        setLocationInput('');
    } catch (err) {
        console.error('Error adding subscription:', err);
    }
};

    const handleRemove = async (locationToRemove) => {
        const location = locationToRemove.trim().toLowerCase();
        if (!userId || !location || !subscriptions.includes(location)) return;

        try {
            await axios.delete(`${API_BASE_URL}?userId=${userId}&location=${encodeURIComponent(location)}`);
            setSubscriptions(subscriptions.filter(loc => loc !== location));
        } catch (err) {
            console.error('Error removing subscription:', err);
        }
    };



    const handleBack = () => {
        navigate('/weather', { replace: true });
    };

    return (
        <>
        <Banner/>
        <div className="subscriptions-container">
            
            <h2 className="subscription-header">Location Subscriptions</h2>

            <div className="subscription-input-group">
                <label htmlFor="location-input" style={{ marginRight: '10px', fontWeight: 'bold' }}>Location:</label>
                <input
                    id="location-input"
                    type="text"
                    placeholder="Location"
                    value={locationInput}
                    onChange={e => setLocationInput(e.target.value)}
                    className="subscription-input"
                />
                <button onClick={handleAdd} className="subscription-button">Add</button>
            </div>


            <div className="subscription-list">
                {subscriptions.length === 0 ? (
                    <p>No subscriptions yet.</p>
                ) : (
                    subscriptions.map(location => (
                        <SubscriptionCard
                            key={location}
                            location={location}
                            onRemove={() => handleRemove(location)} // Pass remove handler
                        />
                    ))
                )}
            </div>

        </div>
        </>
    );
};

export default Subscriptions;
