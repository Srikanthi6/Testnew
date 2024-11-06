import React from 'react';
import './ClosedCaptions.css'; // You can add styles for the captions in this CSS file

const ClosedCaptions = ({ text, fontSize, color, backgroundColor }) => {
  return (
    <div
      className="closed-captions"
      style={{
        fontSize: fontSize || '16px',
        color: color || '#FFFFFF',
        backgroundColor: backgroundColor || 'rgba(0, 0, 0, 0.7)',
        padding: '10px',
        borderRadius: '5px',
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        maxWidth: '80%',
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
};

export default ClosedCaptions;
