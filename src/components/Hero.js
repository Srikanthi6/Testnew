// Hero.js
import React from 'react';


const Hero = ({ warning }) => {
    const fixedPosition = {
        left: '50%', // Center the hero horizontally
        top: '50%',  // Center the hero vertically
        transform: 'translate(-50%, -50%)', // Center the hero perfectly
        position: 'absolute',
        fontSize: '50px',
    };

    return (
        <div className="hero" style={fixedPosition}>
            🦸
            {warning && warning.isVisible && (
                <p className="warning-text">{warning.text}</p>
            )}
        </div>
    );
};

export default Hero;
