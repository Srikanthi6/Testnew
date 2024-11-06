import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import GameSettingsPanel from './GameSettingsPanel';

const SettingsButton = () => {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsSettingsPanelOpen(true)}
        className="fixed top-4 right-4 p-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-full transition-colors"
        title="Open Settings"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>

      <GameSettingsPanel 
        isVisible={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
      />
    </>
  );
};

export default SettingsButton;