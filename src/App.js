// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameSelection from './components/GameSelection';
import AdventureLogic from './components/AdventureLogicc';
import Login from './components/Login';
import Signup from './components/Signup';
import NavBar from './components/NavBar';  
import LogoutButton from './components/LogoutButton';
import { UserProvider } from './context/UserContext';
import Preferences from './components/Preferences';
import PreferencesPage from './components/PreferencePage'; // Import the new component

function App() {
    return (
        <UserProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<GameSelection />} />
                    <Route path="/game" element={<AdventureLogic />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/logout" element={<LogoutButton />} />
                    <Route path="/preferences" element={<Preferences />} />
                    <Route path="/preferences-page" element={<PreferencesPage />} /> {/* New route for PreferencesPage */}
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
