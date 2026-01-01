import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import Banner from '../Banner/Banner';
import lock from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/assets/lock.gif'

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      await axios.post("http://localhost:9090/users/reset-password", formData);
      navigate("/login", { replace: true });

    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert("User not found. Redirecting to registration...");
        navigate('/register');
      } else {
        alert("Login failed.");
      }
    }
  };

  const back = () => {
    navigate('/login', { replace: true });
  }

  return (
    <><Banner />
      <div className="weather-bg">
        <div className="auth-container">
          <img src="/logo.png" alt="Logo" className="auth-logo" />
          <div className="auth-form">
            <h2 className='lock'>Reset Password <img src={lock} alt="" /></h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your registered email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                placeholder="Enter new password"
                name="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <button type="submit">Reset Password</button>
              <p className="forgot-password" onClick={back}>Back</p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
