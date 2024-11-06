import React, { useEffect, useRef, useState, useCallback } from 'react';
import Creature from './Creature';
import Hero from './Hero';
import Player from './Player';
//import ClosedCaptions from './ClosedCaptions';
import CustomizedCaptions from './CustomizedCaptions';
import './AdventureLogicc.css';
import AudioSettings from './AudioSettings';
import SettingsButton from './SettingsButton';
// Game constants
const GAME_CONSTANTS = {
  SAFE_ZONE_RADIUS: 50,
  MAX_CREATURES: 10,
  CREATURE_SPAWN_INTERVAL: 2000,
  GAME_LOOP_INTERVAL: 16,
  BULLET_SPEED: 5,
  CREATURE_SPEED: 0.5,
  PLAYER_STEP: 5,
  MAX_ELIMINATION_DISTANCE: 20,
  INITIAL_HERO_HITS: 7,
  SAFE_ZONE_WARNING_DISTANCE: 100, // Added this constant
  CREATURES_TO_END_GAME: 3
};

// Voice lines data
const VOICE_LINES = {
  hero: [
    { text: "Help me, they are almost near!", pitch: 1.5, rate: 1 },
    { text: "I'm in trouble!", pitch: 1.5, rate: 1.1 },
    { text: "Save me! Friend we are about to be caught", pitch: 1.5, rate: 1 },
    { text: "They're coming, friend, help me!", pitch: 1.5, rate: 1.1 },
    { text: "I can't hold them off!", pitch: 1.5, rate: 1 }
  ],
  creature: [
    { text: "I'll get you!", pitch: 0.7, rate: 0.9 },
    { text: "You can't escape us!", pitch: 0.6, rate: 0.8 },
    { text: "We're coming for you!", pitch: 0.7, rate: 0.9 },
    { text: "You think you can stop us?", pitch: 0.6, rate: 0.8 },
    { text: "You're not strong enough!", pitch: 0.7, rate: 0.9 }
  ],
  narrator: {
    intro: {
      text: "Welcome, brave hero. Your mission is to protect the hero from the relentless wave of creatures. Use arrow keys to move and spacebar to shoot. If three creatures enter the protection circle, all is lost. Good luck!",
      pitch: 1,
      rate: 0.9
    }
  }
};

