import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { GripHorizontal } from 'lucide-react';

const CustomizedCaptions = ({ caption, speakerType }) => {
  const { userPreferences } = useContext(UserContext);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [size, setSize] = useState({ width: 400, height: 'auto' });
  const [captionHistory, setCaptionHistory] = useState([]);
  const [showCaptionHistory, setShowCaptionHistory] = useState(false);
  const dragRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Default styles for different speaker types
  const defaultStyles = {
    narrator: {
      fontFamily: 'serif',
      color: '#ffffff',
      fontSize: '18px',
    },
    hero: {
      fontFamily: 'sans-serif',
      color: '#00ff00',
      fontSize: '16px',
    },
    creature: {
      fontFamily: 'monospace',
      color: '#ff0000',
      fontSize: '16px',
    }
  };

  // Color blindness adjustments
  const getAdjustedColor = (color) => {
    switch (userPreferences?.colorBlindnessMode) {
      case 'protanopia':
        return color === '#ff0000' ? '#ffdb58' : color;
      case 'deuteranopia':
        return color === '#00ff00' ? '#0000ff' : color;
      case 'tritanopia':
        return color === '#0000ff' ? '#ff69b4' : color;
      default:
        return color;
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      startPosRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - startPosRef.current.x;
      const newY = e.clientY - startPosRef.current.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - 100;
      
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (caption) {
      setCaptionHistory((prev) => [...prev, caption]);
    }
  }, [caption]);

  const baseStyle = defaultStyles[speakerType] || defaultStyles.narrator;

  const handleDownload = () => {
    const fileContent = captionHistory.join('\n');
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'caption_history.txt';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!caption) return null;

  return (
    <div
      className={`fixed transform transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: `${size.width}px`,
        zIndex: 1000,
        visibility: isVisible ? 'visible' : 'hidden'
      }}
    >
      {/* Drag Handle */}
      <div
        className="drag-handle flex items-center justify-center p-2 cursor-grab bg-gray-800/90 rounded-t-lg border-b border-gray-700"
        onMouseDown={handleMouseDown}
        ref={dragRef}
      >
        <GripHorizontal className="w-4 h-4 text-gray-400" />
      </div>
      
      {/* Caption Content */}
      <div className="bg-black/70 p-4">
        <p
          className="m-0 text-center"
          style={{
            fontFamily: userPreferences?.fontFamily || baseStyle.fontFamily,
            fontSize: `${userPreferences?.fontSize || parseInt(baseStyle.fontSize)}px`,
            color: getAdjustedColor(userPreferences?.fontColor || baseStyle.color),
          }}
        >
          {caption}
        </p>
      </div>
      
      {/* Controls */}
      <div className="flex justify-between items-center p-2 bg-gray-800/90 rounded-b-lg">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => setSize(prev => ({ ...prev, width: Math.max(200, prev.width - 50) }))}
            className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            -
          </button>
          <button
            onClick={() => setSize(prev => ({ ...prev, width: Math.min(800, prev.width + 50) }))}
            className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            +
          </button>
          <button
            onClick={() => setShowCaptionHistory(true)}
            className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Caption History
          </button>
        </div>
      </div>

      {showCaptionHistory && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Caption History</h2>
            <ul className="max-h-96 overflow-y-auto">
              {captionHistory.map((caption, index) => (
                <li key={index} className="py-2 px-4 bg-gray-100 mb-2 rounded">
                  {caption}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Download
              </button>
              <button
                onClick={() => setShowCaptionHistory(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors ml-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizedCaptions;