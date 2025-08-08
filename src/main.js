import Phaser from 'phaser';
import IntroScene from './scenes/IntroScene.js';
import FinnHouseScene from './scenes/FinnHouseScene.js';
import KiaraHouseScene from './scenes/KiaraHouseScene.js';
import { OrientationManager } from './utils/OrientationManager.js';

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#0f0f23',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 480,
    },
    max: {
      width: 1920,
      height: 1080,
    },
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true,
    powerPreference: 'high-performance',
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [IntroScene, FinnHouseScene, KiaraHouseScene],
};

// Game instance
const game = new Phaser.Game(config);

// Modern loading screen management
const loadingScreen = document.getElementById('loading-screen');

// Hide loading screen when game is ready
game.events.on('ready', () => {
  console.log('🎮 Dragon Thunder Game is ready!');

  // Add a slight delay for better UX
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';

        // Initialize orientation manager after loading screen is hidden
        setTimeout(() => {
          if (!window.orientationManager && game.scene.scenes[0]) {
            window.orientationManager = new OrientationManager(game.scene.scenes[0]);
          }
        }, 100);
      }, 500);
    }
  }, 1000);
});

// Handle loading errors gracefully
game.events.on('destroy', () => {
  console.log('🎮 Game destroyed');
});

// Global game state
window.gameState = {
  currentCharacter: 'kiara', // 'kiara' or 'finn'
  inventory: [],
  storyProgress: 0,
  charactersFound: false,
};

export default game;
