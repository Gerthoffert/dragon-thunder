import Phaser from 'phaser';
import IntroScene from './scenes/IntroScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [IntroScene]
};

// Game instance
const game = new Phaser.Game(config);

// Add global error handling
game.events.on('ready', () => {
    console.log('🎮 Dragon Thunder Game is ready!');
});

// Global game state
window.gameState = {
    currentCharacter: 'kiara', // 'kiara' or 'finn'
    inventory: [],
    storyProgress: 0,
    charactersFound: false
};

export default game;
