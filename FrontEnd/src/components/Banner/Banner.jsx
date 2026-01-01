import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const location_subs = () => {
        navigate("/subscriptions");
    };

    const weather = () => {
        navigate("/weather");
    };

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    const hideLogoutRoutes = ["/login", "/register", "/forgot-password"];
    const showLinkRoutes = ["/weather"];
    //sub-weather
    const showLinkRoute = ["/subscriptions"];
    return (
        <div className="top-banner">
            <div className="left-section">
                <div className="logo">
                    <img className="logo-img" src="/logo.png" alt="Baobab Logo" />
                </div>
                <div className="nav-links">
                    {showLinkRoutes.includes(location.pathname) && (
                        <p className="location_subs" onClick={location_subs}>Location subscriptions</p>
                    )}
                    {showLinkRoute.includes(location.pathname) && (
                        <p className="location_subs" onClick={weather}>Weather Dashboard</p>
                    )}
                </div>
            </div>

            {!hideLogoutRoutes.includes(location.pathname) && (
                <button type="button" className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            )}
        </div>

    );
};

export default Banner;
