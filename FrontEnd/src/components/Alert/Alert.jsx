import React, { useEffect, useState } from 'react';
import welcome from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/welcome.png';
import 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/components/Dashboard/Weather.jsx';
import 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/components/Country/Country.jsx';
import './Alert.css';
import { useNavigate } from 'react-router-dom';

const DisasterAlert = ({ humidity = 0, wind = 0, temperature = 0 }) => {
  const email = localStorage.getItem("userEmail");
  const name = email ? email.split("@")[0] : "Guest";
  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState('');
  const [emergencyNumbers, setEmergencyNumbers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country) {
          setCountryCode(data.country);
          fetchEmergencyNumbers(data.country);
        } else {
          setCountryCode('Unknown');
          setLoading(false);
        }
      })
      .catch(() => {
        setCountryCode('Unknown');
        setLoading(false);
      });
  }, []);

  const fetchEmergencyNumbers = async (code) => {
    try {
      const res = await fetch(`http://localhost:9090/countries/${code}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setEmergencyNumbers(data);
    } catch (err) {
      console.error('Error fetching emergency numbers:', err);
      setEmergencyNumbers(null);
    } finally {
      setLoading(false);
    }
  };

  let alert = '';
  let tips = [];

  if (temperature > 35 && humidity < 20) {
    alert = '🔥🥵 Heatwave Risk';
    localStorage.setItem("weatherAlert", alert);
    tips = [
      'Stay hydrated and avoid outdoor activities.',
      'Keep curtains closed and use fans or AC.',
      'Check on elderly or vulnerable people.',
    ];
  } else if (humidity > 90 && temperature > 25) {
    alert = '⛈️ Flood Risk';
    localStorage.setItem("weatherAlert", alert);
    tips = [
      'Avoid low-lying areas and stay indoors.',
      'Unplug electrical appliances.',
      'Keep emergency supplies (blowup rafts, water pumps, food) ready.',
    ];
  } else if (wind >= 20) {
    alert = '🌬️🍃🌀 High Wind / Storm Risk';
    localStorage.setItem("weatherAlert", alert);
    tips = [
      'Secure outdoor items and stay away from windows.',
      'Avoid driving unless necessary.',
      'Charge your devices and keep flashlights ready.',
    ];
  } else if (temperature < 0) {
    alert = '🥶🧊 Frost or Snow Risk';
    localStorage.setItem("weatherAlert", alert);
    tips = [
      'Dress in layers and avoid icy roads.',
      'Ensure vehicles have snow tires.',
      'Protect pipes from freezing.',
      'Keep pets indoors.',
    ];
  } else {
    alert = '✔️ No immediate natural disaster risk';
    localStorage.setItem("weatherAlert", alert);
    tips = ['Stay informed and monitor weather updates.'];
  }

  const handleSubRedirect = () => {
    navigate('/subscriptions', { replace: true });
  };

  return (
    <div className="info-panel">
      <h1 className="greeting">
        Hi {name} <img src={welcome} alt="welcome" />
      </h1>

      <p>🌍 Country Code: <strong>{countryCode || 'Unknown'}</strong></p>

      <div className="alert-box">
        <h2>Disaster Alert</h2>
        <p><strong>{alert}</strong></p>
        <ul>
          {tips.map((tip, index) => (
            <li key={index}>✔️ {tip}</li>
          ))}
        </ul>
      </div>
      <br />

      <div className="emergency-box">
        <h3>📞 Emergency Numbers</h3>
        {loading ? (
          <p>Loading emergency contacts...</p>
        ) : emergencyNumbers ? (
          <div className="emergency-numbers">
            <p><strong>Police:</strong> {emergencyNumbers.policeNo}</p>
            <p><strong>Fire Dept:</strong> {emergencyNumbers.firedepNo}</p>
            <p><strong>Ambulance:</strong> {emergencyNumbers.ambulanceNo}</p>
          </div>
        ) : (
          <p>No emergency contact info available for {countryCode}</p>
        )}
      </div>
      <br />

    </div>
  );
};

export default DisasterAlert;
