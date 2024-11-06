import React from 'react';


const Creature = ({ creaturePosition = { left: '0%', top: '0%' }, onHit }) => {  // Provide default value for creaturePosition
    const handleCreatureHit = () => {
        if (onHit) onHit(); // Ensure onHit is defined
    };

    return (
        <div 
            className="creature" 
            style={{ 
                left: creaturePosition?.left || '0%',  // Handle undefined positions
                top: creaturePosition?.top || '0%', 
                position: 'absolute' ,
                fontSize: '50px',
            }}  
            onClick={handleCreatureHit}
        >
        👺
        </div>
    );
};

export default Creature;
