// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Initialize state from localStorage if available
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });

    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [userPreferences, setUserPreferences] = useState(() => {
        if (currentUser?.username) {
            const savedPrefs = localStorage.getItem(`preferences_${currentUser.username}`);
            return savedPrefs ? JSON.parse(savedPrefs) : getDefaultPreferences();
        }
        return getDefaultPreferences();
    });

    const [message, setMessage] = useState('');

    // Persist users to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    // Persist current user to localStorage
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    // Default preferences structure
    function getDefaultPreferences() {
        return {
            // Global settings
            colorBlindnessMode: 'none',
            uiScale: 100,
            
            // Narrator caption settings
            narratorFontFamily: 'Arial',
            narratorFontSize: 18,
            narratorColor: '#ffffff',
            narratorBgOpacity: 70,
            
            // Hero caption settings
            heroFontFamily: 'Georgia',
            heroFontSize: 16,
            heroColor: '#00ff00',
            heroBgOpacity: 70,
            
            // Creature caption settings
            creatureFontFamily: 'Courier New',
            creatureFontSize: 16,
            creatureColor: '#ff0000',
            creatureBgOpacity: 70,
        };
    }

    const registerUser = (username, password) => {
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            setMessage('User already exists!');
            return false;
        }

        const newUser = {
            username,
            password,
            preferences: getDefaultPreferences(),
            createdAt: new Date().toISOString()
        };

        setUsers(prevUsers => [...prevUsers, newUser]);
        setMessage('Registration successful! Please login.');
        return true;
    };

    const loginUser = (username, password) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            setMessage('Invalid username or password!');
            return false;
        }

        setCurrentUser(user);
        setUserPreferences(user.preferences);
        setMessage('Login successful!');
        return true;
    };

    const logoutUser = () => {
        setCurrentUser(null);
        setUserPreferences(getDefaultPreferences());
        localStorage.removeItem('currentUser');
        setMessage('Logged out successfully!');
    };

    const updatePreferences = (newPreferences) => {
        if (!currentUser) {
            setMessage('Please login to save preferences!');
            return false;
        }

        // Update preferences in user object
        const updatedUser = {
            ...currentUser,
            preferences: newPreferences
        };

        // Update users array
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.username === currentUser.username ? updatedUser : user
            )
        );

        // Update current user
        setCurrentUser(updatedUser);
        
        // Update active preferences
        setUserPreferences(newPreferences);

        // Save to localStorage
        localStorage.setItem(
            `preferences_${currentUser.username}`,
            JSON.stringify(newPreferences)
        );

        setMessage('Preferences saved successfully!');
        return true;
    };

    const clearMessage = () => {
        setMessage('');
    };

    return (
        <UserContext.Provider value={{
            users,
            currentUser,
            userPreferences,
            registerUser,
            loginUser,
            logoutUser,
            updatePreferences,
            message,
            clearMessage,
            getDefaultPreferences
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;