const AdventureLogic = () => {
  // All state declarations remain the same...
  const [gameState, setGameState] = useState({
    started: false,
    over: false,
    score: 0,
    heroHits: GAME_CONSTANTS.INITIAL_HERO_HITS,
    narrationComplete: false,
    creaturesInSafeZone: 0
  });

  const [audioPreferences, setAudioPreferences] = useState({
  heroVoice: true,
  creatureVoice: true,
  narratorVoice: true,
  soundEffects: true
  });

  const [entities, setEntities] = useState({
    creatures: [],
    playerBullets: [],
    heroPosition: { left: '50%', top: '50%' },
    playerPosition: { left: '30%', top: '80%' }
  });

  const [uiState, setUiState] = useState({
    captionText: '',
    isSpeaking: false,
    lastHeroWarningTime: 0,
    lastCreatureWarningTime: 0,
    captionHistory: []
  });

  const refs = {
    video: useRef(null),
    dialogueQueue: useRef([]),
    isProcessingQueue: useRef(false),
    gameLoop: useRef(null),
    introNarrationPlayed: useRef(false)
  };

  // Audio system functions
  const speak = useCallback(async (text, pitch = 1, rate = 1) => {
    if (!window.speechSynthesis || uiState.isSpeaking) return;
    
      // Determine speaker type based on pitch and check preferences
  const shouldSpeak = 
  (pitch === 1.5 && audioPreferences.heroVoice) || //Hero
  (pitch === 0.7 && audioPreferences.creatureVoice) || //Creature
  (pitch === 1 && audioPreferences.narratorVoice); //Narrator

   if (!shouldSpeak) return;

    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = pitch;
      utterance.rate = rate;

      // Wait for voices to be loaded
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = pitch === 1.5 ? 
          voices.find(v => v.name.includes('Female')) || voices[0] :
          voices.find(v => v.name.includes('Male')) || voices[0];
      };

      if (window.speechSynthesis.getVoices().length) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
      setUiState(prev => ({ ...prev, isSpeaking: true, captionText: text }));

      utterance.onend = () => {
        setUiState(prev => ({ ...prev, isSpeaking: false, captionText: '' }));
        resolve();
      };

      utterance.onerror = () => {
        setUiState(prev => ({ ...prev, isSpeaking: false, captionText: '' }));
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [audioPreferences]);

  const processDialogueQueue = useCallback(async () => {
    if (refs.isProcessingQueue.current || refs.dialogueQueue.current.length === 0) return;

    refs.isProcessingQueue.current = true;
    while (refs.dialogueQueue.current.length > 0) {
      const { text, pitch, rate } = refs.dialogueQueue.current.shift();
      await speak(text, pitch, rate);
    }
    refs.isProcessingQueue.current = false;
  }, [speak]);

  const queueDialogue = useCallback((text, pitch = 1, rate = 1) => {
    refs.dialogueQueue.current.push({ text, pitch, rate });
    processDialogueQueue();
  }, [processDialogueQueue]);

  const playSound = useCallback((audioFile) => {
    if (!audioPreferences.soundEffects) return;
  
  const audio = new Audio(audioFile);
  audio.volume = 0.3;
  audio.play().catch(error => console.error('Sound playback failed:', error));
},[audioPreferences]);

  // Game mechanics functions
  const getDistance = useCallback((pos1, pos2) => {
    const x1 = parseFloat(pos1.left);
    const y1 = parseFloat(pos1.top);
    const x2 = parseFloat(pos2.left);
    const y2 = parseFloat(pos2.top);
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }, []);

  const isColliding = useCallback((pos1, pos2, radius) => {
    return getDistance(pos1, pos2) < radius;
  }, [getDistance]);

  const getCurrentSpeaker = () => {
    if (uiState.captionText === VOICE_LINES.narrator.intro.text) {
      return 'narrator';
    }
    if (VOICE_LINES.hero.some(line => line.text === uiState.captionText)) {
      return 'hero';
    }
    if (VOICE_LINES.creature.some(line => line.text === uiState.captionText)) {
      return 'creature';
    }
    return 'narrator'; // default
  };

  const spawnCreature = useCallback(() => {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 100 + 200;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);

    return {
      id: Math.random(),
      position: {
        left: `${Math.min(Math.max(x, 0), 100)}%`,
        top: `${Math.min(Math.max(y, 0), 100)}%`
      },
      life: 1,
      angle: Math.atan2(50 - y, 50 - x),
      inSafeZone: false
    };
  }, []);

  // Handler functions
  const handlePlayerShoot = useCallback(() => {
    setEntities(prev => {
      const nearbyCreatures = prev.creatures.filter(creature => 
        isColliding(creature.position, prev.playerPosition, GAME_CONSTANTS.SAFE_ZONE_RADIUS)
      );

      if (nearbyCreatures.length > 0) {
        const closestCreature = nearbyCreatures.reduce((closest, creature) => {
          const distance = getDistance(creature.position, prev.playerPosition);
          const closestDistance = getDistance(closest.position, prev.playerPosition);
          return distance < closestDistance ? creature : closest;
        });

        if (getDistance(closestCreature.position, prev.playerPosition) <= GAME_CONSTANTS.MAX_ELIMINATION_DISTANCE) {
          playSound('/sounds/creature_hurt.wav');
          setGameState(prev => ({ ...prev, score: prev.score + 1 }));

          return {
            ...prev,
            creatures: prev.creatures.filter(c => c.id !== closestCreature.id)
          };
        }
      }

      playSound('/sounds/shoot.wav');
      return {
        ...prev,
        playerBullets: [...prev.playerBullets, {
          id: Math.random(),
          position: { ...prev.playerPosition }
        }]
      };
    });
  }, [isColliding, getDistance, playSound]);

  const handleKeyPress = useCallback((event) => {
    if (gameState.over) return;

    const { key } = event;
    if (key === ' ') {
      event.preventDefault();
      handlePlayerShoot();
      return;
    }

    setEntities(prev => {
      const { left, top } = prev.playerPosition;
      let newLeft = parseFloat(left);
      let newTop = parseFloat(top);

      switch(key) {
        case 'ArrowRight':
          newLeft = Math.min(newLeft + GAME_CONSTANTS.PLAYER_STEP, 90);
          break;
        case 'ArrowLeft':
          newLeft = Math.max(newLeft - GAME_CONSTANTS.PLAYER_STEP, 10);
          break;
        case 'ArrowDown':
          newTop = Math.min(newTop + GAME_CONSTANTS.PLAYER_STEP, 90);
          break;
        case 'ArrowUp':
          newTop = Math.max(newTop - GAME_CONSTANTS.PLAYER_STEP, 10);
          break;
        default:
          return prev;
      }

      return {
        ...prev,
        playerPosition: { 
          left: `${newLeft}%`, 
          top: `${newTop}%` 
        }
      };
    });
  }, [gameState.over, handlePlayerShoot]);

  const resetGame = useCallback(() => {
    setGameState({
      started: true,
      over: false,
      score: 0,
      heroHits: GAME_CONSTANTS.INITIAL_HERO_HITS,
      narrationComplete: true,
      creaturesInSafeZone: 0
    });

    setEntities({
      creatures: [],
      playerBullets: [],
      heroPosition: { left: '50%', top: '50%' },
      playerPosition: { left: '30%', top: '80%' }
    });

    setUiState(prev => ({
      ...prev,
      lastHeroWarningTime: 0,
      lastCreatureWarningTime: 0
    }));

    refs.dialogueQueue.current = [];
    refs.isProcessingQueue.current = false;

    if (refs.video.current) {
      refs.video.current.src = '/sounds/VideoGame.mp4';
      refs.video.current.load();
      refs.video.current.play().catch(err => console.error('Video playback failed:', err));
    }
  }, []);

  const updateEntities = useCallback(() => {
    setEntities(prev => {
      let creaturesInSafeZone = 0;
      const now = Date.now();
      const heroCenter = {
        x: 50, // Hero is fixed at center
        y: 50
      };

      const updatedCreatures = prev.creatures.map(creature => {
        // Calculate current creature position in percentages
        const creatureX = parseFloat(creature.position.left);
        const creatureY = parseFloat(creature.position.top);
        
        // Calculate angle towards hero (center)
        const angle = Math.atan2(
          heroCenter.y - creatureY,
          heroCenter.x - creatureX
        );

        const distance = Math.sqrt(
          Math.pow(heroCenter.x - creatureX, 2) + 
          Math.pow(heroCenter.y - creatureY, 2)
        );

        const inSafeZone = distance < (GAME_CONSTANTS.SAFE_ZONE_RADIUS / window.innerWidth * 100);
        const approachingSafeZone = distance < (GAME_CONSTANTS.SAFE_ZONE_WARNING_DISTANCE / window.innerWidth * 100);

        // Always update position to move towards center
        const newPosition = {
          left: `${creatureX + Math.cos(angle) * GAME_CONSTANTS.CREATURE_SPEED}%`,
          top: `${creatureY + Math.sin(angle) * GAME_CONSTANTS.CREATURE_SPEED}%`
        };

        if (inSafeZone) {
          creaturesInSafeZone++;
          // Play creature voice line when entering safe zone
          if (!creature.inSafeZone) {
            const randomCreatureLine = VOICE_LINES.creature[Math.floor(Math.random() * VOICE_LINES.creature.length)];
            queueDialogue(randomCreatureLine.text, randomCreatureLine.pitch, randomCreatureLine.rate);
          }
        } else if (approachingSafeZone && now - uiState.lastHeroWarningTime > 5000) {
          // Play hero warning when creatures approach
          const randomHeroLine = VOICE_LINES.hero[Math.floor(Math.random() * VOICE_LINES.hero.length)];
          queueDialogue(randomHeroLine.text, randomHeroLine.pitch, randomHeroLine.rate);
          setUiState(prev => ({ ...prev, lastHeroWarningTime: now }));
        }

        return {
          ...creature,
          position: newPosition,
          inSafeZone
        };
      });

      const updatedBullets = prev.playerBullets
        .map(bullet => ({
          ...bullet,
          position: {
            ...bullet.position,
            top: `${parseFloat(bullet.position.top) - GAME_CONSTANTS.BULLET_SPEED}%`
          }
        }))
        .filter(bullet => parseFloat(bullet.position.top) > 0);

      // Check if game should end
      setGameState(prev => ({
        ...prev,
        creaturesInSafeZone,
        over: creaturesInSafeZone >= GAME_CONSTANTS.CREATURES_TO_END_GAME
      }));

      return {
        ...prev,
        creatures: updatedCreatures
      };
    });
  }, [queueDialogue, uiState.lastHeroWarningTime]);

  // Effects
  useEffect(() => {
    if (refs.video.current) {
      refs.video.current.src = gameState.started ? '/sounds/VideoGame.mp4' : '/sounds/VideoIntro.mp4';
      refs.video.current.load();
      refs.video.current.play().catch(err => console.error('Video playback failed:', err));
    }
  }, [gameState.started]);

  useEffect(() => {
    if (!gameState.started && !gameState.narrationComplete && !refs.introNarrationPlayed.current) {
      refs.introNarrationPlayed.current = true;
      speak(
        VOICE_LINES.narrator.intro.text,
        VOICE_LINES.narrator.intro.pitch,
        VOICE_LINES.narrator.intro.rate
      ).then(() => {
        setGameState(prev => ({ ...prev, narrationComplete: true }));
      });
    }
  }, [gameState.started, gameState.narrationComplete, speak]);

  useEffect(() => {
    let spawnInterval;
    if (gameState.started && !gameState.over) {
      spawnInterval = setInterval(() => {
        if (entities.creatures.length < GAME_CONSTANTS.MAX_CREATURES) {
          setEntities(prev => ({
            ...prev,
            creatures: [...prev.creatures, spawnCreature()]
          }));
        }
      }, GAME_CONSTANTS.CREATURE_SPAWN_INTERVAL);
    }
    return () => clearInterval(spawnInterval);
  }, [gameState.started, gameState.over, spawnCreature]);

  useEffect(() => {
    if (gameState.started && !gameState.over) {
      refs.gameLoop.current = setInterval(updateEntities, GAME_CONSTANTS.GAME_LOOP_INTERVAL);
    }
    return () => {
      if (refs.gameLoop.current) {
        clearInterval(refs.gameLoop.current);
      }
    };
  }, [gameState.started, gameState.over, updateEntities]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  //caption history update 
  useEffect(() => {
    if (uiState.captionText) {
      setUiState(prev => ({
        ...prev,
        captionHistory: [...prev.captionHistory, uiState.captionText]
      }));
    }
  }, [uiState.captionText]);

  // Safe zone style
  const safeZoneStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${GAME_CONSTANTS.SAFE_ZONE_RADIUS * 2}px`,
    height: `${GAME_CONSTANTS.SAFE_ZONE_RADIUS * 2}px`,
    transform: 'translate(-50%, -50%)',
    border: '2px solid rgba(255, 0, 0, 0.5)', // Changed to red for better visibility
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 1
  };

  // Render
  return (
    <div className="game-container">
      <video ref={refs.video} className="background-video" loop muted />
      
      {!gameState.started ? (
        <div className="intro-screen">
          <div className="intro-content">
            <h1 className="game-title">The Hero's Guardian</h1>
            {gameState.narrationComplete && (
              <button
                onClick={() => setGameState(prev => ({ ...prev, started: true }))}
                className="start-button"
              >
                Start Game
              </button>
            )}
            <CustomizedCaptions 
            caption={uiState.captionText} 
            speakerType="narrator" 
            />
          </div>
        </div>
      ) : (
        <div className="game-area">
           <SettingsButton />
           <AudioSettings
            audioPreferences={audioPreferences}
            setAudioPreferences={setAudioPreferences}
          />
           {gameState.over ? (
            <div className="game-over">
              <div className="game-over-content">
                <h1>Game Over</h1>
                <p>Final Score: {gameState.score}</p>
                <p>Creatures in Safe Zone: {gameState.creaturesInSafeZone}</p>
                <button 
                  className="restart-button"
                  onClick={resetGame}
                >
                  Play Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={safeZoneStyle} /> {/* Safe zone circle */}
              <Hero heroPosition={entities.heroPosition} />
              <Player playerPosition={entities.playerPosition} />
              {entities.creatures.map(creature => (
                <Creature 
                  key={creature.id} 
                  creaturePosition={creature.position} 
                />
              ))}
              {entities.playerBullets.map(bullet => (
                <div
                  key={bullet.id}
                  className="bullet"
                  style={bullet.position}
                />
              ))}
              <div className="score-board">
                <p>Score: {gameState.score}</p>
                <p>Hero Health: {gameState.heroHits}</p>
                <p>Creatures in Zone: {gameState.creaturesInSafeZone}</p>
              </div>
              <CustomizedCaptions 
              caption={uiState.captionText} 
              speakerType={getCurrentSpeaker()}
              captionHistory={uiState.captionHistory} // You'll need to add this function
              
            />
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default AdventureLogic;