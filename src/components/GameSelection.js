import React from 'react';
import { Link } from 'react-router-dom';

import adventureGameImg from '../assets/adventure-game.jpg';
import flappyBirdImg from '../assets/flappy-bird.jpg';

const GameSelection = () => {
    const containerStyle = {
        textAlign: 'center',
        padding: '20px',
    };

    const listStyle = {
        listStyleType: 'none',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap',
    };

    const itemStyle = {
        display: 'inline-block',
        textAlign: 'center',
        margin: '10px',
        width: '200px',
        textDecoration: 'none',
        color: 'inherit',
    };

    const imageStyle = {
        width: '100%',
        height: 'auto',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
    };

    const imageHoverStyle = {
        transform: 'scale(1.05)',
    };

    const spanStyle = {
        display: 'block',
        marginTop: '10px',
        fontSize: '18px',
        fontWeight: 'bold',
    };

    return (
        <div style={containerStyle}>
            <h1>Select a Game</h1>
            <ul style={listStyle}>
                <li style={itemStyle}>
                    <Link to="/game">
                        <img
                            src={adventureGameImg}
                            alt="Adventure Game"
                            style={imageStyle}
                            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                        <span style={spanStyle}>Play Adventure Game</span>
                    </Link>
                </li>
                <li style={itemStyle}>
                    <Link to="/flappybird">
                        <img
                            src={flappyBirdImg}
                            alt="Flappy Bird Game"
                            style={imageStyle}
                            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                        <span style={spanStyle}>Play Flappy Bird Game</span>
                    </Link>
                </li>
                {/* Add more games here */}
            </ul>
        </div>
    );
};

export default GameSelection;
