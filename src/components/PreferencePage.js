// src/components/PreferencesPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const PreferencesPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const username = query.get('user');
    const token = query.get('token');

    // Example token verification logic
    const isTokenValid = (token) => {
        return token === btoa(username + 'secretKey'); // Match token generation logic
    };

    return (
        <div>
            {isTokenValid(token) ? (
                <h2>Welcome back, {username}! Here are your preferences:</h2>
                // Include your preferences form here
            ) : (
                <h2>Access Denied: Invalid Token</h2>
            )}
        </div>
    );
};

export default PreferencesPage;
