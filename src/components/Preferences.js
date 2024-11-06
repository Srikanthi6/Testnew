// src/components/Preferences.js
import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { QRCodeSVG } from 'qrcode.react';

const Preferences = () => {
    const { userPreferences, updatePreferences, currentUser } = useContext(UserContext);
    const [preferences, setPreferences] = useState(userPreferences);
    const [password, setPassword] = useState('');
    const [accessGranted, setAccessGranted] = useState(false);

    // Function to generate a token (for demonstration purposes)
    const generateToken = (user) => {
        // A better implementation should be used in production
        return btoa(user.username + 'secretKey'); // Basic example
    };

    // Generate a unique URL for the QR code after defining the token generation function
    const qrCodeUrl = `https://your-app-url.com/preferences?user=${currentUser?.username}&token=${generateToken(currentUser)}`;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPreferences({ ...preferences, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePreferences(preferences);
    };

    const handleQRScan = () => {
        const userPassword = currentUser?.password; // Assume password is stored securely
        if (password === userPassword) {
            setAccessGranted(true);
        } else {
            alert('Incorrect password. Access denied.');
        }
    };

    return (
        <div>
            <h2>User Preferences</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Font Color:
                    <input 
                        type="color" 
                        name="fontColor" 
                        value={preferences.fontColor || '#000000'} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    Background Color:
                    <input 
                        type="color" 
                        name="backgroundColor" 
                        value={preferences.backgroundColor || '#ffffff'} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    Font Size:
                    <input 
                        type="number" 
                        name="fontSize" 
                        value={preferences.fontSize || 16} 
                        onChange={handleChange} 
                        min="10" 
                        max="40"
                    />
                </label>
                <label>
                    Color Blindness Mode:
                    <select 
                        name="colorBlindnessMode" 
                        value={preferences.colorBlindnessMode || 'none'} 
                        onChange={handleChange}
                    >
                        <option value="none">None</option>
                        <option value="protanopia">Protanopia</option>
                        <option value="deuteranopia">Deuteranopia</option>
                        <option value="tritanopia">Tritanopia</option>
                    </select>
                </label>
                <button type="submit">Save Preferences</button>
            </form>

            <div>
                <h3>Your QR Code</h3>
                <QRCodeSVG value={qrCodeUrl} />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter password to access preferences" 
                />
                <button onClick={handleQRScan}>Access Preferences</button>
                {accessGranted && <p>Access Granted! You can make changes.</p>}
            </div>
        </div>
    );
};

export default Preferences;
