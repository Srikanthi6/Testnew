import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Settings, X } from 'lucide-react';

const GameSettingsPanel = ({ isVisible, onClose }) => {
  const { userPreferences, updatePreferences, currentUser } = useContext(UserContext);
  const [localPreferences, setLocalPreferences] = useState(userPreferences);
  const [showPanel, setShowPanel] = useState(false);

  // Initialize with user preferences on mount and when user changes
  useEffect(() => {
    setLocalPreferences(userPreferences);
  }, [userPreferences]);

  // Auto-save preferences when they change
  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...localPreferences, [key]: value };
    setLocalPreferences(newPreferences);
    updatePreferences(newPreferences);
  };

  const speakerTypes = ['narrator', 'hero', 'creature'];
  const fontFamilies = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

  return (
    <div className={`fixed right-0 top-0 h-full w-80 bg-gray-900/95 text-white transform transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Game Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={44} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Global Settings */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Global Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Color Blindness Mode</label>
                <select
                  value={localPreferences.colorBlindnessMode || 'none'}
                  onChange={(e) => handlePreferenceChange('colorBlindnessMode', e.target.value)}
                  className="w-full bg-gray-700 rounded p-2 text-white"
                >
                  <option value="none">None</option>
                  <option value="protanopia">Protanopia</option>
                  <option value="deuteranopia">Deuteranopia</option>
                  <option value="tritanopia">Tritanopia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">UI Scale</label>
                <input
                  type="range"
                  min="80"
                  max="120"
                  value={localPreferences.uiScale || 100}
                  onChange={(e) => handlePreferenceChange('uiScale', e.target.value)}
                  className="w-full"
                />
                <div className="text-right text-sm">{localPreferences.uiScale || 100}%</div>
              </div>
            </div>
          </div>

          {/* Caption Settings for each speaker type */}
          {speakerTypes.map(speakerType => (
            <div key={speakerType} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 capitalize">{speakerType} Captions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Font Family</label>
                  <select
                    value={localPreferences[`${speakerType}FontFamily`] || 'Arial'}
                    onChange={(e) => handlePreferenceChange(`${speakerType}FontFamily`, e.target.value)}
                    className="w-full bg-gray-700 rounded p-2 text-white"
                  >
                    {fontFamilies.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Font Size</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={localPreferences[`${speakerType}FontSize`] || 16}
                      onChange={(e) => handlePreferenceChange(`${speakerType}FontSize`, e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm w-8">{localPreferences[`${speakerType}FontSize`] || 16}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Text Color</label>
                  <input
                    type="color"
                    value={localPreferences[`${speakerType}Color`] || '#ffffff'}
                    onChange={(e) => handlePreferenceChange(`${speakerType}Color`, e.target.value)}
                    className="w-full h-8 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Background Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localPreferences[`${speakerType}BgOpacity`] || 70}
                    onChange={(e) => handlePreferenceChange(`${speakerType}BgOpacity`, e.target.value)}
                    className="w-full"
                  />
                  <div className="text-right text-sm">{localPreferences[`${speakerType}BgOpacity`] || 70}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-400">
          <p>Settings are automatically saved for user: {currentUser?.username}</p>
          <p>Last saved: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsPanel;