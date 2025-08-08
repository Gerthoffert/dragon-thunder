/**
 * Player Entity - Handles LPC sprite animations and movement physics
 *
 * Features:
 * - LPC (Liberated Pixel Cup) sprite sheet support
 * - Directional animations (walk up, down, left, right)
 * - Idle animations for each direction
 * - Smooth movement with physics
 * - Shared logic between different characters
 *
 * LPC Sprite Sheet Layout (64x64 frames):
 * Row 0: Spellcast (up, left, down, right)
 * Row 1: Thrust (up, left, down, right)
 * Row 2: Walk (up, left, down, right)
 * Row 3: Slash (up, left, down, right)
 * Row 4: Shoot (up, left, down, right)
 * Row 5: Hurt (single frame)
 */
export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    // Add to scene
    scene.add.existing(this);

    // Physics properties
    this.speed = 150; // pixels per second
    this.velocity = { x: 0, y: 0 };
    this.isMoving = false;
    this.targetPosition = null;

    // Animation state
    this.currentDirection = 'down'; // down, up, left, right
    this.wasMoving = false;

    // LPC animation configuration
    this.animConfig = {
      frameRate: 8,
      repeat: -1,
    };

    // Initialize animations and physics
    this.createAnimations();
    this.setOrigin(0.5, 0.5);

    // Scale appropriately for the game
    this.setScale(0.8);
  }

  createAnimations() {
    const textureKey = this.texture.key;

    // Create walking animations for each direction (LPC standard layout)
    // Row 2 contains walk animations: up, left, down, right (each 3 frames)
    this.scene.anims.create({
      key: `${textureKey}_walk_up`,
      frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 105, end: 112 }),
      frameRate: this.animConfig.frameRate,
      repeat: this.animConfig.repeat,
    });

    this.scene.anims.create({
      key: `${textureKey}_walk_left`,
      frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 117, end: 125 }),
      frameRate: this.animConfig.frameRate,
      repeat: this.animConfig.repeat,
    });

    this.scene.anims.create({
      key: `${textureKey}_walk_down`,
      frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 131, end: 138 }),
      frameRate: this.animConfig.frameRate,
      repeat: this.animConfig.repeat,
    });

    this.scene.anims.create({
      key: `${textureKey}_walk_right`,
      frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 143, end: 151 }),
      frameRate: this.animConfig.frameRate,
      repeat: this.animConfig.repeat,
    });

    // Create idle animations (first frame of each walk cycle)
    this.scene.anims.create({
      key: `${textureKey}_idle_up`,
      frames: [{ key: textureKey, frame: 104 }],
      frameRate: 1,
    });

    this.scene.anims.create({
      key: `${textureKey}_idle_left`,
      frames: [{ key: textureKey, frame: 117 }],
      frameRate: 1,
    });

    this.scene.anims.create({
      key: `${textureKey}_idle_down`,
      frames: [{ key: textureKey, frame: 130 }],
      frameRate: 1,
    });

    this.scene.anims.create({
      key: `${textureKey}_idle_right`,
      frames: [{ key: textureKey, frame: 143 }],
      frameRate: 1,
    });

    // Set initial idle animation
    this.play(`${textureKey}_idle_down`);
  }

  update(deltaTime) {
    // Handle continuous movement
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.handleContinuousMovement(deltaTime);
    }

    // Handle click-to-move
    if (this.targetPosition) {
      this.handleClickMovement(deltaTime);
    }

    // Update animations based on movement
    this.updateAnimations();
  }

  handleContinuousMovement(deltaTime) {
    const deltaSeconds = deltaTime / 1000;

    // Calculate new position
    const newX = this.x + this.velocity.x * deltaSeconds;
    const newY = this.y + this.velocity.y * deltaSeconds;

    // Update position
    this.setPosition(newX, newY);
    this.isMoving = true;
  }

  handleClickMovement(deltaTime) {
    const deltaSeconds = deltaTime / 1000;
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.targetPosition.x,
      this.targetPosition.y
    );

    // Check if we've reached the target
    if (distance < 2) {
      this.setPosition(this.targetPosition.x, this.targetPosition.y);
      this.targetPosition = null;
      this.velocity = { x: 0, y: 0 };
      this.isMoving = false;
      return;
    }

    // Calculate direction to target
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.targetPosition.x,
      this.targetPosition.y
    );

    // Set velocity towards target
    this.velocity.x = Math.cos(angle) * this.speed;
    this.velocity.y = Math.sin(angle) * this.speed;

    this.handleContinuousMovement(deltaTime);
  }

  updateAnimations() {
    const textureKey = this.texture.key;

    // Determine movement state
    const nowMoving =
      this.velocity.x !== 0 || this.velocity.y !== 0 || this.targetPosition !== null;

    // Determine direction based on velocity
    if (nowMoving) {
      if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
        this.currentDirection = this.velocity.x > 0 ? 'right' : 'left';
      } else {
        this.currentDirection = this.velocity.y > 0 ? 'down' : 'up';
      }
    }

    // Play appropriate animation
    const animState = nowMoving ? 'walk' : 'idle';
    const animKey = `${textureKey}_${animState}_${this.currentDirection}`;

    // Only change animation if it's different from current
    if (!this.anims.isPlaying || this.anims.currentAnim.key !== animKey) {
      this.play(animKey);
    }

    this.wasMoving = nowMoving;
    this.isMoving = nowMoving;
  }

  // Movement control methods
  setVelocity(x, y) {
    this.velocity.x = x;
    this.velocity.y = y;
    this.targetPosition = null; // Cancel any click movement
  }

  moveToPosition(x, y) {
    this.targetPosition = { x, y };
    this.velocity = { x: 0, y: 0 }; // Reset continuous velocity
  }

  stop() {
    this.velocity = { x: 0, y: 0 };
    this.targetPosition = null;
    this.isMoving = false;
  }

  // Boundary constraint
  constrainToArea(minX, minY, maxX, maxY) {
    const constrainedX = Phaser.Math.Clamp(this.x, minX, maxX);
    const constrainedY = Phaser.Math.Clamp(this.y, minY, maxY);
    this.setPosition(constrainedX, constrainedY);

    // If we hit a boundary while moving to a target, stop
    if (
      (this.x === minX || this.x === maxX || this.y === minY || this.y === maxY) &&
      this.targetPosition
    ) {
      this.stop();
    }
  }

  // Utility methods
  getPosition() {
    return { x: this.x, y: this.y };
  }

  getDirection() {
    return this.currentDirection;
  }

  getIsMoving() {
    return this.isMoving;
  }
}
