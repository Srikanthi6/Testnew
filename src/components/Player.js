import React from 'react';

const Player = ({ playerPosition = { left: '0%', top: '0%' }, bullets = [] }) => {
    return (
        <div 
            className="player" 
            style={{ left: playerPosition.left, top: playerPosition.top, position: 'absolute' , fontSize: '50px'}} 
        >
            {/* Player Visual Representation */}
            <div className="player-visual">
                <div className="player-icon">🔫</div>
            </div>

            {/* Render Player Bullets */}
            {bullets.map(bullet => (
                <div 
                    key={bullet.id} 
                    className="bullet" 
                    style={{ left: bullet.position.left, top: bullet.position.top, position: 'absolute' }}
                >
                    <div className="bullet-icon">⚡</div>
                </div>
            ))}
        </div>
    );
};

export default Player;
