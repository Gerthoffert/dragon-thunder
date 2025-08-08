/**
 * Sprite Frame Debugger - Visual tool to identify sprite frame numbers
 *
 * Usage:
 * 1. Import and add to your scene
 * 2. Use keyboard controls to inspect frames
 * 3. Console will show frame information
 */
export class SpriteDebugger {
  constructor(scene, sprite) {
    this.scene = scene;
    this.sprite = sprite;
    this.currentFrame = 0;
    this.isActive = false;

    this.createUI();
    this.setupControls();
  }

  createUI() {
    // Create debug panel
    this.debugPanel = this.scene.add.container(10, 10);

    // Background
    this.panelBg = this.scene.add.rectangle(0, 0, 300, 200, 0x000000, 0.8);
    this.panelBg.setOrigin(0, 0);

    // Title
    this.titleText = this.scene.add.text(10, 10, 'Sprite Frame Debugger', {
      fontSize: '16px',
      fill: '#ffffff',
      fontStyle: 'bold',
    });

    // Instructions
    const instructions = [
      'Controls:',
      'SPACE - Cycle frames',
      '1-9 - Jump to frame 0-8',
      'Arrow Keys - Navigate by direction',
      'I - Frame info',
      'T - Toggle debug mode',
      'R - Reset to idle',
    ];

    this.instructionsText = this.scene.add.text(10, 40, instructions.join('\n'), {
      fontSize: '12px',
      fill: '#cccccc',
      lineSpacing: 2,
    });

    // Current frame info
    this.frameInfoText = this.scene.add.text(10, 150, '', {
      fontSize: '12px',
      fill: '#00ff00',
    });

    // Add to container
    this.debugPanel.add([this.panelBg, this.titleText, this.instructionsText, this.frameInfoText]);
    this.debugPanel.setVisible(false);
  }

  setupControls() {
    const keyboard = this.scene.input.keyboard;

    // Toggle debug mode
    keyboard.on('keydown-T', () => this.toggle());

    // Frame navigation
    keyboard.on('keydown-SPACE', () => this.nextFrame());
    keyboard.on('keydown-R', () => this.resetToIdle());

    // Direct frame access (1-9 keys)
    for (let i = 1; i <= 9; i++) {
      keyboard.on(`keydown-DIGIT${i}`, () => this.setFrame(i - 1));
    }

    // Direction-based frame testing
    keyboard.on('keydown-UP', () => this.testDirection('up'));
    keyboard.on('keydown-DOWN', () => this.testDirection('down'));
    keyboard.on('keydown-LEFT', () => this.testDirection('left'));
    keyboard.on('keydown-RIGHT', () => this.testDirection('right'));

    // Frame info
    keyboard.on('keydown-I', () => this.logFrameInfo());
  }

  toggle() {
    this.isActive = !this.isActive;
    this.debugPanel.setVisible(this.isActive);

    if (this.isActive) {
      this.updateFrameInfo();
      console.log('🔍 Sprite Debugger activated');
      console.log('Total frames available:', this.sprite.texture.frameTotal);
    } else {
      console.log('🔍 Sprite Debugger deactivated');
    }
  }

  nextFrame() {
    if (!this.isActive) return;

    const totalFrames = this.sprite.texture.frameTotal;
    this.currentFrame = (this.currentFrame + 1) % totalFrames;
    this.setFrame(this.currentFrame);
  }

  setFrame(frameIndex) {
    if (!this.isActive) return;

    this.currentFrame = frameIndex;
    this.sprite.setFrame(frameIndex);
    this.updateFrameInfo();

    console.log(`📍 Frame ${frameIndex} displayed`);
  }

  testDirection(direction) {
    if (!this.isActive) return;

    // Try to play the walking animation for this direction
    const textureKey = this.sprite.texture.key;
    const animKey = `${textureKey}_walk_${direction}`;

    try {
      this.sprite.play(animKey);
      console.log(`🚶 Playing animation: ${animKey}`);
    } catch (error) {
      console.warn(`❌ Animation not found: ${animKey}`);
    }
  }

  resetToIdle() {
    if (!this.isActive) return;

    const textureKey = this.sprite.texture.key;
    const idleKey = `${textureKey}_idle_down`;

    try {
      this.sprite.play(idleKey);
      console.log(`😴 Reset to idle: ${idleKey}`);
    } catch (error) {
      this.sprite.setFrame(0);
      console.log('😴 Reset to frame 0');
    }
  }

  logFrameInfo() {
    const frame = this.sprite.frame;
    const texture = this.sprite.texture;

    const info = {
      currentFrame: frame.name,
      totalFrames: texture.frameTotal,
      textureKey: texture.key,
      frameSize: `${frame.width}x${frame.height}`,
      spritePosition: `x:${Math.round(this.sprite.x)}, y:${Math.round(this.sprite.y)}`,
      currentAnimation: this.sprite.anims.currentAnim ? this.sprite.anims.currentAnim.key : 'none',
    };

    console.table(info);
    this.updateFrameInfo();
  }

  updateFrameInfo() {
    if (!this.isActive) return;

    const frame = this.sprite.frame;
    const anim = this.sprite.anims.currentAnim;

    const infoText = [
      `Current Frame: ${frame.name}`,
      `Total Frames: ${this.sprite.texture.frameTotal}`,
      `Animation: ${anim ? anim.key : 'Static'}`,
      `Size: ${frame.width}x${frame.height}`,
    ].join('\n');

    this.frameInfoText.setText(infoText);
  }

  destroy() {
    if (this.debugPanel) {
      this.debugPanel.destroy();
    }
  }
}
