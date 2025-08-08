// Base scene class with orientation management built-in
export class BaseScene extends Phaser.Scene {
  constructor(key) {
    super({ key });
    this.orientationManager = null;
  }

  create() {
    // Get orientation manager instance
    this.orientationManager = window.orientationManager;

    // Get current game dimensions
    this.gameWidth = this.sys.game.config.width;
    this.gameHeight = this.sys.game.config.height;

    // Determine device type for better scaling
    this.deviceType = this.getDeviceType();

    // Get layout positions optimized for orientation
    this.layout = this.orientationManager
      ? this.orientationManager.getLandscapeLayout()
      : this.getDefaultLayout();
  }

  // Device detection helper
  getDeviceType() {
    const width = this.gameWidth;
    const height = this.gameHeight;
    const aspectRatio = width / height;

    if (width <= 480 || (width <= 768 && aspectRatio < 1.3)) {
      return 'mobile';
    } else if (width <= 1024) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  // Default layout positions when orientation manager is not available
  getDefaultLayout() {
    return {
      titleY: 0.08,
      subtitleY: 0.14,
      storyY: 0.35,
      selectionY: 0.55,
      buttonsY: 0.7,
      spacing: 'normal',
    };
  }

  // Helper methods for responsive design with better mobile readability
  scaleValue(value) {
    const baseWidth = this.deviceType === 'mobile' ? 320 : 1024;
    const baseHeight = this.deviceType === 'mobile' ? 568 : 768;
    const scaleFactor = Math.min(this.gameWidth / baseWidth, this.gameHeight / baseHeight);

    // More aggressive scaling for mobile to ensure readability
    if (this.deviceType === 'mobile') {
      return Math.max(value * scaleFactor * 1.2, value * 0.8); // Minimum 80% scaling for mobile
    } else {
      return Math.max(value * scaleFactor, value * 0.6); // Standard scaling for desktop
    }
  }

  scaleFont(size) {
    const scaledSize = this.scaleValue(size);

    // Additional boost for very small screens
    if (this.deviceType === 'mobile' && this.gameWidth < 400) {
      return `${Math.max(scaledSize * 1.15, size * 0.9)}px`;
    }

    return `${scaledSize}px`;
  }

  // Common text creation with proper styling
  createStyledText(x, y, text, options = {}) {
    const defaultOptions = {
      fontSize: this.scaleFont(16),
      fill: '#ffffff',
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: '400',
      align: 'center',
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 2,
        stroke: false,
        fill: true,
      },
    };

    const finalOptions = { ...defaultOptions, ...options };
    return this.add.text(x, y, text, finalOptions).setOrigin(0.5);
  }

  // Common button creation with modern styling
  createStyledButton(x, y, width, height, color, text, callback) {
    const button = this.add
      .rectangle(x, y, width, height, color)
      .setInteractive()
      .setStrokeStyle(2, color + 0x111111)
      .on('pointerdown', () => {
        callback();
        // Add button press effect
        this.tweens.add({
          targets: button,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 100,
          yoyo: true,
        });
      })
      .on('pointerover', () => {
        button.setFillStyle(color + 0x111111);
        this.tweens.add({
          targets: button,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 200,
          ease: 'Power2',
        });
      })
      .on('pointerout', () => {
        button.setFillStyle(color);
        this.tweens.add({
          targets: button,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Power2',
        });
      });

    const buttonText = this.add
      .text(x, y, text, {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 18 : 16),
        fill: '#FFFFFF',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '500',
        align: 'center',
      })
      .setOrigin(0.5);

    return { button, text: buttonText };
  }
}
