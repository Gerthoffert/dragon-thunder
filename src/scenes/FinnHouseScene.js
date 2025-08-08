/**
 * FinnHouseScene - Placeholder scene for Finn's character gameplay
 *
 * Features:
 * - Grid visualization for layout reference
 * - Smooth free movement within the grid area
 * - Point-and-click movement for mobile/touch devices
 * - Arrow key (↑↓←→) and WASD movement for desktop
 * - Player can stop anywhere, not restricted to grid cells
 * - LPC sprite animations with directional movement
 *
 * Controls:
 * - Mobile: Tap anywhere to move there smoothly
 * - Desktop: Use arrow keys or WASD for continuous movement
 */
import { Player } from '../entities/Player.js';

export default class FinnHouseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinnHouseScene' });
    this.gridSize = 32; // Size of each grid cell for visual reference
    this.player = null;
  }

  preload() {
    console.log('FinnHouseScene: Starting preload...');
    // Load the character spritesheet
    this.load.spritesheet('finn', 'assets/characters/finn-sprite.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    // Get current game dimensions
    this.gameWidth = this.sys.game.config.width;
    this.gameHeight = this.sys.game.config.height;

    // Calculate grid dimensions for visual reference
    this.gridCols = Math.floor(this.gameWidth / this.gridSize);
    this.gridRows = Math.floor(this.gameHeight / this.gridSize);

    // Calculate playable area boundaries
    this.gridOffsetX = (this.gameWidth - this.gridCols * this.gridSize) / 2;
    this.gridOffsetY = (this.gameHeight - this.gridRows * this.gridSize) / 2;
    this.playAreaWidth = this.gridCols * this.gridSize;
    this.playAreaHeight = this.gridRows * this.gridSize;

    // Create background
    this.createBackground();

    // Create grid visualization
    this.createGrid();

    // Create player character
    this.createPlayer();

    // Setup input controls
    this.setupControls();

    console.log(`Grid area: ${this.playAreaWidth}x${this.playAreaHeight}`);
  }

  createBackground() {
    // Simple background - you can replace this with actual house graphics later
    this.add.rectangle(0, 0, this.gameWidth, this.gameHeight, 0x2d3748).setOrigin(0, 0);
  }

  createGrid() {
    // Create grid lines for visualization
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x4a5568, 0.3);

    // Vertical lines
    for (let col = 0; col <= this.gridCols; col++) {
      const x = this.gridOffsetX + col * this.gridSize;
      graphics.moveTo(x, this.gridOffsetY);
      graphics.lineTo(x, this.gridOffsetY + this.gridRows * this.gridSize);
    }

    // Horizontal lines
    for (let row = 0; row <= this.gridRows; row++) {
      const y = this.gridOffsetY + row * this.gridSize;
      graphics.moveTo(this.gridOffsetX, y);
      graphics.lineTo(this.gridOffsetX + this.gridCols * this.gridSize, y);
    }

    graphics.strokePath();
  }

  createPlayer() {
    // Start player in center of play area
    const startX = this.gridOffsetX + this.playAreaWidth / 2;
    const startY = this.gridOffsetY + this.playAreaHeight / 2;

    // Create player entity
    this.player = new Player(this, startX, startY, 'finn');
  }
  setupControls() {
    // Keyboard controls for desktop
    this.cursors = this.input.keyboard.createCursorKeys();

    // WASD controls as alternative
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');

    // Touch/click controls for mobile
    this.input.on('pointerdown', (pointer) => {
      // Check if click is within playable area
      if (
        pointer.x >= this.gridOffsetX &&
        pointer.x <= this.gridOffsetX + this.playAreaWidth &&
        pointer.y >= this.gridOffsetY &&
        pointer.y <= this.gridOffsetY + this.playAreaHeight
      ) {
        console.log(`🎯 Click movement to: ${Math.round(pointer.x)}, ${Math.round(pointer.y)}`);
        this.player.moveToPosition(pointer.x, pointer.y);
      } else {
        console.log(`❌ Click outside playable area: ${Math.round(pointer.x)}, ${Math.round(pointer.y)}`);
      }
    });
  }

  update(time, delta) {
    // Handle continuous keyboard movement
    let velocityX = 0;
    let velocityY = 0;
    let hasKeyboardInput = false;

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      velocityX = -this.player.speed;
      hasKeyboardInput = true;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      velocityX = this.player.speed;
      hasKeyboardInput = true;
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      velocityY = -this.player.speed;
      hasKeyboardInput = true;
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      velocityY = this.player.speed;
      hasKeyboardInput = true;
    }

    // Only update velocity if there's keyboard input (don't interfere with click movement)
    if (hasKeyboardInput) {
      this.player.setVelocity(velocityX, velocityY);
    } else if (!this.player.targetPosition) {
      // Only stop movement if there's no target position (click movement)
      this.player.setVelocity(0, 0);
    }

    // Update player entity
    this.player.update(delta);

    // Constrain player to playable area
    this.player.constrainToArea(
      this.gridOffsetX,
      this.gridOffsetY,
      this.gridOffsetX + this.playAreaWidth,
      this.gridOffsetY + this.playAreaHeight
    );
  }

  // Helper method to get current player position in pixels
  getPlayerPosition() {
    return this.player.getPosition();
  }

  // Helper method to check if position is within playable area
  isWithinPlayArea(x, y) {
    return (
      x >= this.gridOffsetX &&
      x <= this.gridOffsetX + this.playAreaWidth &&
      y >= this.gridOffsetY &&
      y <= this.gridOffsetY + this.playAreaHeight
    );
  }

  // Helper method to convert pixel coordinates to grid coordinates (for reference)
  pixelToGrid(pixelX, pixelY) {
    return {
      x: Math.floor((pixelX - this.gridOffsetX) / this.gridSize),
      y: Math.floor((pixelY - this.gridOffsetY) / this.gridSize),
    };
  }
}
