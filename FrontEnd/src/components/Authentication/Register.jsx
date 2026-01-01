import React, { useState } from 'react';
import axios from 'axios';
import Banner from '../Banner/Banner';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', RePassword: '' });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.RePassword) {
      setShowError(true);
      return;
    }

    try {
      await axios.post("http://localhost:9090/users/register", formData);
      setShowError(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };
  const handleLoginRedirect = () => {
    navigate('/login', { replace: true });
  }

  return (
    <><Banner />  
    <div className="weather-bg">
      <div className="auth-container">
        <img src="/logo.png" alt="Logo" className="auth-logo" />
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} required />
          <input type="password" name="RePassword" placeholder="Re-enter Password" onChange={handleChange} value={formData.RePassword} required />
          {showError && (
            <div className="warning-label">
              <label>Passwords donot match.</label>
            </div>
          )}
          <br />
          <button type="submit" className="register-button">Register</button>
          <button type="button" onClick={handleLoginRedirect} data-testid="login-button">Login</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default Register;
