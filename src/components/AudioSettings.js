import React from 'react';
import Switch from './Switch';

const AudioSettings = ({ audioPreferences, setAudioPreferences }) => {
  return (
    <div className="audio-settings">
      <h3>Audio Settings</h3>
      <div className="setting">
      <label style={{ color: '#FFFFFF' }}>Hero Voice</label>
        <Switch
          checked={audioPreferences.heroVoice}
          onChange={() =>
            setAudioPreferences(prev => ({
              ...prev,
              heroVoice: !prev.heroVoice
            }))
          }
        />
      </div>
      <div className="setting">
      <label style={{ color: '#FFFFFF' }}>Hero Voice</label>
        <Switch
          checked={audioPreferences.creatureVoice}
          onChange={() =>
            setAudioPreferences(prev => ({
              ...prev,
              creatureVoice: !prev.creatureVoice
            }))
          }
        />
      </div>
      <div className="setting">
      <label style={{ color: '#FFFFFF' }}>Hero Voice</label>
        <Switch
          checked={audioPreferences.narratorVoice}
          onChange={() =>
            setAudioPreferences(prev => ({
              ...prev,
              narratorVoice: !prev.narratorVoice
            }))
          }
        />
      </div>
      <div className="setting">
        <label>Sound Effects</label>
        <Switch
          checked={audioPreferences.soundEffects}
          onChange={() =>
            setAudioPreferences(prev => ({
              ...prev,
              soundEffects: !prev.soundEffects
            }))
          }
        />
      </div>
    </div>
  );
};

export default AudioSettings;